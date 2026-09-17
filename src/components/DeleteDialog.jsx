export default function DeleteDialog({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <>
      <div
        onClick={onCancel}
        className="fixed inset-0 z-300 bg-black/40 backdrop-blur-[3px]"
      />
      <div className="fixed top-1/2 left-1/2 z-310 w-[380px] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-7 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-xl text-danger">
          <i className="bi bi-exclamation-triangle" />
        </div>
        <h3 className="mb-1.5 text-[1.05rem] text-gray-900">Delete this note?</h3>
        <p className="mb-6 text-[0.85rem] text-gray-500">
          This action cannot be undone. The note will be permanently removed.
        </p>
        <div className="flex justify-center gap-2.5">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-gray-200 px-5 py-2 text-[0.88rem] font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-danger px-5 py-2 text-[0.88rem] font-semibold text-white transition hover:bg-danger-hover active:scale-[0.97]"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
