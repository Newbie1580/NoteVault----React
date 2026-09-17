import { CATEGORIES, CATEGORY_BADGE_STYLES } from '../constants/categories';
import { fmtDate } from '../utils/format';

export default function NoteCard({ note, layout = 'grid', onOpen }) {
  const cat = CATEGORIES[note.category] || CATEGORIES.personal;

  if (layout === 'list') {
    return (
      <div
        onClick={() => onOpen(note.id)}
        className={`flex cursor-pointer flex-row items-center gap-4 rounded-xl border bg-white px-[18px] py-3.5 transition duration-150 hover:-translate-y-px hover:border-gray-300 hover:shadow-md ${
          note.pinned ? 'border-accent bg-gradient-to-br from-[#fafafe] to-accent-light' : 'border-gray-200'
        } ${note.archived ? 'opacity-60' : ''}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="mr-2 min-w-0 flex-1 truncate text-[0.95rem] font-semibold text-gray-900">
            {note.title || 'Untitled'}
          </div>
          {note.pinned && <i className="bi bi-pin-fill shrink-0 text-xs text-accent" />}
        </div>
        <div className="hidden w-[40%] truncate text-[0.85rem] text-gray-500 md:block">
          {note.content}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`rounded px-2 py-0.5 text-[0.72rem] font-semibold tracking-wide uppercase ${CATEGORY_BADGE_STYLES[note.category] || 'bg-gray-100 text-gray-500'}`}
          >
            {cat.label}
          </span>
          <span className="text-xs text-gray-400">{fmtDate(note.updated)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(note.id)}
      className={`flex cursor-pointer flex-col rounded-xl border bg-white p-[18px] transition duration-150 hover:-translate-y-px hover:border-gray-300 hover:shadow-md ${
        note.pinned ? 'border-accent bg-gradient-to-br from-[#fafafe] to-accent-light' : 'border-gray-200'
      } ${note.archived ? 'opacity-60' : ''}`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="mr-2 line-clamp-2 flex-1 text-[0.95rem] leading-snug font-semibold text-gray-900">
          {note.title || 'Untitled'}
        </div>
        {note.pinned && <i className="bi bi-pin-fill shrink-0 text-xs text-accent" />}
      </div>
      <div className="mb-3 line-clamp-4 flex-1 text-[0.85rem] leading-relaxed whitespace-pre-wrap text-gray-500">
        {note.content}
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
        <span
          className={`rounded px-2 py-0.5 text-[0.72rem] font-semibold tracking-wide uppercase ${CATEGORY_BADGE_STYLES[note.category] || 'bg-gray-100 text-gray-500'}`}
        >
          {cat.label}
        </span>
        <span className="text-xs text-gray-400">{fmtDate(note.updated)}</span>
      </div>
    </div>
  );
}
