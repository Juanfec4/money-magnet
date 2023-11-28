import { FC } from "react";
import useMousePosition from "../../../hooks/useMousePosition";

// Define prop structure
interface TooltipProps {
  text: string;
  isVisible: boolean;
}

const Tooltip: FC<TooltipProps> = ({ text, isVisible }) => {
  //Use mouse position custom hook
  const mousePosition = useMousePosition();
  //Offset value
  const offset = 10;

  return isVisible ? (
    <div
      className="fixed text-slate-200 px-2 rounded-full text-xs py-1 z-50 bg-gray-700 italic"
      style={{
        left: `${mousePosition.x + offset}px`,
        top: `${mousePosition.y + offset}px`,
      }}
    >
      {text}
    </div>
  ) : null;
};

export default Tooltip;
