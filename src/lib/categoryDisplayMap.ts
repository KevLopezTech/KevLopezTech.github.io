// This object maps your URL slugs (which come from folder names) to display names.
const categoryDisplayNames: { [slug: string]: string } = {
    "artificial-intelligence": "Artificial Intelligence",
    "game-development": "Game Development", // Example if you have a 'game-dev' folder
    "internet-of-things": "Internet of Things",
    "web-dev": "Web Development", // Example for your existing 'web-dev' folder
    // Add more mappings here as you create more categories
    // slug: "Display Name"
};

/**
 * Gets the user-friendly display name for a given category slug.
 * Falls back to capitalizing the slug if no specific mapping is found.
 */
export function getCategoryDisplayName(slug: string): string {
    const lowerSlug = slug.toLowerCase();
    if (categoryDisplayNames[lowerSlug]) {
        return categoryDisplayNames[lowerSlug];
    }
    // Fallback: capitalize the first letter and replace hyphens with spaces
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}