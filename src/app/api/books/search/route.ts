import { NextResponse } from 'next/server';
import { checkBookExists } from '@/app/utils/bookCrud';


/**
 * This API route fetches a list of books from the Google Books API based on a search query.
 * If no query is provided, it defaults to 'programming'.
 * The results are limited to 5 items and are restricted to French language books.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'programming';

    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                query
            )}&projection=lite&maxResults=20&langRestrict=fr`
        );
        if (!response.ok) {
            throw new Error('Erreur lors de la requête API');
        }
        const data = await response.json();
        
        interface GoogleBookVolumeInfo {
            imageLinks?: {
            thumbnail: string;
            };
            [key: string]: any;
        }

        interface GoogleBookItem {
            volumeInfo: GoogleBookVolumeInfo;
            [key: string]: any;
        }

        const items: GoogleBookItem[] = data.items?.map((item: GoogleBookItem) => ({
            ...item,
            volumeInfo: {
            ...item.volumeInfo,
            imageLinks: item.volumeInfo.imageLinks || {
                thumbnail: 'https://placehold.co/118x190?text=No+Image',
            }
            }
        })) || [];

        for (const item of items) {
            if (await checkBookExists(item.id)) {
                // console.log(`Le livre avec l'ID ${item.id} existe déjà dans la base de données.`);
                const reviews = fetch(process.env.NEXT_PUBLIC_API_URL + `/api/books/review?bookId=${item.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(res => res.json())
                .catch(err => {
                    console.error(`Erreur lors de la récupération des critiques pour le livre ${item.id}:`, err);
                    return [];
                });
                const data = await reviews;
                if (data && data.length > 0) {
                    const sum = data.reduce((acc, review) => acc + review.note, 0);
                    const average = sum / data.length;
                    item.reviews = average;
                    item.nbReviews = data.length;
                }
            }
        }

        return NextResponse.json({ data: items }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur serveur', debug: error }, { status: 500 });
    }
}
