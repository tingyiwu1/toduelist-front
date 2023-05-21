import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { PlusCircleIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import { GoalQueryResult } from "../util/interfaces";

interface AddGoalToGroupFormProps {
  groupId: string;
  goals: GoalQueryResult[];
  addGoalToGroup: (goalId: string, groupId: string) => Promise<void>;
}

const AddGoalToGroupForm = ({
  groupId,
  goals,
  addGoalToGroup,
}: AddGoalToGroupFormProps) => {
  const [selected, setSelected] = useState<GoalQueryResult | null>(null);
  const [query, setQuery] = useState<string>("");

  const handleAdd = () => {
    if (selected !== null) {
      addGoalToGroup(selected.id, groupId);
      setSelected(null);
    }
  };

  const filteredGoals =
    query === ""
      ? goals
      : goals.filter((goal) =>
          goal.description.toLowerCase().includes(query.toLowerCase())
        );
  return (
    <div className="flex flex-grow">
      <Combobox
        as="div"
        className="relative flex-grow"
        value={selected}
        onChange={setSelected}
        nullable
      >
        <Combobox.Options className="absolute bottom-full mb-1 max-h-80 w-full overflow-auto rounded-md bg-gray-50 py-1 shadow-lg">
          {filteredGoals.map((goal) => (
            <Combobox.Option
              className={({ selected, active }) =>
                `relative cursor-default select-none pl-4 pr-4 ${
                  selected && active
                    ? "bg-red-400"
                    : selected
                    ? "bg-red-300"
                    : active
                    ? "bg-gray-300"
                    : ""
                }`
              }
              key={goal.id}
              value={goal}
            >
              {goal.description}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Input
          className="w-full bg-gray-50 px-2 py-1 focus:outline-none"
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(g: GoalQueryResult | null) =>
            g === null ? "" : g.description
          }
          placeholder="Add existing goal"
        />

        <Combobox.Button className="absolute inset-y-0 right-0 mr-1 rounded-md p-0.5 hover:bg-gray-400">
          <ChevronUpIcon className="h-7 w-7" />
        </Combobox.Button>
      </Combobox>
      <button
        className="rounded-md p-0.5 hover:bg-gray-400"
        onClick={handleAdd}
      >
        <PlusCircleIcon className="h-7 w-7" />
      </button>
    </div>
  );
};

export default AddGoalToGroupForm;
