import { NextResponse } from 'next/server';


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
            )}&projection=lite&maxResults=5&langRestrict=fr`
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

        return NextResponse.json({ data: items }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
