import React, { useState, useEffect, useCallback } from "react";
import { Disclosure } from "@headlessui/react";
import {
  CheckCircleIcon as SolidCheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  FolderMinusIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { CheckCircleIcon as OutlineCheckCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";

import { Commit } from "../util/interfaces";
import { EditButtonState } from "./GoalListPanel";

import CommitItem from "./CommitItem";
import CreateCommitForm from "./CreateCommitForm";

interface GoalCardProps {
  goalId: string;
  description: string;
  completed: boolean;
  editButtonState: EditButtonState;
  editGoal: (
    goalId: string,
    description: string,
    completed: boolean
  ) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  removeGoal: (goalId: string) => Promise<void>;
}

const GoalCard = React.memo(
  ({
    goalId,
    editButtonState,
    description,
    completed,
    editGoal,
    deleteGoal,
    removeGoal,
  }: GoalCardProps) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [descriptionInput, setDescriptionInput] =
      useState<string>(description);
    const [commits, setCommits] = useState<Commit[]>([]);

    useEffect(() => {
      const load = async () => {
        const res = await axios.post("goals/getGoal", {
          id: goalId,
        });
        setCommits(res.data.commits);
      };
      load();
    }, [goalId]);

    const handleComplete = () => {
      const newCompleted = !completed;
      editGoal(goalId, descriptionInput, newCompleted);
    };

    const handleEdit = () => {
      setEdit(true);
    };

    const handleSave = () => {
      if (!descriptionInput) return;
      setEdit(false);
      editGoal(goalId, descriptionInput, completed);
    };

    const handleDelete = () => {
      deleteGoal(goalId);
    };

    const handleRemove = () => {
      removeGoal(goalId);
    };

    const createCommit = useCallback(
      async (description: string, hours: number) => {
        const res = await axios.post(`/goals/createCommit`, {
          goalId: goalId,
          description: description,
          hours: hours,
        });
        setCommits((commits) => [res.data, ...commits]);
      },
      [goalId]
    );

    const editCommit = useCallback(
      async (commitId: string, description: string, hours: number) => {
        const res = await axios.post(`/goals/editCommit`, {
          id: commitId,
          description: description,
          hours: hours,
        });
        setCommits((commits) =>
          commits.map((item) => (item.id === commitId ? res.data : item))
        );
      },
      []
    );

    const deleteCommit = useCallback(async (commitId: string) => {
      const res = await axios.post(`/goals/deleteCommit`, {
        id: commitId,
      });
      setCommits((commits) =>
        commits.filter((item) => item.id !== res.data.id)
      );
    }, []);

    return (
      <>
        <div className="mb-2 w-[32rem] rounded-md border border-gray-300 bg-white p-2 lg:w-[48rem] xl:w-[64rem]">
          <Disclosure>
            {({ open }) => (
              <>
                <div className="">
                  <div className="flex h-10 items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="rounded-md p-0.5 hover:bg-gray-300"
                        onClick={handleComplete}
                      >
                        {completed ? (
                          <SolidCheckCircleIcon className="h-7 w-7" />
                        ) : (
                          <OutlineCheckCircleIcon className="h-7 w-7" />
                        )}
                      </button>
                    </div>
                    {edit ? (
                      <>
                        <input
                          className="flex-grow border-r bg-gray-50 px-2 py-1 focus:outline-none"
                          type="text"
                          placeholder="Goal name"
                          value={descriptionInput}
                          onChange={(e) => setDescriptionInput(e.target.value)}
                        />
                        <button
                          className="rounded-md p-0.5 hover:bg-gray-300"
                          onClick={handleSave}
                        >
                          <CheckIcon className="h-7 w-7" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Disclosure.Button
                          as="div"
                          className="flex flex-grow items-center pl-2 hover:cursor-pointer"
                        >
                          {description}
                        </Disclosure.Button>
                        <div className="flex items-center">
                          {editButtonState === "edit" ? (
                            <button
                              className="rounded-md p-0.5 hover:bg-gray-300"
                              onClick={handleEdit}
                            >
                              <PencilSquareIcon className="h-7 w-7" />
                            </button>
                          ) : editButtonState === "delete" ? (
                            <button
                              className="rounded-md p-0.5 hover:bg-gray-300"
                              onClick={handleEdit}
                            >
                              <TrashIcon
                                className="h-7 w-7 hover:cursor-pointer"
                                onClick={handleDelete}
                              />
                            </button>
                          ) : (
                            // editButtonState === 'remove'
                            <button
                              className="rounded-md p-0.5 hover:bg-gray-300"
                              onClick={handleEdit}
                            >
                              <FolderMinusIcon
                                className="h-7 w-7 hover:cursor-pointer"
                                onClick={handleRemove}
                              />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {open && <CreateCommitForm createCommit={createCommit} />}
                </div>
                <Disclosure.Panel className="ml-5">
                  {commits.map((commit) => (
                    <CommitItem
                      key={commit.id}
                      commit={commit}
                      editCommit={editCommit}
                      deleteCommit={deleteCommit}
                    />
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </>
    );
  }
);

export default GoalCard;
