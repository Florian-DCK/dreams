
export default async function Details({ params }: { params: { id: string } }) {
    const { id } = params;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Détails du livre</h1>
            <p>Cette page affichera les détails du livre {id}</p>
        </div>
    );

}