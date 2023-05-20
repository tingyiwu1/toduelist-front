import React, { useState, useCallback } from "react";
import { Menu } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

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
        <div className="">
          {edit ? (
            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
              />
              <button onClick={handleSave}>save</button>
            </div>
          ) : (
            <div>
              <span>{commit.description}</span>
              <span>{commit.hours}</span>
              <span>{commit.createdAt}</span>
              <Menu>
                <Menu.Button>
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </Menu.Button>
                <Menu.Items>
                  <Menu.Item>
                    <button onClick={handleEdit}>edit</button>
                  </Menu.Item>
                  <Menu.Item>
                    <button onClick={handleDelete}>delete</button>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default CommitItem;
