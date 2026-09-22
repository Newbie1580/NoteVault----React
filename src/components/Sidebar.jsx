import { CATEGORIES } from '../constants/categories';

const VIEWS = [
  { value: 'all', label: 'All Notes', icon: 'bi-grid' },
  { value: 'pinned', label: 'Pinned', icon: 'bi-pin-angle' },
  { value: 'archived', label: 'Archived', icon: 'bi-archive' },
];

const CATEGORY_ICONS = {
  personal: 'bi-person',
  work: 'bi-briefcase',
  ideas: 'bi-lightbulb',
  tasks: 'bi-check2-square',
  study: 'bi-book',
};

function CountBadge({ count, active }) {
  if (!count || count <= 0) return null;
  const display = count > 99 ? '99+' : count;
  return (
    <span
      className={`absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[0.65rem] leading-none font-bold text-white shadow-sm ring-2 ring-white ${
        active ? 'bg-accent' : 'bg-gray-500'
      }`}
    >
      {display}
    </span>
  );
}

function CountPill({ count, active }) {
  return (
    <span
      className={`min-w-[22px] rounded-full px-[7px] py-px text-center text-[0.72rem] font-semibold ${
        active ? 'bg-accent-muted text-accent' : 'bg-gray-200 text-gray-600'
      }`}
    >
      {count || 0}
    </span>
  );
}

export default function Sidebar({
  open,
  collapsed = false,
  counts,
  filter,
  category,
  searchQuery,
  onSearch,
  onSelectFilter,
  onSelectCategory,
  onNewNote,
  onClose,
  onToggleCollapse,
  onExpand,
}) {
  return (
    <aside
      className={`fixed top-0 left-0 z-100 flex h-screen shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-250 md:sticky ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      } ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div
        className={`flex items-center pt-4 pb-3 ${
          collapsed ? 'flex-col gap-2 px-2' : 'justify-between px-4'
        }`}
      >
        <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-accent text-base text-white">
            <i className="bi bi-journal-text" />
          </div>
          {!collapsed && (
            <span className="text-[1.15rem] font-bold tracking-tight text-gray-900">
              NoteVault
            </span>
          )}
        </div>
        {!collapsed ? (
          <div className="flex items-center gap-1">
            <button
              className="hidden cursor-pointer rounded-md p-1.5 text-base text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 md:block"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              title="Collapse sidebar (Ctrl+B)"
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              className="cursor-pointer p-1 text-xl text-gray-500 md:hidden"
              onClick={onClose}
              aria-label="Close menu"
            >
              <i className="bi bi-list" />
            </button>
          </div>
        ) : (
          <button
            className="hidden cursor-pointer rounded-md p-1.5 text-base text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 md:block"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar (Ctrl+B)"
          >
            <i className="bi bi-chevron-right" />
          </button>
        )}
      </div>

      <div className={collapsed ? 'px-3 pb-3' : 'px-4 pb-3'}>
        <button
          onClick={onNewNote}
          title={collapsed ? 'New Note (Ctrl+N)' : undefined}
          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg bg-accent text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98] ${
            collapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2.5'
          }`}
        >
          <i className="bi bi-plus-lg" />
          {!collapsed && <span>New Note</span>}
        </button>
      </div>

      {collapsed ? (
        <div className="mb-2 flex justify-center px-3">
          <button
            onClick={onExpand}
            title="Expand to search (Ctrl+K)"
            aria-label="Expand to search"
            className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <i className="bi bi-search" />
          </button>
        </div>
      ) : (
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
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        {!collapsed && (
          <div className="px-5 pt-3 pb-1.5 text-[0.7rem] font-semibold tracking-wider text-gray-400 uppercase">
            Views
          </div>
        )}
        {VIEWS.map((v) => {
          const count = v.value === 'all' ? counts.all : counts[v.value];
          const active = filter === v.value && !category;
          return (
            <button
              key={v.value}
              onClick={() => onSelectFilter(v.value)}
              title={collapsed ? `${v.label}${count ? ` (${count})` : ''}` : undefined}
              className={`flex w-full cursor-pointer items-center gap-2.5 py-2 text-left text-[0.88rem] transition ${
                collapsed ? 'justify-center px-0' : 'px-5'
              } ${
                active
                  ? 'bg-accent-light font-medium text-accent'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span
                className={`relative inline-flex shrink-0 items-center justify-center overflow-visible ${
                  collapsed ? 'h-9 w-9 rounded-lg' : ''
                }`}
              >
                <i
                  className={`${v.icon} text-center ${collapsed ? 'text-lg' : 'w-5 text-base'}`}
                />
                {collapsed && <CountBadge count={count} active={active} />}
              </span>
              {!collapsed && <span className="flex-1">{v.label}</span>}
              {!collapsed && <CountPill count={count} active={active} />}
            </button>
          );
        })}

        {!collapsed && (
          <div className="px-5 pt-3 pb-1.5 text-[0.7rem] font-semibold tracking-wider text-gray-400 uppercase">
            Categories
          </div>
        )}
        {collapsed && <div className="mx-3 my-2 border-t border-gray-100" />}
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const active = category === key;
          const count = counts.byCategory[key] || 0;
          return (
            <button
              key={key}
              onClick={() => onSelectCategory(key)}
              title={collapsed ? `${cat.label}${count ? ` (${count})` : ''}` : undefined}
              className={`flex w-full cursor-pointer items-center gap-2.5 py-2 text-left text-[0.88rem] transition ${
                collapsed ? 'justify-center px-0' : 'px-5'
              } ${
                active
                  ? 'bg-accent-light font-medium text-accent'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span
                className={`relative inline-flex shrink-0 items-center justify-center overflow-visible ${
                  collapsed ? 'h-9 w-9 rounded-lg' : 'h-5 w-5'
                }`}
              >
                {collapsed ? (
                  <i
                    className={`bi ${CATEGORY_ICONS[key] || 'bi-tag'} text-lg`}
                    style={{ color: cat.color }}
                  />
                ) : (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: cat.color }}
                  />
                )}
                {collapsed && <CountBadge count={count} active={active} />}
              </span>
              {!collapsed && <span className="flex-1">{cat.label}</span>}
              {!collapsed && <CountPill count={count} active={active} />}
            </button>
          );
        })}
      </nav>

      <div
        className={`border-t border-gray-100 py-3 ${
          collapsed ? 'flex justify-center px-0' : 'px-4'
        }`}
      >
        {collapsed ? (
          <i className="bi bi-cloud text-base text-gray-300" title="Synced with REST API" />
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <i className="bi bi-cloud" />
            <span>Synced with REST API</span>
          </div>
        )}
      </div>
    </aside>
  );
}
