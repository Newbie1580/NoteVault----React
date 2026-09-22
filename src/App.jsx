import { useCallback, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import NotesGrid from './components/NotesGrid';
import EditorPanel from './components/EditorPanel';
import DeleteDialog from './components/DeleteDialog';
import Toasts from './components/Toasts';
import { useNotes } from './hooks/useNotes';

function App() {
  const store = useNotes();
  const {
    notes,
    loading,
    filter,
    category,
    sort,
    view,
    searchQuery,
    toasts,
    filteredNotes,
    counts,
    topbarTitle,
  } = store;

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('notevault_sidebar_collapsed') === '1';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      try {
        localStorage.setItem('notevault_sidebar_collapsed', prev ? '0' : '1');
      } catch {
        // ignore
      }
      return !prev;
    });
  }, []);

  const expandSidebar = useCallback(() => {
    setCollapsed((prev) => {
      if (!prev) return prev;
      try {
        localStorage.setItem('notevault_sidebar_collapsed', '0');
      } catch {
        // ignore
      }
      return false;
    });
  }, []);

  const editingNote = editingId
    ? (notes.find((n) => String(n.id) === String(editingId)) ?? null)
    : null;

  const openEditor = useCallback((id = null) => {
    setEditingId(id);
    setEditorOpen(true);
    setSidebarOpen(false);
  }, []);

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditingId(null);
  }, []);

  const handleSave = useCallback(
    async (data) => {
      if (editingId) {
        await store.updateNote(editingId, data);
      } else {
        await store.createNote(data);
      }
    },
    [editingId, store],
  );

  const handleTogglePin = useCallback(async () => {
    if (!editingId || !editingNote) return;
    await store.updateNote(editingId, { pinned: !editingNote.pinned });
    // refresh local editing snapshot by updating editingId state trigger
    setEditingId((id) => id);
  }, [editingId, editingNote, store]);

  const handleToggleArchive = useCallback(async () => {
    if (!editingId) return;
    await store.toggleArchive(editingId);
    closeEditor();
  }, [editingId, store, closeEditor]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    closeEditor();
    await store.deleteNote(id);
  }, [deleteTargetId, store, closeEditor]);

  // Keyboard shortcuts (ported from vanilla): Esc, Ctrl/Cmd+N, Ctrl/Cmd+K, Ctrl/Cmd+B
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (deleteTargetId) setDeleteTargetId(null);
        else if (editorOpen) closeEditor();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openEditor();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        expandSidebar();
        requestAnimationFrame(() => {
          document.getElementById('searchInput')?.focus();
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [deleteTargetId, editorOpen, closeEditor, openEditor, expandSidebar, toggleCollapsed]);

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        counts={counts}
        filter={filter}
        category={category}
        searchQuery={searchQuery}
        onSearch={store.setSearchQuery}
        onSelectFilter={(f) => {
          store.selectFilter(f);
          setSidebarOpen(false);
        }}
        onSelectCategory={(c) => {
          store.selectCategory(c);
          setSidebarOpen(false);
        }}
        onNewNote={() => openEditor()}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={toggleCollapsed}
        onExpand={expandSidebar}
      />

      {/* Mobile sidebar scrim */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-90 bg-black/30 md:hidden"
        />
      )}

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          title={topbarTitle}
          view={view}
          onViewChange={store.setView}
          sort={sort}
          onSortChange={store.setSort}
          onOpenMenu={() => setSidebarOpen(true)}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
        />
        <NotesGrid
          notes={filteredNotes}
          loading={loading}
          view={view}
          onOpen={(id) => openEditor(id)}
          onNewNote={() => openEditor()}
        />
      </main>

      <EditorPanel
        open={editorOpen}
        note={editingNote}
        onClose={closeEditor}
        onSave={handleSave}
        onTogglePin={handleTogglePin}
        onToggleArchive={handleToggleArchive}
        onDelete={() => editingId && setDeleteTargetId(editingId)}
        pushToast={store.pushToast}
      />

      <DeleteDialog
        open={!!deleteTargetId}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />

      <Toasts toasts={toasts} />
    </div>
  );
}

export default App;
