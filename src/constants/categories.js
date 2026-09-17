export const CATEGORIES = {
  personal: { label: 'Personal', color: '#7c3aed' },
  work: { label: 'Work', color: '#2563eb' },
  ideas: { label: 'Ideas', color: '#d97706' },
  tasks: { label: 'Tasks', color: '#059669' },
  study: { label: 'Study', color: '#db2777' },
};

// Tailwind-friendly badge styles per category (ported from styles.css)
export const CATEGORY_BADGE_STYLES = {
  personal: 'bg-[#ede9fe] text-[#7c3aed]',
  work: 'bg-[#dbeafe] text-[#2563eb]',
  ideas: 'bg-[#fef3c7] text-[#d97706]',
  tasks: 'bg-[#d1fae5] text-[#059669]',
  study: 'bg-[#fce7f3] text-[#db2777]',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first', icon: 'bi-clock' },
  { value: 'oldest', label: 'Oldest first', icon: 'bi-clock-history' },
  { value: 'alpha', label: 'A → Z', icon: 'bi-sort-alpha-down' },
  { value: 'alpha-rev', label: 'Z → A', icon: 'bi-sort-alpha-up' },
];
