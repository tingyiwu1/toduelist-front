import { Menu } from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/24/solid";

import { GoalListSpec } from "../util/interfaces";
import { EditButtonState } from "./GoalListPanel";
import { GoalFilter } from "../util/interfaces";

interface GoalListPanelHeaderProps {
  spec: GoalListSpec;
  editButtonState: EditButtonState;
  setInviteDialogOpen: (open: boolean) => void;
  leaveGroup: (groupId: string) => Promise<void>;
  setEditButtonState: (state: EditButtonState) => void;
}

function GoalListPanelHeader({
  spec,
  editButtonState,
  setInviteDialogOpen,
  leaveGroup,
  setEditButtonState,
}: GoalListPanelHeaderProps) {
  const handleEdit = () => {
    if (editButtonState === "edit") {
      if (isGroup) {
        setEditButtonState("remove");
      } else {
        setEditButtonState("delete");
      }
    } else {
      setEditButtonState("edit");
    }
  };

  const isGroup = !(spec instanceof GoalFilter);
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-80 justify-between  xl:w-[64rem]">
        <div className="flex h-20 items-center ">
          <span className="text-4xl">{spec.name}</span>
          {isGroup && (
            <Menu as="div" className="relative">
              <Menu.Button
                className={({ open }) =>
                  `${
                    open ? "bg-gray-300" : ""
                  } mx-3 rounded-lg p-1 hover:bg-gray-300`
                }
              >
                <UsersIcon className="h-10 w-10" />
              </Menu.Button>
              <Menu.Items className="absolute left-full top-0 rounded-md bg-gray-100 p-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-300" : ""
                      } block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700`}
                      onClick={() => setInviteDialogOpen(true)}
                    >
                      <span className="flex items-center">Invite</span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-300" : ""
                      } block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700`}
                      onClick={() => leaveGroup(spec.id)}
                    >
                      <span className="flex items-center">Leave</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          )}
        </div>
        <div className="flex items-center">
          <button
            className={`${
              editButtonState === "edit"
                ? "border hover:bg-gray-300"
                : "bg-blue-300 hover:bg-blue-400"
            } w-20 rounded-md border-gray-300 py-2 text-xl`}
            onClick={handleEdit}
          >
            {editButtonState === "edit" ? "Edit" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalListPanelHeader;
