"use client";
import { useEffect, use } from 'react';
import { checkBookExists, fetchBook } from '@/app/utils/bookCrud';

export default function Details({ params }: { params: { id: string } }) {
    const { id } = use(params);
    
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                console.log("ID du livre:", id);
                const bookExists = await checkBookExists(id);
                if (!bookExists) {
                    await fetchBook(id);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails du livre:", error);
            }
        }  
        fetchBookDetails();
    }, [id]); 

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Détails du livre</h1>
            <p>Cette page affichera les détails du livre {id}</p>
        </div>
    );
}