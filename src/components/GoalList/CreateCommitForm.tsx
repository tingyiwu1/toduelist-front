import { useState, useCallback } from "react";

import { PlusCircleIcon } from "@heroicons/react/24/solid";

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
    <div className=" ml-5 flex items-center justify-between bg-purple-300">
      <input
        className="flex-grow"
        type="text"
        value={description}
        placeholder="Add commit"
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="w-10"
        type="number"
        value={hours}
        min="0"
        placeholder="hrs"
        onChange={(e) => setHours(e.target.value)}
      />
      <button onClick={handleSubmit}>
        <PlusCircleIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CreateCommitForm;
