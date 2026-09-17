import { ReactNode, useEffect } from "react";

type ModalBackdropProps = {
  onClick?: () => void;
  children?: ReactNode;
};

/**
 * Shared full-screen modal layer: dims and blurs whatever is behind an
 * open modal, centers its content in the current viewport regardless of
 * scroll position, freezes background scrolling while it's mounted, and
 * sits on its own z-index layer (z-[60]) so nothing on the page - including
 * animated/transformed elements (which briefly gain their own stacking
 * context mid-animation) and the floating nav bar (z-50) - can paint
 * above it. The nav must be dimmed/blurred the same as everything else
 * while a modal is open, not float above it.
 */
const ModalBackdrop = ({ onClick, children }: ModalBackdropProps) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-overlay p-4 backdrop-blur-sm"
    >
      {children && (
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      )}
    </div>
  );
};

export default ModalBackdrop;
