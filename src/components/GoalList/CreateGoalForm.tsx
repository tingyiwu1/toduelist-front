import { useState, useCallback } from "react";

import { PlusCircleIcon } from "@heroicons/react/24/solid";

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
    <div className="flex flex-grow items-center bg-purple-300">
      <input
        className="flex-grow"
        type="text"
        value={description}
        placeholder="New goal"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleSubmit}>
        <PlusCircleIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CreateGoalForm;
