import { useState, useEffect, useMemo, useCallback } from "react";
import { Switch, Menu, Dialog } from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/24/solid";
import axios from "axios";

import {
  GoalQueryResult,
  Goal,
  GoalListSpec,
  GoalFilter,
  Group,
} from "../util/interfaces";

import GoalList from "./GoalList";
import InviteDialog from "./InviteDialog";
import CreateGoalForm from "./CreateGoalForm";
import AddGoalToGroupForm from "./AddGoalToGroupForm";
import GoalListPanelHeader from "./GoalListPanelHeader";

interface GoalListPanelProps {
  spec: GoalListSpec;
  leaveGroup: (groupId: string) => Promise<void>;
}

export type EditButtonState = "edit" | "delete" | "remove";

const getFilter = (spec: GoalListSpec) => {
  let filter: (goal: GoalQueryResult) => boolean;
  if (spec === GoalFilter.ALL) filter = (_: GoalQueryResult) => true;
  else if (spec === GoalFilter.ACTIVE)
    filter = (goal: GoalQueryResult) => goal.completed === false;
  else if (spec === GoalFilter.COMPLETED)
    filter = (goal: GoalQueryResult) => goal.completed === true;
  else {
    // spec is a group
    const group = spec as Group;
    filter = (goal: GoalQueryResult) =>
      goal.groups.find((groupId: string) => groupId === group.id) !== undefined;
  }
  return filter;
};

const GoalListPanel = ({ spec, leaveGroup }: GoalListPanelProps) => {
  const [editButtonState, setEditButtonState] =
    useState<EditButtonState>("edit");
  const [goals, setGoals] = useState<GoalQueryResult[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);

  const isGroup = !(spec instanceof GoalFilter);
  const filter = useMemo(() => getFilter(spec), [spec]);
  const goalsInList = useMemo(() => goals.filter(filter), [goals, filter]);
  const goalsNotInList = useMemo(
    () => goals.filter((goal) => !filter(goal)),
    [goals, filter]
  );

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(`/goals/goalQuery`);
      setGoals(res.data);
    };
    load();
  }, []);

  useEffect(() => {
    if (!isGroup) setShowAddForm(false);
  }, [isGroup]);

  const createGoal = useCallback(
    async (description: string) => {
      const res = isGroup
        ? await axios.post(`/goals/createGoalInGroup`, {
            description: description,
            groupId: spec.id,
          })
        : await axios.post(`/goals/createGoal`, {
            description: description,
          });
      const newGoal: GoalQueryResult = {
        id: res.data.id,
        description: res.data.description,
        completed: res.data.completed,
        groups: res.data.groups,
      };
      setGoals((goals) => [...goals, newGoal]);
    },
    [isGroup]
  );

  const editGoal = useCallback(
    async (goalId: string, description: string, completed: boolean) => {
      console.log(completed);
      const res = await axios.post(`/goals/editGoal`, {
        id: goalId,
        description: description,
        completed: completed,
      });
      const updatedGoal: GoalQueryResult = {
        id: res.data.id,
        description: res.data.description,
        completed: res.data.completed,
        groups: res.data.groups,
      };
      console.log(updatedGoal);
      setGoals((goals) =>
        goals.map((item) => (item.id === updatedGoal.id ? updatedGoal : item))
      );
    },
    []
  );

  const deleteGoal = useCallback(async (goalId: string) => {
    const res = await axios.post(`/goals/deleteGoal`, {
      id: goalId,
    });
    setGoals((goals) => goals.filter((item) => item.id !== res.data.id));
  }, []);

  const addGoalToGroup = useCallback(
    async (goalId: string, groupId: string) => {
      const res = await axios.post(`/goals/addGoalToGroup`, {
        goalId: goalId,
        groupId: groupId,
      });
      const updatedGoal: GoalQueryResult = {
        id: res.data.id,
        description: res.data.description,
        completed: res.data.completed,
        groups: res.data.groups,
      };
      setGoals((goals) =>
        goals.map((item) => (item.id === updatedGoal.id ? updatedGoal : item))
      );
    },
    []
  );

  const removeGoalFromGroup = useCallback(
    async (goalId: string) => {
      if (!isGroup) return;
      const res = await axios.post(`/goals/removeGoalFromGroup`, {
        goalId: goalId,
        groupId: spec.id,
      });
      const updatedGoal: GoalQueryResult = {
        id: res.data.id,
        description: res.data.description,
        completed: res.data.completed,
        groups: res.data.groups,
      };
      setGoals((goals) =>
        goals.map((item) => (item.id === updatedGoal.id ? updatedGoal : item))
      );
    },
    [isGroup]
  );

  return (
    <>
      {isGroup && (
        <InviteDialog
          open={inviteDialogOpen}
          setOpen={setInviteDialogOpen}
          joinCode={spec.joinCode}
        />
      )}
      <GoalListPanelHeader
        editButtonState={editButtonState}
        setInviteDialogOpen={setInviteDialogOpen}
        setEditButtonState={setEditButtonState}
        spec={spec}
        leaveGroup={leaveGroup}
      />
      <GoalList
        goals={goalsInList}
        edit={editButtonState}
        editGoal={editGoal}
        deleteGoal={deleteGoal}
        removeGoal={removeGoalFromGroup}
      />
      <div className="fixed bottom-10 ml-5 mr-5">
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
              showAddForm ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Add existing goal</span>
            <span
              className={`${
                showAddForm ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        )}
      </div>
    </>
  );
};

export default GoalListPanel;
