import { useState, useCallback } from "react";

import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface CreateGoalFormProps {
  createGoal: (description: string) => Promise<void>;
}

const CreateGoalForm = ({ createGoal }: CreateGoalFormProps) => {
  const [description, setDescription] = useState<string>("");

  const handleSubmit = useCallback(() => {
    if (!description) return;
    createGoal(description);
    setDescription("");
  }, [description]);

  return (
    <div className="flex flex-grow items-center">
      <input
        className="flex-grow bg-gray-50 px-2 py-1 focus:outline-none"
        type="text"
        value={description}
        placeholder="New goal"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="rounded-lg p-0.5 hover:bg-gray-400"
        onClick={handleSubmit}
      >
        <PlusCircleIcon className="h-7 w-7" />
      </button>
    </div>
  );
};

export default CreateGoalForm;
