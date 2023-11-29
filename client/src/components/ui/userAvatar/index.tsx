import { FC, useMemo, useState } from "react";
import { getUIAvatarForUsername } from "../../../utilities/helpers";
import Tooltip from "../tooltip";

interface UserAvatarProps {
  username: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ username }) => {
  const [isVisible, setIsVisible] = useState(false);

  const userImageUri = useMemo(() => {
    return getUIAvatarForUsername(username);
  }, [username]);

  return (
    <div className="max-w-max max-h-max">
      <Tooltip text={username} isVisible={isVisible} />
      <img
        src={userImageUri}
        className=" rounded-full w-10 h-10 align-bottom"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
    </div>
  );
};
export default UserAvatar;
