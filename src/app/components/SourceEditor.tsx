"use client";

import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

// Custom Grammar for our "Proposal Language"
// We extend JavaScript to include our special placeholder syntax
Prism.languages.proposal = Prism.languages.extend('javascript', {});

Prism.languages.insertBefore('proposal', 'comment', {
    'placeholder': {
        pattern: /\[.*?\]/, // Matches anything inside square brackets
        alias: 'token-placeholder'
    }
});

interface SourceEditorProps {
    value: string;
    onChange: (code: string) => void;
    placeholder?: string;
}

const SourceEditor = ({ value, onChange, placeholder }: SourceEditorProps) => {

    const highlight = (code: string) => {
        return Prism.highlight(code, Prism.languages.proposal, 'proposal')
            .split('\n')
            .map((line, i) => `<span class="line-number text-gray-400 dark:text-gray-700 select-none mr-4 text-xs font-mono inline-block w-4 text-right">${i + 1}</span>${line}`)
            .join('\n');
    };

    return (
        <div className="relative flex-1 custom-scrollbar overflow-auto font-mono text-sm">
            {/* We need to inject the custom styles for our tokens */}
            <style jsx global>{`
          .token.comment {
            color: #6b7280 !important; /* text-gray-500 */
            font-style: italic;
          }
          
          /* Default (Light Mode) */
          .token.token-placeholder {
            color: #4f46e5 !important; /* text-indigo-600 */
            font-weight: bold;
          }

          /* Dark Mode Override */
          :global(.dark) .token.token-placeholder {
            color: #818cf8 !important; /* text-indigo-400 */
          }

          /* Override Editor styles to match our design */
          .prism-editor-textarea { 
              outline: none !important;
          }
        `}</style>

            <Editor
                value={value}
                onValueChange={onChange}
                highlight={code => Prism.highlight(code, Prism.languages.proposal, 'proposal')}
                padding={24}
                textareaClassName="focus:outline-none"
                className="font-mono text-gray-900 dark:text-gray-300 min-h-full"
                style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 14,
                    backgroundColor: 'transparent',
                    minHeight: '100%'
                }}
                placeholder={placeholder}
            />
        </div>
    );
};

export default SourceEditor;
