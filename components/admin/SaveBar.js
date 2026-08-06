export default function SaveBar({ onSave, saving, message }) {
  return (
    <div className="fixed bottom-0 left-72 right-0 z-40 px-8 py-4 bg-white/95 backdrop-blur border-t border-black/10 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] flex items-center gap-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center justify-center rounded-full bg-secondary text-white font-semibold px-6 py-2.5 text-sm hover:bg-tertiary transition-colors disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
      {message && <span className="font-body text-sm text-primary/60">{message}</span>}
    </div>
  );
}
