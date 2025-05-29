import React, { useState } from 'react';

interface Props {
  code: string;
  language: string;
}

const CodeSuggestions: React.FC<Props> = ({ code, language }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setOpen(true);
    setSuggestions(null);
    const res = await fetch('/api/ai-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    const data = await res.json();
    setSuggestions(data.suggestions);
    setLoading(false);
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={fetchSuggestions}
        disabled={!code || !language}
      >
        Get AI Suggestions
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">AI Suggestions</h2>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: suggestions ? suggestions.replace(/\n/g, '<br/>') : '' }} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CodeSuggestions;