import { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { fmtFullDate } from '../utils/format';

export default function EditorPanel({
  open,
  note,
  onClose,
  onSave,
  onTogglePin,
  onToggleArchive,
  onDelete,
  pushToast,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const isEditing = !!note;

  useEffect(() => {
    if (open) {
      setTitle(note?.title || '');
      setContent(note?.content || '');
      setCategory(note?.category || 'personal');
    }
  }, [open, note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) {
      pushToast('Please add a title or some content', 'error');
      return;
    }
    await onSave({ title: t || 'Untitled', content: c, category });
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-200 bg-black/30 backdrop-blur-[2px] transition-opacity duration-250 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed top-0 right-0 z-210 flex h-screen w-130 max-w-full flex-col bg-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Close editor"
              className="cursor-pointer rounded-md p-1 text-[1.15rem] text-gray-500 transition hover:bg-gray-100"
            >
              <i className="bi bi-arrow-left" />
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {isEditing ? 'Edit Note' : 'New Note'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onTogglePin}
              title="Pin note"
              disabled={!isEditing}
              className={`cursor-pointer rounded-md p-1.5 text-base transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 ${
                note?.pinned ? 'text-accent' : 'text-gray-400'
              }`}
            >
              <i className="bi bi-pin" />
            </button>
            <button
              onClick={onToggleArchive}
              title="Archive note"
              disabled={!isEditing}
              className={`cursor-pointer rounded-md p-1.5 text-base transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 ${
                note?.archived ? 'text-accent' : 'text-gray-400'
              }`}
            >
              <i className="bi bi-archive" />
            </button>
            <button
              onClick={onDelete}
              title="Delete note"
              disabled={!isEditing}
              className="cursor-pointer rounded-md p-1.5 text-base text-gray-400 transition hover:bg-danger-light hover:text-danger disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            >
              <i className="bi bi-trash3" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="px-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              autoComplete="off"
              className="w-full bg-transparent pt-5 pb-2 text-[1.35rem] font-bold text-gray-900 outline-none placeholder:text-gray-300"
            />
          </div>

          <div className="flex gap-3 px-5 pb-2">
            <div className="flex items-center gap-2">
              <label className="text-[0.78rem] font-medium tracking-wide text-gray-400 uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="cursor-pointer rounded-md border border-gray-200 bg-white px-2.5 py-1.25 text-[0.82rem] text-gray-700 outline-none focus:border-accent"
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full flex-1 resize-none bg-transparent px-5 py-3 text-[0.92rem] leading-relaxed text-gray-700 outline-none placeholder:text-gray-300"
          />

          <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-5 py-3">
            <div className="text-xs text-gray-400">
              {note && (
                <>
                  Created: {fmtFullDate(note.created)} &nbsp;·&nbsp; Updated:{' '}
                  {fmtFullDate(note.updated)}
                </>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-[0.88rem] font-semibold text-white transition hover:bg-accent-hover active:scale-[0.97]"
            >
              <i className="bi bi-check-lg" /> Save Note
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
