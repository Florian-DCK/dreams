export function formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
        }).format(new Date(dateString));
    } catch (e) {
        return dateString; // Si le format n'est pas valide, retourne la chaîne d'origine
    }
};

export function truncateText(text:string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}