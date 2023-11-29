import { FC, useState } from "react";
import { formatMoney } from "../../../utilities/helpers";
import Tooltip from "../tooltip";

interface ProgressBarProps {
  total: number;
  progress: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ total, progress }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const percentage = (progress / total) * 100;

  return (
    <>
      <div
        className="relative h-5 bg-gray-300/10 rounded-md overflow-hidden  w-full border-[1px]  max-w-[200px] sm:w-72 sm:max-w-none border-slate-700 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {percentage > 100 ? (
          <div
            className="h-full bg-rose-500/30 transition-width duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        ) : (
          <div
            className="h-full bg-lime-500/30 transition-width duration-300 text-xs flex items-center justify-center text-lime-100"
            style={{ width: `${percentage}%` }}
          ></div>
        )}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex text-[12px] text-slate-200/70">
          <p>{formatMoney(progress)}</p>
          <p>{" / "}</p>
          <p>{formatMoney(total)}</p>
        </div>
      </div>
      <Tooltip
        text={`${percentage.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}%`}
        isVisible={showTooltip}
      />
    </>
  );
};

export default ProgressBar;
