import { FC } from "react";

//Define prop structure
interface FeaturedTextProps {
  text: string;
}

const FeaturedText: FC<FeaturedTextProps> = ({ text }) => {
  return (
    <span className=" bg-lime-500 rounded-full flex w-24 items-center justify-center">
      <p className="bg-transparent text-xs text-slate-900">{text}</p>
    </span>
  );
};
export default FeaturedText;
