export default function Button({ onClick , children, className = '', type='button', disabled=false }: { onClick?: () => void; children: React.ReactNode; className?: string, type?: 'button' | 'submit', disabled?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`bg-secondary flex text-white px-4 py-2 rounded-lg hover:bg-dark transition-colors ${className}`}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    );
}