'use client';

import { useRef, useEffect, useState } from 'react';
import { Page } from '../types';
import { Menu, Bold, Italic, List, ListOrdered, Code } from 'lucide-react';

interface EditorProps {
  page: Page;
  onUpdate: (updates: Partial<Page>) => void;
  onToggleSidebar: () => void;
}

export default function Editor({ page, onUpdate, onToggleSidebar }: EditorProps) {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [page.title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleContentInput = () => {
    if (contentRef.current) {
      onUpdate({ content: contentRef.current.innerHTML });
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    setSelectedText(!!selection && selection.toString().length > 0);
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
    handleContentInput();
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const heading = document.createElement(`h${level}`);
      heading.textContent = selection.toString() || 'Heading';

      range.deleteContents();
      range.insertNode(heading);

      // Move cursor after heading
      range.setStartAfter(heading);
      range.setEndAfter(heading);
      selection.removeAllRanges();
      selection.addRange(range);

      handleContentInput();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-2 bg-white sticky top-0 z-10">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
          <button
            onClick={() => applyFormat('bold')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => applyFormat('insertUnorderedList')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => applyFormat('insertOrderedList')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            onClick={() => applyFormat('formatBlock', 'pre')}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Code Block"
          >
            <Code size={18} />
          </button>

          <div className="border-l border-gray-200 pl-2 ml-1 flex gap-1">
            <button
              onClick={() => insertHeading(1)}
              className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-semibold transition-colors"
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={() => insertHeading(2)}
              className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-semibold transition-colors"
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={() => insertHeading(3)}
              className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-semibold transition-colors"
              title="Heading 3"
            >
              H3
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-16 py-12">
          {/* Icon and Title */}
          <div className="mb-4">
            <button
              className="text-6xl mb-4 hover:bg-gray-100 px-2 rounded transition-colors"
              onClick={() => {
                const emojis = ['📄', '📝', '📋', '📌', '📍', '🎯', '💡', '⭐', '🔥', '✨', '🎨', '🚀'];
                const newIcon = emojis[Math.floor(Math.random() * emojis.length)];
                onUpdate({ icon: newIcon });
              }}
              title="Change icon"
            >
              {page.icon}
            </button>
            <textarea
              ref={titleRef}
              value={page.title}
              onChange={handleTitleChange}
              className="page-title"
              placeholder="Untitled"
              rows={1}
            />
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentInput}
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            className="editor-content"
            data-placeholder="Start writing..."
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
}
