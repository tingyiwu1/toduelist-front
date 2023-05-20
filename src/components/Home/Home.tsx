import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import axios from "axios";

import { Group, GoalListSpec, GoalFilter } from "../util/interfaces";

import GoalListPanel from "../GoalList/GoalListPanel";
import Leaderboard from "./Leaderboard";

const Home = () => {
  const [selectedSpec, setSelectedSpec] = useState<GoalListSpec>(
    GoalFilter.ALL
  );
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(`/groups/allGroups`);
      setGroups(res.data);
    };
    load();
  }, []);

  const leaveGroup = async (groupId: string) => {
    await axios.post(`/groups/leaveGroup`, {
      id: groupId,
    });
    setGroups(groups.filter((group) => group.id !== groupId));
    setSelectedSpec(GoalFilter.ALL);
  };

  return (
    <>
      <div className="fixed left-0 top-0 flex h-10 w-screen flex-row bg-gray-100">
        <div>toduelist</div>
      </div>

      <div className="fixed left-0 top-10 m-0 flex h-screen w-40 flex-col bg-gray-50 shadow">
        <RadioGroup value={selectedSpec} onChange={setSelectedSpec}>
          {/* <RadioGroup.Label>Lists</RadioGroup.Label> */}
          {GoalFilter.values.map((goalFilter) => (
            <RadioGroup.Option value={goalFilter} key={goalFilter.name}>
              {({ checked }) => (
                <span className={checked ? "bg-blue-600" : "bg-gray-200"}>
                  {goalFilter.name}
                </span>
              )}
            </RadioGroup.Option>
          ))}
          {groups.map((group) => (
            <RadioGroup.Option value={group} key={group.id}>
              {({ checked }) => (
                <span className={checked ? "bg-blue-600" : "bg-gray-200"}>
                  {group.name}
                </span>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
        {!(selectedSpec instanceof GoalFilter) && (
          <Leaderboard groupId={selectedSpec.id} />
        )}
      </div>
      <div className="ml-40 mt-10">
        <GoalListPanel spec={selectedSpec} leaveGroup={leaveGroup} />
      </div>
    </>
  );
};

export default Home;
