import { Menu } from "@headlessui/react";
import { PencilIcon, UsersIcon } from "@heroicons/react/24/solid";

import { GoalListSpec } from "../util/interfaces";
import { EditButtonState } from "./GoalListPanel";
import { GoalFilter } from "../util/interfaces";
import { EditDialogSpec } from "../Home/EditGroupDialog";

interface GoalListPanelHeaderProps {
  spec: GoalListSpec;
  editButtonState: EditButtonState;
  setInviteDialogOpen: (open: boolean) => void;
  setEditDialogSpec: (spec: EditDialogSpec) => void;
  leaveGroup: (groupId: string) => Promise<void>;
  setEditButtonState: (state: EditButtonState) => void;
}

function GoalListPanelHeader({
  spec,
  editButtonState,
  setInviteDialogOpen,
  setEditDialogSpec,
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
      <div className="flex w-[32rem] justify-between lg:w-[48rem] xl:w-[64rem]">
        <div className="flex h-20 items-center ">
          <span className="text-4xl mr-1">{spec.name}</span>
          {isGroup && (
            <>
              <button
                className="mx-1 rounded-lg p-1 hover:bg-gray-300"
                onClick={() => setEditDialogSpec(spec)}
              >
                <PencilIcon className="h-10 w-10" />
              </button>
              <Menu as="div">
                <Menu.Button
                  className={({ open }) =>
                    `${
                      open ? "bg-gray-300" : ""
                    } mx-1 rounded-lg p-1 hover:bg-gray-300`
                  }
                >
                  <UsersIcon className="h-10 w-10" />
                </Menu.Button>
                <Menu.Items className="absolute rounded-md bg-gray-50 p-1 shadow-lg">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-red-300" : ""
                        } block w-full rounded-md px-4 py-1 text-left text-sm`}
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
                        } block w-full rounded-md px-4 py-1 text-left text-sm`}
                        onClick={() => leaveGroup(spec.id)}
                      >
                        <span className="flex items-center">Leave</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </>
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
