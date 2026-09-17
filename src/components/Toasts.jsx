const ICONS = {
  success: 'bi-check-circle-fill',
  error: 'bi-x-circle-fill',
  info: 'bi-info-circle-fill',
};

const ICON_COLORS = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-accent',
};

export default function Toasts({ toasts }) {
  return (
    <div className="fixed right-5 bottom-5 z-400 flex flex-col-reverse gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex max-w-[340px] animate-toast-in items-center gap-2 rounded-lg bg-gray-900 px-[18px] py-3 text-[0.85rem] font-medium text-white shadow-lg"
        >
          <i className={`bi ${ICONS[t.type] || ICONS.info} ${ICON_COLORS[t.type] || ICON_COLORS.info}`} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
