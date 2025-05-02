
export default function Navbar() {
    return (
        <div className="flex justify-between items-center p-4 bg-[#EBE5C2]">
            <div className="text-lg font-bold">Dreams</div>
            <nav className="flex space-x-4">
                <a href="/" className="hover:text-gray-400">Mon compte</a>
            </nav>
        </div>
    );
}