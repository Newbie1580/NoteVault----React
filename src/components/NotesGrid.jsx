import NoteCard from './NoteCard';

export default function NotesGrid({ notes, loading, view, onOpen, onNewNote }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
        <div className="mb-4 flex gap-1.5">
          <div className="h-6 w-1 animate-loader-pulse rounded-sm bg-accent" />
          <div className="h-6 w-1 animate-loader-pulse rounded-sm bg-accent [animation-delay:0.15s]" />
          <div className="h-6 w-1 animate-loader-pulse rounded-sm bg-accent [animation-delay:0.3s]" />
        </div>
        <p className="text-[0.88rem] text-gray-400">Loading your notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <i className="bi bi-journal-x text-3xl text-gray-300" />
        </div>
        <h3 className="mb-1.5 text-[1.1rem] text-gray-700">No notes yet</h3>
        <p className="mb-5 text-[0.88rem] text-gray-400">Create your first note to get started</p>
        <button
          onClick={onNewNote}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-[0.88rem] font-semibold text-white transition hover:bg-accent-hover active:scale-[0.97]"
        >
          <i className="bi bi-plus-lg" /> Create Note
        </button>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="flex w-full max-w-full min-w-0 flex-1 flex-col gap-2 overflow-x-hidden px-4 py-5 md:px-6">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} layout="list" onOpen={onOpen} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid flex-1 content-start gap-4 px-4 py-5 md:px-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} layout="grid" onOpen={onOpen} />
      ))}
    </div>
  );
}
