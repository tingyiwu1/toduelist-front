import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { Group } from "../util/interfaces";

const GroupInvite = () => {
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
  }, [join_code]);

  const handleJoinGroup = async () => {
    await axios.post(`/groups/joinGroup`, {
      joinCode: join_code,
    });
    navigate(`/`);
  };
  return (
    <>
      <h1>You have been invited to join {group?.name}</h1>
      <button onClick={handleJoinGroup}>Join</button>
    </>
  );
};

export default GroupInvite;
