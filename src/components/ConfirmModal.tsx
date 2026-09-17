type ConfirmModalProps = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger";
};

/**
 * Shared confirmation prompt for actions that shouldn't fire on a single
 * click (destructive or hard-to-undo actions). Pair with ModalBackdrop,
 * same as every other modal in the app.
 */
const ConfirmModal = ({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmModalProps) => {
  const confirmButtonClassName =
    variant === "danger"
      ? "bg-danger-action text-danger-action-text"
      : "bg-action-primary text-on-primary";

  return (
    <div className="flex w-[90vw] max-w-sm flex-col gap-4 rounded-2xl bg-surface p-6 shadow-xl">
      <div className="flex flex-col gap-1">
        <h2 className="heading-2">{title}</h2>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:opacity-90 active:opacity-80 ${confirmButtonClassName}`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
