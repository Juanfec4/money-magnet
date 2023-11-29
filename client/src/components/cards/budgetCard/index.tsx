import { IconArrowNarrowRight } from "@tabler/icons-react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../../buttons/iconButton";
import FeaturedText from "../../ui/featuredText";
import Tooltip from "../../ui/tooltip";

//Define prop structure
interface BudgetCardProps {
  id: string | number;
  name: string;
  unique_code: string;
}

const BudgetCard: FC<BudgetCardProps> = ({ name, unique_code, id }) => {
  //Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);

  //Navigate to budget
  const navigator = useNavigate();

  return (
    <div className="flex flex-col p-4 border-2 h-40 rounded-md cursor-pointer transition-all duration-200 border-gray-500 hover:border-lime-500 justify-between">
      <span className="max-w-min">
        <h3
          className=" text-xl capitalize mb-2 truncate max-w-min"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {name}
        </h3>
        <FeaturedText text={unique_code} />
      </span>
      <IconButton
        text={"Go to budget"}
        onClick={() => navigator(`/web-app/budgets/${id}`)}
      >
        <IconArrowNarrowRight />
      </IconButton>
      <Tooltip text={`Budget: ${name}`} isVisible={showTooltip} />
    </div>
  );
};
export default BudgetCard;
