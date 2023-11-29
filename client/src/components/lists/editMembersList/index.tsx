import { IconRotate, IconX } from "@tabler/icons-react";
import { FC, useState } from "react";
import { Member } from "../../../types/global";
import Tooltip from "../../ui/tooltip";
import UserAvatar from "../../ui/userAvatar";

interface EditMembersListProps {
  members: Member[];
  user_id?: number;
  removeFn: (member_id: number) => void;
  resetFn: () => void;
}

const EditMembersList: FC<EditMembersListProps> = ({
  members,
  user_id,
  removeFn,
  resetFn,
}) => {
  //Reset tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className=" w-full flex flex-col space-y-4 mt-6">
      <span className="flex text-slate-200 items-center space-x-2">
        <IconRotate
          className="h-5 w-5 hover:text-lime-500 transition duration-200 cursor-pointer"
          onClick={resetFn}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
        <h4 className="text-md font-bold">Remove members</h4>{" "}
        <Tooltip text="Revert changes" isVisible={showTooltip} />
      </span>
      <ul className="flex flex-col space-y-2 h-32 overflow-y-scroll">
        {members?.map((member) => {
          return member.id !== user_id ? (
            <li
              key={member.id}
              className="bg-slate-800/50 p-2 rounded-md flex items-center space-x-4 text-slate-200 capitalize font-bold justify-around"
            >
              <UserAvatar username={member.username} />
              <p>{member.username}</p>
              <button onClick={() => removeFn(member.id)}>
                <IconX className="h-6 w-6 text-slate-500 hover:text-rose-500 transition duration-200" />
              </button>
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
};
export default EditMembersList;
