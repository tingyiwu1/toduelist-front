import { useState, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import axios from 'axios'

import { Group, GoalListSpec, GoalFilter } from '../util/interfaces'

import GoalList from '../GoalList/GoalList'
import GoalListPanel from '../GoalList/GoalListPanel'

const Home = () => {
    const [selectedSpec, setSelectedSpec] = useState<GoalListSpec>(GoalFilter.ALL)
    const [groups, setGroups] = useState<Group[]>([])

    useEffect(() => {
        const load = async () => {
            const res = await axios.get(`/groups/allGroups`)
            setGroups(res.data)
        }
        load()
    }, [])

    return (
        <>
            <div className="flex flex-row fixed left-0 top-0 w-screen h-10 bg-gray-100">
                <div>toduelist</div>
            </div>

            <div className="fixed top-10 left-0 h-screen w-40 m-0 flex flex-col bg-gray-50 shadow">
                <RadioGroup value={selectedSpec} onChange={setSelectedSpec}>
                    {/* <RadioGroup.Label>Lists</RadioGroup.Label> */}
                    {GoalFilter.values.map(goalFilter => 
                        <RadioGroup.Option value={goalFilter} key={goalFilter.name}>
                            {({ checked }) => (
                                <span className={checked ? 'bg-blue-600' : 'bg-gray-200'}>{goalFilter.name}</span>
                            )}
                        </RadioGroup.Option>
                    )}
                    {groups.map((group) =>
                        <RadioGroup.Option value={group} key={group.id}>
                            {({ checked }) => (
                                <span className={checked ? 'bg-blue-600' : 'bg-gray-200'}>{group.name}</span>
                            )}
                        </RadioGroup.Option>
                    )}
                </RadioGroup>
            </div>
            <div className="ml-40 mt-10">
                <GoalListPanel spec={selectedSpec} />
            </div>

        </>
    )
}

export default Home