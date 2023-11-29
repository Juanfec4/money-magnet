import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

const useMousePosition = (): MousePosition => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  const updateMousePosition = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener("mousemove", updateMousePosition);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return position;
};

export default useMousePosition;
