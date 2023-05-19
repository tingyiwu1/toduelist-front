import { useState, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'

import { GoalQueryResult } from '../util/interfaces'

import GoalCard from './GoalCard'

interface GoalListProps {
    goals: GoalQueryResult[]
    edit: boolean
    editGoal: (goalId: string, description: string, completed: boolean) => Promise<void>
    deleteGoal: (goalId: string) => Promise<void>
}

const GoalList = ({ goals, edit, editGoal, deleteGoal }: GoalListProps) => {

    return (
        <>
            {goals.map((goal) =>
                <GoalCard key={goal.id} goalId={goal.id} showDelete={edit} editGoal={editGoal} deleteGoal={deleteGoal} />
            )}
        </>
    )
}

export default GoalList