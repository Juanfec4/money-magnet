import { FC } from "react";
import { IconMoodEmpty } from "@tabler/icons-react";

//Define prop structure
interface NoResultsCardProps {
  message: string;
}

const NoResultsCard: FC<NoResultsCardProps> = ({ message }) => {
  return (
    <span className="bg-amber-500/10 p-2 rounded-md border-amber-500 border-[1px] max-w-max flex space-x-2 text-amber-100 items-center">
      <IconMoodEmpty className="h-5 w-5" /> <p>{message}</p>
    </span>
  );
};
export default NoResultsCard;
