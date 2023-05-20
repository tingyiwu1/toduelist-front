import { Dialog } from "@headlessui/react";
import { ClipboardIcon } from "@heroicons/react/24/solid";

interface InviteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  joinCode: string;
}

const InviteDialog = ({ open, setOpen, joinCode }: InviteDialogProps) => {
  const url = window.location.origin + "/join/" + joinCode;
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Dialog.Panel>
        <Dialog.Title>Invite Link</Dialog.Title>
        <Dialog.Description>
          <span>Share this link to invite your friends:</span>
          <br />
          <span>{url}</span>
          <button onClick={() => navigator.clipboard.writeText(url)}>
            <ClipboardIcon className="h-5 w-5" />
          </button>
        </Dialog.Description>
      </Dialog.Panel>
    </Dialog>
  );
};

export default InviteDialog;
