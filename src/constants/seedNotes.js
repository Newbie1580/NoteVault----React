// Generic starter notes shown fresh on every load.
// IDs use `seed-` prefix so useNotes.saveLocal() (which only persists `n_*`)
// ignores them — user-created notes still persist via localStorage.

function isoDaysAgo(days, hours = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const SEED_NOTES = [
  {
    id: 'seed-welcome',
    title: 'Welcome to NoteVault',
    content:
      'This is your personal notes hub.\n\n- Click New Note (or press Ctrl+N) to create one\n- Pin important notes to keep them on top\n- Organize with categories: Personal, Work, Ideas, Tasks, Study\n- Press Ctrl+K to search',
    category: 'personal',
    pinned: true,
    archived: false,
    created: isoDaysAgo(6),
    updated: isoDaysAgo(0, 2),
  },
  {
    id: 'seed-work-kickoff',
    title: 'Project kickoff checklist',
    content:
      '1. Define scope and milestones\n2. Assign owners\n3. Set up weekly sync\n4. Share design mockups\n5. Review before Friday demo',
    category: 'work',
    pinned: true,
    archived: false,
    created: isoDaysAgo(4),
    updated: isoDaysAgo(1),
  },
  {
    id: 'seed-idea-habits',
    title: 'App idea: habit tracker',
    content:
      'Simple streak-based tracker with reminders.\nDifferent from others: no gamified clutter, just calendar heatmap + gentle nudges.\n\nNext: sketch onboarding flow.',
    category: 'ideas',
    pinned: false,
    archived: false,
    created: isoDaysAgo(3),
    updated: isoDaysAgo(2),
  },
  {
    id: 'seed-tasks-groceries',
    title: 'Weekly groceries',
    content: '- Oats\n- Eggs\n- Spinach\n- Chicken breast\n- Coffee beans\n- Olive oil',
    category: 'tasks',
    pinned: false,
    archived: false,
    created: isoDaysAgo(2),
    updated: isoDaysAgo(0, 5),
  },
  {
    id: 'seed-study-hooks',
    title: 'React hooks recap',
    content:
      'useState: component memory, triggers re-render.\nuseEffect: sync with outside (fetch, listeners).\nuseMemo/useCallback: cache values/functions.\nCustom hooks (like useNotes) share logic via composition.',
    category: 'study',
    pinned: false,
    archived: false,
    created: isoDaysAgo(5),
    updated: isoDaysAgo(3),
  },
  {
    id: 'seed-archived-example',
    title: 'Old meeting notes (archived)',
    content: 'Q3 planning — kept for reference. Archive keeps All Notes clean without deleting.',
    category: 'work',
    pinned: false,
    archived: true,
    created: isoDaysAgo(10),
    updated: isoDaysAgo(7),
  },
];
