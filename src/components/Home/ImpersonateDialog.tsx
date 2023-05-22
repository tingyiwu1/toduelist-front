import { Dialog, RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";
import { User } from "../util/interfaces";
import axios from "axios";

interface ImpersonateDialogProps {
  open: boolean;
  user?: User;
  impersonatedUser?: User;
  setImpersonatedUser: (user: User | undefined) => void;
  setOpen: (open: boolean) => void;
}

const ImpersonateDialog = ({
  open,
  user,
  impersonatedUser,
  setImpersonatedUser,
  setOpen,
}: ImpersonateDialogProps) => {
  const [selectedUser, setSelectedUser] = useState<User>();
  const [fakeUsers, setFakeUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const res = await axios.get(`/getFakeUsers`);
      const fakeUsers = [user, ...res.data];
      setFakeUsers(fakeUsers);
      setSelectedUser(fakeUsers.find((u) => u.id === impersonatedUser?.id));
    };
    load();
  }, [user, impersonatedUser]);

  const handleSave = async () => {
    if (!selectedUser || !user) return;
    await axios.post(`/impersonate`, {
      realUserId: user.id,
      fakeUserId: selectedUser.id,
    });
    setOpen(false);
    setImpersonatedUser(selectedUser);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-lg bg-white p-3 text-left align-middle shadow-xl">
            <Dialog.Title className="text-lg font-medium">
              Impersonate user
            </Dialog.Title>
            <Dialog.Description className="mt-1">
              <div className="flex flex-col items-stretch">
                <RadioGroup
                  className="max-h-96 overflow-y-auto"
                  value={selectedUser}
                  onChange={setSelectedUser}
                >
                  {fakeUsers.map((user) => (
                    <RadioGroup.Option key={user.email} value={user}>
                      {({ checked }) => (
                        <span
                          className={`flex items-center text-lg ${
                            checked
                              ? "bg-red-300 hover:bg-red-400"
                              : "hover:bg-gray-200"
                          }`}
                        >
                          {user.name}
                        </span>
                      )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
                <button
                  className="rounded-lg border p-1 hover:bg-gray-300"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default ImpersonateDialog;
