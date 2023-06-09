import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { User, Group } from "../util/interfaces";

interface GroupInviteProps {
  user?: User;
}

const GroupInvite = ({ user }: GroupInviteProps) => {
  const { join_code } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<Group>();

  useEffect(() => {
    const load = async () => {
      const res = await axios.post(`/groups/getGroupByJoinCode`, {
        joinCode: join_code,
      });
      setGroup(res.data);
    };
    load();
  }, [join_code, user]);

  const handleJoinGroup = async () => {
    await axios.post(`/groups/joinGroup`, {
      joinCode: join_code,
    });
    navigate(`/`);
  };
  return (
    <div className="mt-14">
      {user && (
        <div className="flex flex-col items-stretch rounded-lg bg-white p-4">
          <div className="text-center text-lg font-medium">
            You have been invited to join {group?.name}
          </div>
          <button
            className="rounded-lg border p-1 hover:bg-gray-300"
            onClick={handleJoinGroup}
          >
            Join
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupInvite;
