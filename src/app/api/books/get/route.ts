import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get('id') || 'programming';

	try {
        console.log(query)
		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
				query
			)}`
		);
		if (!response.ok) {
			throw new Error('Erreur lors de la requête API');
		}
		const data = await response.json();
		return NextResponse.json({ data }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
