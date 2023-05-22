import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { Group, GoalListSpec, GoalFilter, User } from "../util/interfaces";

import GoalListPanel from "../GoalList/GoalListPanel";
import EditGroupDialog, { EditDialogSpec } from "./EditGroupDialog";
import Sidebar from "../Sidebar/Sidebar";

interface HomeProps {
  user?: User;
}

const Home = ({ user }: HomeProps) => {
  const [selectedSpec, setSelectedSpec] = useState<GoalListSpec>(
    GoalFilter.ALL
  );
  const [groups, setGroups] = useState<Group[]>([]);
  const [editDialogSpec, setEditDialogSpec] =
    useState<EditDialogSpec>("closed");

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setSelectedSpec(GoalFilter.ALL);
      return;
    }
    const load = async () => {
      const res = await axios.get(`/groups/allGroups`);
      setGroups(res.data);
    };
    load();
  }, [user]);

  const handleNewGroup = () => {
    setEditDialogSpec("new");
  };

  const createGroup = useCallback(async (name: string, timeZone: string) => {
    const res = await axios.post(`/groups/createGroup`, {
      name,
      timeZone,
    });
    setGroups((groups) => [...groups, res.data]);
    setSelectedSpec(res.data);
  }, []);

  const editGroup = useCallback(
    async (groupId: string, name: string, timeZone: string) => {
      const res = await axios.post(`/groups/editGroup`, {
        id: groupId,
        name,
        timeZone,
      });
      setGroups((groups) =>
        groups.map((group) => (group.id === groupId ? res.data : group))
      );
      setSelectedSpec(res.data);
    },
    []
  );

  const leaveGroup = async (groupId: string) => {
    await axios.post(`/groups/leaveGroup`, {
      id: groupId,
    });
    setGroups((groups) => groups.filter((group) => group.id !== groupId));
    setSelectedSpec(GoalFilter.ALL);
  };

  return (
    <>
      <EditGroupDialog
        spec={editDialogSpec}
        setSpec={setEditDialogSpec}
        createGroup={createGroup}
        editGroup={editGroup}
      />
      <Sidebar
        selectedSpec={selectedSpec}
        setSelectedSpec={setSelectedSpec}
        groups={groups}
        handleNewGroup={handleNewGroup}
      />
      <div className="ml-40 mt-14">
        <GoalListPanel
          user={user}
          spec={selectedSpec}
          leaveGroup={leaveGroup}
          setEditDialogSpec={setEditDialogSpec}
        />
      </div>
    </>
  );
};

export default Home;
