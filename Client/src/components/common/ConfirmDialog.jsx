import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="btn-secondary">
          {cancelText}
        </button>
        <button onClick={onConfirm} className="btn-danger">
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
