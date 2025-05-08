import { NextResponse } from 'next/server';

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
        
        // Ajouter une image par défaut si nécessaire
        const items = data.items?.map(item => ({
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
