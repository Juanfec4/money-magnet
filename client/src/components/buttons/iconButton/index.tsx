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
      className="bg-slate-200 rounded-md text-slate-900 flex items-center justify-center w-32 py-2 border-2 border-transparent hover:bg-slate-200/10   hover:border-slate-200 hover:text-slate-100 transition duration-200"
      onClick={onClick}
    >
      <button>{text}</button>
      {children}
    </span>
  );
};

export default IconButton;
