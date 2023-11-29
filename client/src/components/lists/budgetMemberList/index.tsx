import { FC } from "react";
import { Member } from "../../../types/global";
import UserAvatar from "../../ui/userAvatar";

//Define prop structure
interface BudgetMembersListProps {
  members: Member[] | undefined;
}

const BudgetMembersList: FC<BudgetMembersListProps> = ({ members = [] }) => {
  return (
    <div>
      <h3 className="text-2xl mb-3 pl-2 border-l border-lime-500 text-slate-200">
        Members
      </h3>
      <div className="flex gap-2">
        {members.map((member) => {
          return <UserAvatar username={member.username} key={member.id} />;
        })}
      </div>
    </div>
  );
};
export default BudgetMembersList;
