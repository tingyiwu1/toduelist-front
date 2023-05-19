import { useState, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'

import { GoalQueryResult, Goal, GoalListSpec, GoalFilter, Group } from '../util/interfaces'

import GoalCard from './GoalCard'

interface GoalListProps {
    spec: GoalListSpec
}

const filterGoals = (goals: GoalQueryResult[], spec: GoalListSpec) => {
    let filter: (goal: GoalQueryResult) => boolean
    if (spec === GoalFilter.ALL)
        filter = (_: GoalQueryResult) => true
    else if (spec === GoalFilter.ACTIVE)
        filter = (goal: GoalQueryResult) => goal.completed === false
    else if (spec === GoalFilter.COMPLETED)
        filter = (goal: GoalQueryResult) => goal.completed === true
    else { // spec is a group
        const group = spec as Group
        filter = (goal: GoalQueryResult) => goal.groups.find((groupId: string) => groupId === group.id) !== undefined
    }
    return goals.filter(filter)
}

const GoalList = ({ spec }: GoalListProps) => {

    const [goals, setGoals] = useState<GoalQueryResult[]>([])
    const [edit, setEdit] = useState<boolean>(false)

    useEffect(() => {
        const load = async () => {
            const res = await axios.get(`/goals/goalQuery`)
            setGoals(res.data)
        }
        load()
    }, [])

    const handleEdit = () => {
        setEdit(edit => !edit)
    }

    const editGoal = useCallback(async (goalId: string, description: string, completed: boolean) => {
        console.log(completed)
        const res = await axios.post(`/goals/editGoal`, {
            id: goalId,
            description: description,
            completed: completed
        })
        const updatedGoal: GoalQueryResult = {
            id: res.data.id,
            completed: res.data.completed,
            groups: res.data.groups
        }
        console.log(updatedGoal)
        setGoals(goals => goals.map(item => item.id === updatedGoal.id ? updatedGoal : item))
    }, [])

    const deleteGoal = useCallback(async (goalId: string) => {
        const res = await axios.post(`/goals/deleteGoal`, {
            id: goalId
        })
        setGoals(goals => goals.filter(item => item.id !== res.data.id))
    }, [])

    // might not need memo
    const filteredGoals = useMemo(() => filterGoals(goals, spec), [goals, spec])
    return (
        <>
            <div className="flex">
                <div>
                    <span>{spec.name}</span>
                </div>
                <div>
                    <button onClick={handleEdit}>{edit ? "Done" : "Edit"}</button>
                </div>
            </div>
            {filteredGoals.map((goal) =>
                <GoalCard key={goal.id} goalId={goal.id} showDelete={edit} editGoal={editGoal} deleteGoal={deleteGoal} />
            )}
        </>
    )
}

export default GoalList