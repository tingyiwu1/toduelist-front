import React, { useState, useCallback, useMemo } from "react";
import { Menu } from "@headlessui/react";
import { EllipsisHorizontalIcon, CheckIcon } from "@heroicons/react/24/solid";
import * as dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(RelativeTime);

import { Commit } from "../util/interfaces";

interface CommitItemProps {
  commit: Commit;
  editCommit: (
    commitId: string,
    description: string,
    hours: number
  ) => Promise<void>;
  deleteCommit: (commitId: string) => Promise<void>;
}

const CommitItem = React.memo(
  ({ commit, editCommit, deleteCommit }: CommitItemProps) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [description, setDescription] = useState<string>(commit.description);
    const [hours, setHours] = useState<number>(commit.hours);

    const durationString = useMemo(() => {
      if (commit.hours === 0) return "";
      return `${hours} hr${hours === 1 ? "" : "s"}`;
    }, [commit.hours]);

    const createdAtString = useMemo(() => {
      const date = new Date(commit.createdAt);
      const now = dayjs();
      const yesterday = dayjs().subtract(1, "day");
      const aWeekAgo = dayjs().subtract(1, "week");

      const dayString = dayjs(date).isSame(now, "day")
        ? "Today"
        : dayjs(date).isSame(yesterday, "day")
        ? "Yesterday"
        : dayjs(date).isAfter(aWeekAgo)
        ? dayjs(date).format("dddd")
        : dayjs(date).format("MM/DD/YY");

      return `${dayString} ${dayjs(date).format("h:mm A")}`;
    }, [commit.createdAt]);

    const handleEdit = () => {
      setEdit(true);
    };

    const handleSave = () => {
      setEdit(false);
      editCommit(commit.id, description, hours);
    };

    const handleDelete = () => {
      deleteCommit(commit.id);
      console.log("delete");
    };

    return (
      <>
        <div className=" bg-green-100">
          {edit ? (
            <div className="flex justify-between">
              <textarea
                className="flex-grow"
                // type="text"
                rows={1}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value.replace(/\n/g, ""))
                }
              />
              <input
                className="w-10"
                type="number"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
              />
              <button onClick={handleSave}>
                <CheckIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-between text-ellipsis">
              <div className="flex">
                <div className="bg-purple-300">{commit.description}</div>
                {commit.description && durationString && (
                  <div className="w-3 flex-grow-0 bg-red-300"></div>
                )}
                <div className="whitespace-nowrap bg-blue-300 italic">
                  {durationString}
                </div>
              </div>
              <div className="flex items-center">
                <div className="whitespace-nowrap bg-yellow-300">
                  {createdAtString}
                </div>

                <Menu as="div" className="flex items-center">
                  <Menu.Button className="bg-gray-300">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </Menu.Button>

                  <Menu.Items className="absolute flex flex-col self-start bg-red-200">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-purple-500" : "bg-purple-300"
                          } block w-full px-4 py-2 text-left`}
                          onClick={handleEdit}
                        >
                          <span className="flex items-center">Edit</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-purple-500" : "bg-purple-300"
                          } block w-full px-4 py-2 text-left`}
                          onClick={handleDelete}
                        >
                          <span className="flex items-center">Delete</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default CommitItem;
