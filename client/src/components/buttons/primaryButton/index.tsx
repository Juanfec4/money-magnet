import { FC, ReactNode } from "react";

//Define prop structure
interface primaryButtonProps {
  text: string;
  children?: ReactNode;
  onClick?: () => void;
}

const PrimaryButton: FC<primaryButtonProps> = ({ text, children, onClick }) => {
  return (
    <span
      className="bg-lime-500 rounded-md text-slate-900 flex items-center justify-center w-full py-2 border-2 border-transparent hover:bg-lime-500/10 hover:text-lime-500 hover:border-lime-500 transition duration-200 cursor-pointer gap-2"
      onClick={onClick}
    >
      {children}
      <button>{text}</button>
    </span>
  );
};

export default PrimaryButton;
