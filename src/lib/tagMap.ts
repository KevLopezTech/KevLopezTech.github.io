/**
 * A map that associates category slugs with an array of relevant search tags.
 * The keys should be the normalized, URL-friendly slugs (e.g., 'ai', 'gamedev').
 * The values are the various strings we want to match against in the project frontmatter.
 * This allows a URL like /projects/ai to match projects with a tag of "Machine Learning".
 */
export const categoryTagMap: Record<string, string[]> = {
    'ai': [
        'ai',
        'artificial intelligence',
        'machine learning',
        'ml',
        'deep learning',
        'neural networks'
    ],
    'gamedev': [
        'game development',
        'game dev',
        'unity',
        'unreal engine',
        'gamedev'
    ],
    'iot': [
        'iot',
        'internet of things',
        'embedded systems',
        'robotics',
        'raspberry pi',
        'arduino'
    ],
    'web-dev': [
        'web dev',
        'web development',
        'nextjs',
        'react',
        'tailwind css',
        'frontend',
        'backend'
    ]
    // Add other categories and their associated tags here
};