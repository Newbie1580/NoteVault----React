import { useEffect, useRef, useState } from 'react';
import { SORT_OPTIONS } from '../constants/categories';

export default function Topbar({
  title,
  view,
  onViewChange,
  sort,
  onSortChange,
  onOpenMenu,
  collapsed,
  onToggleCollapse,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [sortOpen]);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 md:px-6">
      <button
        className="cursor-pointer p-1 text-[1.3rem] text-gray-600 md:hidden"
        onClick={onOpenMenu}
        aria-label="Open menu"
      >
        <i className="bi bi-list" />
      </button>
      {onToggleCollapse && (
        <button
          className="hidden cursor-pointer rounded-md p-1.5 text-base text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 md:block"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
        >
          <i className={`bi ${collapsed ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar'}`} />
        </button>
      )}
      <div className="flex-1 text-[1.05rem] font-semibold text-gray-900">{title}</div>
      <div className="flex items-center gap-2">
        <div className="hidden rounded-lg bg-gray-100 p-0.5 min-[480px]:flex">
          <button
            onClick={() => onViewChange('grid')}
            title="Grid view"
            className={`cursor-pointer rounded-md px-2.5 py-[5px] text-sm transition ${
              view === 'grid' ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <i className="bi bi-grid-3x3-gap" />
          </button>
          <button
            onClick={() => onViewChange('list')}
            title="List view"
            className={`cursor-pointer rounded-md px-2.5 py-[5px] text-sm transition ${
              view === 'list' ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <i className="bi bi-list-ul" />
          </button>
        </div>
        <div className="relative" ref={sortRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSortOpen((o) => !o);
            }}
            title="Sort notes"
            className="cursor-pointer rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <i className="bi bi-arrow-down-up" />
          </button>
          {sortOpen && (
            <div className="absolute top-full right-0 z-150 mt-1.5 min-w-[180px] rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSortChange(opt.value);
                    setSortOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-[0.85rem] transition ${
                    sort === opt.value
                      ? 'bg-accent-light font-medium text-accent'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={`bi ${opt.icon}`} /> {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
