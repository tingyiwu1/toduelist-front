import { useState, useCallback } from "react";

import { PlusCircleIcon } from "@heroicons/react/24/solid";

interface CreateCommitFormProps {
  createCommit: (description: string, hours: number) => void;
}

const CreateCommitForm = ({ createCommit }: CreateCommitFormProps) => {
  const [description, setDescription] = useState<string>("");
  const [hours, setHours] = useState<string>("");

  const handleSubmit = useCallback(() => {
    if (!description && !hours) return;
    createCommit(description, parseFloat(hours) || 0);
    setDescription("");
    setHours("");
  }, [description, hours]);

  return (
    <>
      <input
        type="text"
        value={description}
        placeholder="Add commit"
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        value={hours}
        min="0"
        placeholder="hrs"
        onChange={(e) => setHours(e.target.value)}
      />
      <button onClick={handleSubmit}>
        <PlusCircleIcon className="h-5 w-5" />
      </button>
    </>
  );
};

export default CreateCommitForm;
