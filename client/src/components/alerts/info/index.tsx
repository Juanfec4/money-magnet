import { FC, useEffect } from "react";
import { IconInfoCircle } from "@tabler/icons-react";

// Define prop structure
interface InfoCardProps {
  message: string;
  onClose?: () => void; // Optional callback for when the card is closed
}

const InfoCard: FC<InfoCardProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove the InfoCard after 2 seconds
      onClose?.();
    }, 2000);

    return () => {
      // Clear the timer on component unmount
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <span className="bg-purple-500/10 p-2 rounded-md border-purple-500 border-[1px] max-w-max flex space-x-2 text-purple-100 items-center absolute bottom-4 left-1/2 -translate-x-1/2">
      <IconInfoCircle className="h-5 w-5" /> <p>{message}</p>
    </span>
  );
};

export default InfoCard;
