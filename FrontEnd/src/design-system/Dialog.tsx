import { useRef, type ReactNode } from "react";
import {
  Dialog as HeadlessDialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import "./tokens.css";
import "./forms.css";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: DialogProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  return (
    <HeadlessDialog
      open={open}
      onClose={onClose}
      initialFocus={closeRef}
      className="reptile-design ra-dialog-root"
    >
      <DialogBackdrop className="ra-dialog-backdrop" />
      <div className="ra-dialog-position">
        <DialogPanel className="ra-dialog-panel">
          <div className="ra-dialog-header">
            <div className="ra-dialog-title-row">
              <DialogTitle className="ra-dialog-title">{title}</DialogTitle>
              <button
                ref={closeRef}
                type="button"
                className="ra-dialog-close"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
            {description && (
              <Description className="ra-dialog-description">
                {description}
              </Description>
            )}
          </div>
          <div className="ra-dialog-body">{children}</div>
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
}

export default Dialog;
