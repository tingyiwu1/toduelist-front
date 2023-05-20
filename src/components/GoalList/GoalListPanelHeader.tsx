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
    <div className="flex justify-between bg-gray-400 ">
      <div className="flex h-20 items-center bg-gray-500 ">
        <span className="bg-gray-200">{spec.name}</span>
        {isGroup && (
          <Menu>
            <Menu.Button className="inline-flex bg-gray-200">
              <UsersIcon className="h-5 w-5" />
            </Menu.Button>
            <Menu.Items className="absolute">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-blue-500" : "bg-gray-100"
                    } block w-full px-4 py-2 text-left text-sm text-gray-700`}
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
                      active ? "bg-blue-500" : "bg-gray-100"
                    } block w-full px-4 py-2 text-left text-sm text-gray-700`}
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
      <div className="flex items-center bg-gray-400">
        <button onClick={handleEdit}>
          {editButtonState === "edit" ? "Edit" : "Done"}
        </button>
      </div>
    </div>
  );
}

export default GoalListPanelHeader;
