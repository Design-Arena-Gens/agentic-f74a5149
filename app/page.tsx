'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { Page } from './types';

export default function Home() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('notion-pages');
    if (stored) {
      const loadedPages = JSON.parse(stored);
      setPages(loadedPages);
      if (loadedPages.length > 0 && !currentPageId) {
        setCurrentPageId(loadedPages[0].id);
      }
    } else {
      const welcomePage: Page = {
        id: '1',
        title: 'Welcome to Notion Clone',
        content: '<h1>Welcome!</h1><p>This is a minimal Notion clone built with Next.js and React.</p><h2>Features</h2><ul><li>Create multiple pages</li><li>Rich text editing</li><li>Auto-save to local storage</li><li>Clean, minimal interface</li></ul><h2>Getting Started</h2><p>Click the "+ New Page" button in the sidebar to create a new page.</p><p>Start typing to edit this page!</p>',
        icon: '👋',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setPages([welcomePage]);
      setCurrentPageId(welcomePage.id);
      localStorage.setItem('notion-pages', JSON.stringify([welcomePage]));
    }
  }, []);

  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem('notion-pages', JSON.stringify(pages));
    }
  }, [pages]);

  const currentPage = pages.find(p => p.id === currentPageId);

  const handleCreatePage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: '',
      content: '',
      icon: '📄',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setPages([...pages, newPage]);
    setCurrentPageId(newPage.id);
  };

  const handleDeletePage = (id: string) => {
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    if (currentPageId === id) {
      setCurrentPageId(newPages.length > 0 ? newPages[0].id : null);
    }
  };

  const handleUpdatePage = (id: string, updates: Partial<Page>) => {
    setPages(pages.map(p =>
      p.id === id
        ? { ...p, ...updates, updatedAt: Date.now() }
        : p
    ));
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        pages={pages}
        currentPageId={currentPageId}
        onSelectPage={setCurrentPageId}
        onCreatePage={handleCreatePage}
        onDeletePage={handleDeletePage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 overflow-hidden">
        {currentPage ? (
          <Editor
            page={currentPage}
            onUpdate={(updates) => handleUpdatePage(currentPage.id, updates)}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-xl mb-4">No pages yet</p>
              <button
                onClick={handleCreatePage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create your first page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
