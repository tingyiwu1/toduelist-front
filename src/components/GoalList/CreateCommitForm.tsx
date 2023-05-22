import { useState, useCallback } from "react";

import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface CreateCommitFormProps {
  createCommit: (description: string, hours: number) => void;
}

const CreateCommitForm = ({ createCommit }: CreateCommitFormProps) => {
  const [description, setDescription] = useState<string>("");
  const [hours, setHours] = useState<string>("");

  const handleSubmit = useCallback(() => {
    const hoursNum = parseFloat(hours);
    if (!description && !hoursNum) return;
    createCommit(description, hoursNum || 0);
    setDescription("");
    setHours("");
  }, [description, hours]);

  return (
    <div className=" ml-8 flex items-center justify-between bg-gray-50">
      <input
        className="flex-grow border-r bg-gray-50 px-2 py-1 focus:outline-none"
        type="text"
        value={description}
        placeholder="Add commit"
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className=" w-14 bg-gray-50 py-1 pl-3 focus:outline-none"
        type="number"
        value={hours}
        min="0"
        placeholder="hrs"
        onChange={(e) => setHours(e.target.value)}
      />
      <button
        className="rounded-md p-0.5 hover:bg-gray-300"
        onClick={handleSubmit}
      >
        <PlusCircleIcon className="h-7 w-7" />
      </button>
    </div>
  );
};

export default CreateCommitForm;
