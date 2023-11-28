import { useEffect } from "react";

function useDisableScroll() {
  useEffect(() => {
    const originalOverflow = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
}

export default useDisableScroll;
