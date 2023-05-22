import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { ArrowPathIcon } from "@heroicons/react/24/solid";

export interface LeaderboardProps {
  groupId: string;
}

interface LeaderboardEntry {
  user: {
    id: string;
    email: string;
    name: string;
  };
  score: number;
}

const Leaderboard = ({ groupId }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const load = useCallback(async () => {
    const res = await axios.post(`/groups/leaderboard`, {
      groupId: groupId,
    });
    setLeaderboard(res.data);
  }, [groupId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="h-60 divide-y overflow-y-auto border-t border-gray-300 p-2 pb-6">
      <div className="mb-2 flex h-8 items-center justify-between">
        <span>Leaderboard</span>
        <button className="rounded-lg p-1 hover:bg-gray-300" onClick={load}>
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      <div>
        {leaderboard.map((entry, index) => (
          <div className="flex justify-between" key={index}>
            <span>{entry.user.name}</span>
            <span>{entry.score} hrs</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
