import { useState, useEffect, useCallback } from "react";
import { RadioGroup } from "@headlessui/react";
import axios from "axios";

import { Group, GoalListSpec, GoalFilter, User } from "../util/interfaces";

import GoalListPanel from "../GoalList/GoalListPanel";
import Leaderboard from "./Leaderboard";
import EditGroupDialog, { EditDialogSpec } from "./EditGroupDialog";

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

      <div className="fixed left-0 top-14 m-0 flex h-screen w-40 flex-col justify-between bg-gray-50 shadow">
        <div className=" overflow-y-auto">
          <RadioGroup
            className="divide-y divide-gray-300"
            value={selectedSpec}
            onChange={setSelectedSpec}
          >
            <div>
              {GoalFilter.values.map((goalFilter) => (
                <RadioGroup.Option
                  value={goalFilter}
                  key={goalFilter.name}
                  className={({ checked }) =>
                    `${checked ? "bg-blue-300 shadow" : "hover:bg-gray-200"}
                        my-1 flex cursor-pointer rounded-md px-2 py-1`
                  }
                >
                  {goalFilter.name}
                </RadioGroup.Option>
              ))}
            </div>
            <div>
              {groups.map((group) => (
                <RadioGroup.Option
                  value={group}
                  key={group.id}
                  className={({ checked }) =>
                    `${checked ? "bg-red-300 shadow" : "hover:bg-gray-200"}
                    my-1 flex cursor-pointer rounded-md px-2 py-1`
                  }
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {group.name}
                  </span>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          <button
            className="my-1 w-full rounded-md border px-2 py-0.5 text-center hover:bg-gray-300"
            onClick={handleNewGroup}
          >
            New Group
          </button>
        </div>
        {!(selectedSpec instanceof GoalFilter) && (
          <div className="mb-10">
            <Leaderboard groupId={selectedSpec.id} />
          </div>
        )}
      </div>
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
