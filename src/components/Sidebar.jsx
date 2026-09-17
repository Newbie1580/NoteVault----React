import { CATEGORIES } from '../constants/categories';

const VIEWS = [
  { value: 'all', label: 'All Notes', icon: 'bi-grid' },
  { value: 'pinned', label: 'Pinned', icon: 'bi-pin-angle' },
  { value: 'archived', label: 'Archived', icon: 'bi-archive' },
];

export default function Sidebar({
  open,
  counts,
  filter,
  category,
  searchQuery,
  onSearch,
  onSelectFilter,
  onSelectCategory,
  onNewNote,
  onClose,
}) {
  return (
    <aside
      className={`fixed top-0 left-0 z-100 flex h-screen w-[260px] flex-col border-r border-gray-200 bg-white transition-transform duration-250 ${
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-accent text-base text-white">
            <i className="bi bi-journal-text" />
          </div>
          <span className="text-[1.15rem] font-bold tracking-tight text-gray-900">NoteVault</span>
        </div>
        <button
          className="cursor-pointer p-1 text-xl text-gray-500 md:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <i className="bi bi-list" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <button
          onClick={onNewNote}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
        >
          <i className="bi bi-plus-lg" />
          <span>New Note</span>
        </button>
      </div>

      <div className="relative mx-4 mb-2">
        <i className="bi bi-search absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-gray-400" />
        <input
          id="searchInput"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search notes..."
          autoComplete="off"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-8 text-[0.85rem] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-accent focus:ring-3 focus:ring-accent-muted"
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-5 pt-3 pb-1.5 text-[0.7rem] font-semibold tracking-wider text-gray-400 uppercase">
          Views
        </div>
        {VIEWS.map((v) => {
          const count = v.value === 'all' ? counts.all : counts[v.value];
          const active = filter === v.value && !category;
          return (
            <button
              key={v.value}
              onClick={() => onSelectFilter(v.value)}
              className={`flex w-full cursor-pointer items-center gap-2.5 px-5 py-2 text-left text-[0.88rem] transition ${
                active
                  ? 'bg-accent-light font-medium text-accent'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <i className={`${v.icon} w-5 shrink-0 text-center text-base`} />
              <span className="flex-1">{v.label}</span>
              <span
                className={`min-w-[22px] rounded-full px-[7px] py-px text-center text-[0.72rem] font-semibold ${
                  active ? 'bg-accent-muted text-accent' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        <div className="px-5 pt-3 pb-1.5 text-[0.7rem] font-semibold tracking-wider text-gray-400 uppercase">
          Categories
        </div>
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const active = category === key;
          return (
            <button
              key={key}
              onClick={() => onSelectCategory(key)}
              className={`flex w-full cursor-pointer items-center gap-2.5 px-5 py-2 text-left text-[0.88rem] transition ${
                active
                  ? 'bg-accent-light font-medium text-accent'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: cat.color }}
              />
              <span className="flex-1">{cat.label}</span>
              <span
                className={`min-w-[22px] rounded-full px-[7px] py-px text-center text-[0.72rem] font-semibold ${
                  active ? 'bg-accent-muted text-accent' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {counts.byCategory[key] || 0}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <i className="bi bi-cloud" />
          <span>Synced with REST API</span>
        </div>
      </div>
    </aside>
  );
}
