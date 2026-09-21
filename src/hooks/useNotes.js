import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiCreate, apiDelete, apiGetAll, apiUpdate, normalizeNote } from '../api/notesApi';
import { generateId } from '../utils/format';
import { CATEGORIES } from '../constants/categories';
import { SEED_NOTES } from '../constants/seedNotes';

const LOCAL_KEY = 'notevault_local';

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pinned | archived
  const [category, setCategory] = useState(null);
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const pushToast = useCallback((message, type = 'info') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const saveLocal = useCallback((allNotes) => {
    const localOnly = allNotes.filter((n) => String(n.id).startsWith('n_'));
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(localOnly));
    } catch {
      // storage full / unavailable — ignore
    }
  }, []);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await apiGetAll();
      const list = Array.isArray(raw) ? raw : [];
      const apiNotes = list.map(normalizeNote).filter(Boolean);
      setNotes([...apiNotes, ...SEED_NOTES, ...readLocal()]);
    } catch (err) {
      console.error(err);
      pushToast('Failed to load notes from API', 'error');
      setNotes([...SEED_NOTES, ...readLocal()]);
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = useCallback(
    async (data) => {
      const now = new Date().toISOString();
      const payload = {
        name: data.title || 'Untitled',
        data: {
          title: data.title,
          content: data.content,
          category: data.category,
          pinned: false,
          archived: false,
          created: now,
          updated: now,
        },
      };
      try {
        const result = await apiCreate(payload);
        setNotes((prev) => {
          const next = [normalizeNote(result), ...prev];
          saveLocal(next);
          return next;
        });
        pushToast('Note created', 'success');
      } catch {
        const note = {
          id: generateId(),
          title: data.title,
          content: data.content,
          category: data.category,
          pinned: false,
          archived: false,
          created: now,
          updated: now,
        };
        setNotes((prev) => {
          const next = [note, ...prev];
          saveLocal(next);
          return next;
        });
        pushToast('Note saved locally', 'success');
      }
    },
    [pushToast, saveLocal],
  );

  const updateNote = useCallback(
    async (id, data) => {
      const existing = notes.find((n) => String(n.id) === String(id));
      if (!existing) return;
      const now = new Date().toISOString();
      const payload = {
        name: data.title || existing.title,
        data: {
          title: data.title ?? existing.title,
          content: data.content ?? existing.content,
          category: data.category ?? existing.category,
          pinned: data.pinned ?? existing.pinned,
          archived: data.archived ?? existing.archived,
          created: existing.created,
          updated: now,
        },
      };
      try {
        await apiUpdate(id, payload);
      } catch {
        // still update locally
      }
      setNotes((prev) => {
        const next = prev.map((n) =>
          String(n.id) === String(id) ? { ...n, ...payload.data, updated: now } : n,
        );
        saveLocal(next);
        return next;
      });
      pushToast('Note updated', 'success');
    },
    [notes, pushToast, saveLocal],
  );

  const deleteNote = useCallback(
    async (id) => {
      try {
        await apiDelete(id);
      } catch {
        // continue locally
      }
      setNotes((prev) => {
        const next = prev.filter((n) => String(n.id) !== String(id));
        saveLocal(next);
        return next;
      });
      pushToast('Note deleted', 'success');
    },
    [pushToast, saveLocal],
  );

  const togglePin = useCallback(
    (id) => {
      const note = notes.find((n) => String(n.id) === String(id));
      if (!note) return Promise.resolve();
      return updateNote(id, { pinned: !note.pinned });
    },
    [notes, updateNote],
  );

  const toggleArchive = useCallback(
    (id) => {
      const note = notes.find((n) => String(n.id) === String(id));
      if (!note) return Promise.resolve();
      return updateNote(id, { archived: !note.archived });
    },
    [notes, updateNote],
  );

  const filteredNotes = useMemo(() => {
    let result = [...notes];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(q) ||
          (n.content || '').toLowerCase().includes(q),
      );
    }
    if (category) {
      result = result.filter((n) => n.category === category);
    } else if (filter === 'pinned') {
      result = result.filter((n) => n.pinned && !n.archived);
    } else if (filter === 'archived') {
      result = result.filter((n) => n.archived);
    } else {
      result = result.filter((n) => !n.archived);
    }
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      switch (sort) {
        case 'newest':
          return new Date(b.updated) - new Date(a.updated);
        case 'oldest':
          return new Date(a.updated) - new Date(b.updated);
        case 'alpha':
          return (a.title || '').localeCompare(b.title || '');
        case 'alpha-rev':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });
    return result;
  }, [notes, searchQuery, category, filter, sort]);

  const counts = useMemo(() => {
    const active = notes.filter((n) => !n.archived);
    const byCategory = {};
    active.forEach((n) => {
      byCategory[n.category] = (byCategory[n.category] || 0) + 1;
    });
    return {
      all: active.length,
      pinned: notes.filter((n) => n.pinned && !n.archived).length,
      archived: notes.filter((n) => n.archived).length,
      byCategory,
    };
  }, [notes]);

  const topbarTitle = category
    ? (CATEGORIES[category]?.label ?? 'Notes')
    : filter === 'pinned'
      ? 'Pinned Notes'
      : filter === 'archived'
        ? 'Archived Notes'
        : 'All Notes';

  const selectFilter = useCallback((f) => {
    setFilter(f);
    setCategory(null);
  }, []);

  const selectCategory = useCallback((cat) => {
    setCategory((prev) => (prev === cat ? null : cat));
    setFilter('all');
  }, []);

  return {
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
    setSort,
    setView,
    setSearchQuery,
    selectFilter,
    selectCategory,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    pushToast,
    reload: loadNotes,
  };
}
