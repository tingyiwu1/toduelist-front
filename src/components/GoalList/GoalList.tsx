import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

import { GoalQueryResult } from "../util/interfaces";
import { EditButtonState } from "./GoalListPanel";

import GoalCard from "./GoalCard";

interface GoalListProps {
  goals: GoalQueryResult[];
  edit: EditButtonState;
  editGoal: (
    goalId: string,
    description: string,
    completed: boolean
  ) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  removeGoal: (goalId: string) => Promise<void>;
}

const GoalList = ({
  goals,
  edit,
  editGoal,
  deleteGoal,
  removeGoal,
}: GoalListProps) => {
  return (
    <div className="mx-40 bg-gray-200">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goalId={goal.id}
          description={goal.description}
          completed={goal.completed}
          editButtonState={edit}
          editGoal={editGoal}
          deleteGoal={deleteGoal}
          removeGoal={removeGoal}
        />
      ))}
    </div>
  );
};

export default GoalList;
