
export default function LibraryBookPage({
    params: { libraryId, bookId },
    }: {
    params: { libraryId: string; bookId: string };
    }) {
    return (
        <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Library Book Page</h1>
        <p>Library ID: {libraryId}</p>
        <p>Book ID: {bookId}</p>
        {/* Additional components can be added here */}
        </div>
    );
}