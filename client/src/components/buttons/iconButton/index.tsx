import { FC, ReactNode } from "react";

//Define prop structure
interface IconButtonProps {
  text: string;
  children: ReactNode;
  onClick?: () => void;
}

const IconButton: FC<IconButtonProps> = ({ text, children, onClick }) => {
  return (
    <span
      className="bg-slate-200 rounded-md text-slate-900 py-2 flex items-center justify-center max-w-max px-4"
      onClick={onClick}
    >
      <button>{text}</button>
      {children}
    </span>
  );
};

export default IconButton;
