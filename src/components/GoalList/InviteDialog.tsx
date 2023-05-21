import { Dialog } from "@headlessui/react";
import { ClipboardIcon } from "@heroicons/react/24/solid";

interface InviteDialogProps {
  open: boolean;
  group: string;
  setOpen: (open: boolean) => void;
  joinCode: string;
}

const InviteDialog = ({ open, group, setOpen, joinCode }: InviteDialogProps) => {
  const url = window.location.origin + "/join/" + joinCode;
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-lg bg-white p-3 text-left align-middle shadow-xl">
            <Dialog.Title className="text-lg font-medium">
              {group} Invite Link
            </Dialog.Title>
            <Dialog.Description className="mt-1">
              <div>Share this link to invite your friends to join {group}:</div>
              <div className="flex items-center">
                <span>{url}</span>
                <button
                  className="rounded-lg p-0.5 hover:bg-gray-400"
                  onClick={() => navigator.clipboard.writeText(url)}
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>
              </div>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default InviteDialog;
