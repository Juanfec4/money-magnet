import { FC } from "react";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

//Define prop structure
interface ErrorCardProps {
  error: string;
}

const ErrorCard: FC<ErrorCardProps> = ({ error }) => {
  return (
    <span className="bg-red-500/10 p-2 rounded-md border-red-500 border-[1px] max-w-max flex space-x-2 text-red-100 items-center">
      <IconAlertTriangleFilled className="h-5 w-5" /> <p>{error}</p>
    </span>
  );
};
export default ErrorCard;
