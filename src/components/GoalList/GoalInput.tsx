import React from "react";
import { Switch } from "@headlessui/react";

import { GoalFilter, GoalListSpec, GoalQueryResult } from "../util/interfaces";
import CreateGoalForm from "./CreateGoalForm";
import AddGoalToGroupForm from "./AddGoalToGroupForm";

interface GoalInputProps {
  spec: GoalListSpec;
  goalsNotInList: GoalQueryResult[];
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  createGoal: (description: string) => Promise<void>;
  addGoalToGroup: (goalId: string, groupId: string) => Promise<void>;
}

const GoalInput = ({
  spec,
  goalsNotInList,
  showAddForm,
  setShowAddForm,
  createGoal,
  addGoalToGroup,
}: GoalInputProps) => {
  const isGroup = !(spec instanceof GoalFilter);
  return (
    <div className="fixed bottom-10 flex w-full justify-center">
      <div
        className={`${
          isGroup && showAddForm ? "bg-red-300" : "bg-blue-300"
        } relative right-20 flex w-96 items-center justify-center rounded-md p-2 shadow md:w-[36rem] xl:w-[70rem]`}
      >
        {isGroup && showAddForm ? (
          <AddGoalToGroupForm
            groupId={spec.id}
            goals={goalsNotInList}
            addGoalToGroup={addGoalToGroup}
          />
        ) : (
          <CreateGoalForm createGoal={createGoal} />
        )}
        {isGroup && (
          <Switch
            checked={showAddForm}
            onChange={setShowAddForm}
            className={`${
              showAddForm ? "bg-blue-400" : "bg-red-400"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                showAddForm ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        )}
      </div>
    </div>
  );
};

export default GoalInput;
