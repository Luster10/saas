"use client"

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function Home() {
    const [idea, setIdea] = useState<string>('');
    const [generation, setGeneration] = useState(0);
    const [isGenerating, setIsGenerating] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let buffer = '';
        const evt = new EventSource('/api');

        evt.onmessage = (e) => {
            buffer += e.data;
            setIdea(buffer);
        };
        evt.onerror = () => {
            evt.close();
            setIsGenerating(false);
            if (!buffer) {
                console.error('SSE error: unable to generate an idea');
                setError('Unable to generate an idea. Please try again.');
            }
        };

        return () => { evt.close(); };
    }, [generation]);

    const generateIdea = () => {
        setIdea('');
        setError('');
        setIsGenerating(true);
        setGeneration((current) => current + 1);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Business Idea Generator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        AI-powered innovation at your fingertips
                    </p>
                </header>

                {/* Content Card */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95">
                        {isGenerating && !idea ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-pulse text-gray-400">
                                    Generating your business idea...
                                </div>
                            </div>
                        ) : idea ? (
                            <div className="markdown-content text-gray-700 dark:text-gray-300">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                >
                                    {idea}
                                </ReactMarkdown>
                            </div>
                        ) : error ? (
                            <p role="alert" className="py-12 text-center text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        ) : null}

                        <div className="mt-8 flex justify-center border-t border-gray-100 pt-6 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={generateIdea}
                                disabled={isGenerating}
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isGenerating ? 'Generating idea...' : 'Generate another idea'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
