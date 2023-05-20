import { useEffect, useState } from 'react'
import axios from 'axios'

export interface LeaderboardProps {
    groupId: string
}

interface LeaderboardEntry {
    user: {
        id: string
        email: string
        name: string
    }
    score: number
}

const Leaderboard = ({ groupId }: LeaderboardProps) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

    useEffect(() => {
        const load = async () => {
            const res = await axios.post(`/groups/leaderboard`, {
                groupId: groupId
            })
            setLeaderboard(res.data)
        }
        load()
    }, [groupId])

    return (
        <div>
            <h1>Leaderboard</h1>
            {leaderboard.map((entry, index) => (
                <div key={index}>
                    <span>{entry.user.name}</span>
                    <span>{entry.score}</span>
                </div>
            ))}
        </div>
    )
}



export default Leaderboard