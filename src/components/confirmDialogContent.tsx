import FormLoading from "./loaders/FormLoading";

type ConfirmDialogContentProps = {
  title?: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: "danger" | "default";
};

const ConfirmDialogContent: React.FC<ConfirmDialogContentProps> = ({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "default",
}) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      
      {title && (
        <h3 className="text-base md:text-lg font-semibold text-center">
          {title}
        </h3>
      )}

      <p className="text-center text-sm md:text-base">
        {description}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`cursor-pointer text-white rounded text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 ${
            variant === "danger"
              ? "bg-red-500 hover:bg-red-700"
              : "bg-[#1d3449] hover:bg-[#162b3c]"
          }`}
        >
          {isLoading ? <FormLoading /> : confirmText}
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-300 cursor-pointer rounded px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialogContent;