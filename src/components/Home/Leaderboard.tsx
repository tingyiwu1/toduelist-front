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
    <div>
      <h1>Leaderboard</h1>
      <button onClick={load}>
        <ArrowPathIcon className="h-5 w-5" />
      </button>
      {leaderboard.map((entry, index) => (
        <div key={index}>
          <span>{entry.user.name}</span>
          <span>{entry.score}</span>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
