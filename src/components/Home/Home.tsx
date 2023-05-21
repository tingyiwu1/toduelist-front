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

      <div className="fixed left-0 top-10 m-0 flex h-screen w-40 flex-col justify-between bg-gray-50 shadow">
        <div className=" overflow-y-auto">
          <RadioGroup
            className="divide-y divide-gray-300"
            value={selectedSpec}
            onChange={setSelectedSpec}
          >
            {/* <RadioGroup.Label>Lists</RadioGroup.Label> */}
            <div className="">
              {GoalFilter.values.map((goalFilter) => (
                <RadioGroup.Option
                  value={goalFilter}
                  key={goalFilter.name}
                  className={({ checked }) =>
                    `${checked ? "bg-blue-300 shadow" : "hover:bg-gray-200"}
                        my-1 flex cursor-pointer rounded-md px-2 py-1`
                  }
                >
                  <span className="">{goalFilter.name}</span>
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
                  <span>{group.name}</span>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
        {!(selectedSpec instanceof GoalFilter) && (
          <div className="mb-10">
            <Leaderboard groupId={selectedSpec.id} />
          </div>
        )}
      </div>
      <div className="ml-40 mt-10">
        <GoalListPanel spec={selectedSpec} leaveGroup={leaveGroup} />
      </div>
    </>
  );
};

export default Home;
