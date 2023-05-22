import { RadioGroup } from "@headlessui/react";

import { Group, GoalListSpec } from "../util/interfaces";
import { GoalFilter } from "../util/interfaces";

import Leaderboard from "./Leaderboard";

interface SidebarProps {
  selectedSpec: GoalListSpec;
  setSelectedSpec: (spec: GoalListSpec) => void;
  groups: Group[];
  handleNewGroup: () => void;
}

const Sidebar = ({
  selectedSpec,
  setSelectedSpec,
  groups,
  handleNewGroup,
}: SidebarProps) => {
  return (
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
                className={({ checked }) => `${
                  checked ? "bg-blue-300 shadow" : "hover:bg-gray-200"
                }
                          my-1 flex cursor-pointer rounded-md px-2 py-1`}
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
                className={({ checked }) => `${
                  checked ? "bg-red-300 shadow" : "hover:bg-gray-200"
                }
                      my-1 flex cursor-pointer rounded-md px-2 py-1`}
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
  );
};

export default Sidebar;
