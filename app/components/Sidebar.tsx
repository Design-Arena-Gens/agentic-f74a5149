'use client';

import { Page } from '../types';
import { FileText, Plus, Trash2, ChevronRight } from 'lucide-react';

interface SidebarProps {
  pages: Page[];
  currentPageId: string | null;
  onSelectPage: (id: string) => void;
  onCreatePage: () => void;
  onDeletePage: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  pages,
  currentPageId,
  onSelectPage,
  onCreatePage,
  onDeletePage,
  isOpen,
}: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText size={24} />
          Notion Clone
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <button
          onClick={onCreatePage}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg mb-2 transition-colors"
        >
          <Plus size={16} />
          New Page
        </button>

        <div className="space-y-1">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                currentPageId === page.id
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div
                onClick={() => onSelectPage(page.id)}
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                <span className="text-lg flex-shrink-0">{page.icon}</span>
                <span className="text-sm truncate">
                  {page.title || 'Untitled'}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this page?')) {
                    onDeletePage(page.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        {pages.length} {pages.length === 1 ? 'page' : 'pages'}
      </div>
    </div>
  );
}
