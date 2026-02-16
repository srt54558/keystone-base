import { createHighlighter, type Highlighter } from 'shiki';

let highlighterInstance: Highlighter | null = null;

export async function getHighlighter() {
    if (highlighterInstance) return highlighterInstance;

    highlighterInstance = await createHighlighter({
        themes: ['vesper'],
        langs: ['typescript', 'json', 'markdown', 'sql']
    });

    return highlighterInstance;
}