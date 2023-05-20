import { useState, useMemo } from 'react'
import { Combobox } from '@headlessui/react'
import { PlusCircleIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

import { GoalQueryResult } from '../util/interfaces'

interface AddGoalToGroupFormProps {
    groupId: string
    goals: GoalQueryResult[]
    addGoalToGroup: (goalId: string, groupId: string) => Promise<void>
}

const AddGoalToGroupForm = ({ groupId, goals, addGoalToGroup }: AddGoalToGroupFormProps) => {
    const [selected, setSelected] = useState<GoalQueryResult | null>(null)
    const [query, setQuery] = useState<string>('')

    const handleAdd = () => {
        if (selected !== null) {
            addGoalToGroup(selected.id, groupId)
            setSelected(null)
        }
    }

    const filteredGoals = query === ''
        ? goals
        : goals.filter((goal) => goal.description.toLowerCase().includes(query.toLowerCase()))
    return (
        <div className="bg-gray-50 mr-10">
            <Combobox value={selected} onChange={setSelected}>
                <Combobox.Options className="">
                    {filteredGoals.map((goal) => (
                        <Combobox.Option
                            key={goal.id}
                            value={goal}
                        >
                            {goal.description}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
                <div className="relative w-full">
                    <Combobox.Input
                        onChange={e => setQuery(e.target.value)}
                        displayValue={(g: GoalQueryResult | null) => g === null ? '' : g.description}
                        placeholder='Add existing goal'
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 pr-2">
                        <ChevronUpIcon className='h-5 w-5' />
                    </Combobox.Button>
                </div>
            </Combobox>
            <button onClick={handleAdd}><PlusCircleIcon className='h-5 w-5' /></button>
        </div>
    )
}

export default AddGoalToGroupForm