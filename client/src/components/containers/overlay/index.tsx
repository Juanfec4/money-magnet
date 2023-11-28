import { FC, ReactNode } from "react";
import useDisableScroll from "../../../hooks/useDisableScroll";
import { IconX } from "@tabler/icons-react";

//Define prop structure
interface OverlayContainerProps {
  children?: ReactNode;
  closeFn: () => void;
}

const OverlayContainer: FC<OverlayContainerProps> = ({ children, closeFn }) => {
  useDisableScroll();
  return (
    <div className="bg-slate-500/30 fixed top-0 left-0 h-full w-screen flex justify-center p-4 sm:p-6 md:p-16">
      <div className=" bg-gray-900 max-w-[700px] w-full h-max rounded-md relative px-6 py-12 border-2 border-gray-600 flex justify-center">
        <button
          className="text-slate-200 absolute  top-4 right-4 sm:right-6 sm:top-6  hover:text-lime-500"
          onClick={closeFn}
        >
          <IconX />
        </button>
        {children}
      </div>
    </div>
  );
};
export default OverlayContainer;
