import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

import {
  GoalQueryResult,
  GoalListSpec,
  GoalFilter,
  Group,
  GoogleUser,
} from "../util/interfaces";

import GoalList from "./GoalList";
import InviteDialog from "./InviteDialog";
import GoalListPanelHeader from "./GoalListPanelHeader";
import GoalInput from "./GoalInput";
import { EditDialogSpec } from "../Home/EditGroupDialog";

interface GoalListPanelProps {
  user?: GoogleUser;
  spec: GoalListSpec;
  leaveGroup: (groupId: string) => Promise<void>;
  setEditDialogSpec: (spec: EditDialogSpec) => void;
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

const GoalListPanel = ({
  user,
  spec,
  leaveGroup,
  setEditDialogSpec,
}: GoalListPanelProps) => {
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
    if (!user) {
      setGoals([]);
      return;
    }
    const load = async () => {
      const res = await axios.get(`/goals/goalQuery`);
      setGoals(res.data);
    };
    load();
  }, [user]);

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
          group={spec.name}
          setOpen={setInviteDialogOpen}
          joinCode={spec.joinCode}
        />
      )}
      <GoalListPanelHeader
        editButtonState={editButtonState}
        setInviteDialogOpen={setInviteDialogOpen}
        setEditDialogSpec={setEditDialogSpec}
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
      <GoalInput
        spec={spec}
        goalsNotInList={goalsNotInList}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        createGoal={createGoal}
        addGoalToGroup={addGoalToGroup}
      />
      <div className="h-[6rem]"></div>
    </>
  );
};

export default GoalListPanel;
