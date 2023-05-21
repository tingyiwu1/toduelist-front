import React, { useState, useMemo } from "react";
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
    const [hours, setHours] = useState<string>(commit.hours.toString());

    const durationString = useMemo(() => {
      const hoursStr = commit.hours.toString();
      if (commit.hours === 0) return "";
      return `${hoursStr} hr${hoursStr === "1" ? "" : "s"}`;
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
      const hoursNum = parseFloat(hours);
      if (!description && !hoursNum) return;
      editCommit(commit.id, description, hoursNum || 0);
      setEdit(false);
    };

    const handleDelete = () => {
      deleteCommit(commit.id);
      console.log("delete");
    };

    return (
      <>
        <div className="my-1 pl-2 text-sm lg:text-base">
          {edit ? (
            <div className="flex items-center justify-between">
              <textarea
                className="flex-grow border-r bg-gray-50 px-3 py-1 focus:outline-none"
                rows={1}
                value={description}
                placeholder="Description"
                onChange={(e) =>
                  setDescription(e.target.value.replace(/\n/g, ""))
                }
              />
              <input
                className="w-14 bg-gray-50 py-1 pl-3 focus:outline-none"
                type="number"
                value={hours}
                placeholder="hrs"
                onChange={(e) => setHours(e.target.value)}
              />
              <button
                className="rounded-md p-0.5 hover:bg-gray-300"
                onClick={handleSave}
              >
                <CheckIcon className="h-7 w-7" />
              </button>
            </div>
          ) : (
            <div className="flex justify-between text-ellipsis pl-3">
              <div className="mr-3 flex items-center">
                <div className="">{commit.description}</div>
                {commit.description && durationString && (
                  <div className="w-3 flex-grow-0 "></div>
                )}
                <div className="whitespace-nowrap italic">{durationString}</div>
              </div>
              <div className="flex items-center">
                <div className="mr-3 whitespace-nowrap">{createdAtString}</div>

                <Menu as="div">
                  <div className="flex items-center">
                    <Menu.Button className="z-0 rounded-md p-0.5 hover:bg-gray-300">
                      <EllipsisHorizontalIcon className="h-7 w-7" />
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute z-10 flex flex-col self-start rounded-md bg-gray-50 p-1 shadow-lg">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-300" : ""
                          } block w-full rounded-md px-4 py-1 text-left text-sm`}
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
                            active ? "bg-red-300" : ""
                          } block w-full rounded-md px-4 py-1 text-left text-sm`}
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
