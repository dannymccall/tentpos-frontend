export interface ActionProps<T> {
  onView: (selectRole: T) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "delete";
  onEdit: (data: T) => void;
  onDelete: (data: T) => void;
  onHandleDelete: () => void;
  onSuccess: () => void;
}


export interface EditFormProps<T> {
  data: T;
  mode: "add" | "view" | "edit";

  onSuccess: () => void;
}
