import React, { useRef, useEffect } from 'react';
import { JSONEditor } from 'vanilla-jsoneditor';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';

export default function JsonView({ value, onChange, height = 'h-96' }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Create editor instance
    if (containerRef.current && !editorRef.current) {
      editorRef.current = new JSONEditor({
        target: containerRef.current,
        props: {
          content: {
            json: value || {}
          },
          onChange: (updatedContent) => {
            console.log('JsonView onChange triggered:', updatedContent);
            // Call onChange with the updated JSON
            // vanilla-jsoneditor can return either { json: ... } or { text: ... }
            if (onChange) {
              if (updatedContent.json !== undefined) {
                console.log('Calling parent onChange with json:', updatedContent.json);
                onChange(updatedContent.json);
              } else if (updatedContent.text !== undefined) {
                // If in text mode, try to parse it
                try {
                  const parsed = JSON.parse(updatedContent.text);
                  console.log('Calling parent onChange with parsed text:', parsed);
                  onChange(parsed);
                } catch (e) {
                  console.log('Text is not valid JSON yet:', e.message);
                  // Don't update if text is invalid JSON
                }
              }
            }
          },
          mode: 'tree', // Start in tree mode, user can switch to text mode
        }
      });
    }

    return () => {
      // Cleanup editor on unmount
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      editorRef.current.set({
        json: value || {}
      });
    }
  }, [value]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full ${height} border border-gray-300 rounded-lg overflow-hidden`}
      style={{ minHeight: '400px' }}
    />
  );
}
