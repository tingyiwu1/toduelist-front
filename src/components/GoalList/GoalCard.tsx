import React, { useState, useEffect, useCallback } from 'react'
import { Disclosure, Menu } from '@headlessui/react'
import { EllipsisHorizontalIcon, CheckCircleIcon as SolidCheckCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon as OutlineCheckCircleIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

import { Goal, Commit } from '../util/interfaces'

import CommitItem from './CommitItem'
import CreateCommitForm from './CreateCommitForm'

interface GoalCardProps {
    goalId: string
    description: string
    completed: boolean
    showDelete: boolean
    editGoal: (goalId: string, description: string, completed: boolean) => Promise<void>
    deleteGoal: (goalId: string) => Promise<void>
}

const GoalCard = React.memo(({ goalId, showDelete, description, completed, editGoal, deleteGoal }: GoalCardProps) => {

    const [edit, setEdit] = useState<boolean>(false)
    const [descriptionInput, setDescriptionInput] = useState<string>(description)
    const [commits, setCommits] = useState<Commit[]>([])
    const [groups, setGroups] = useState<{ id: string, name: string }[]>([])

    useEffect(() => {
        const load = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const res = await axios.post('goals/getGoal', {
                id: goalId
            })
            setCommits(res.data.commits)
            setGroups(res.data.groups)
        }
        load()
    }, [goalId])

    const handleComplete = () => {
        const newCompleted = !completed
        editGoal(goalId, descriptionInput, newCompleted)
    }

    const handleEdit = () => {
        setEdit(true)
    }

    const handleSave = () => {
        setEdit(false)
        editGoal(goalId, descriptionInput, completed)
    }

    const handleDelete = () => {
        deleteGoal(goalId)
    }

    const createCommit = useCallback(async (description: string, hours: number) => {
        const res = await axios.post(`/goals/createCommit`, {
            goalId: goalId,
            description: description,
            hours: hours
        })
        setCommits(commits => [res.data, ...commits])
    }, [goalId])

    const editCommit = useCallback(async (commitId: string, description: string, hours: number) => {
        console.log(commitId, description, hours)
        const res = await axios.post(`/goals/editCommit`, {
            id: commitId,
            description: description,
            hours: hours
        })
        setCommits(commits => commits.map(item => item.id === commitId ? res.data : item))
    }, [])

    const deleteCommit = useCallback(async (commitId: string) => {
        const res = await axios.post(`/goals/deleteCommit`, {
            id: commitId
        })
        setCommits(commits => commits.filter(item => item.id !== res.data.id))
    }, [])

    return (
        <>
            <div className=''>
                <Disclosure>
                    {({ open }) => (
                        <>
                            <div>
                                <div className="flex">
                                    <button onClick={handleComplete}>
                                        {completed ?
                                            <SolidCheckCircleIcon className="h-5 w-5" />
                                            :
                                            <OutlineCheckCircleIcon className="h-5 w-5" />
                                        }
                                    </button>
                                    {edit ?
                                        <>
                                            <input type="text" value={descriptionInput} onChange={e => setDescriptionInput(e.target.value)} />
                                            <button onClick={handleSave}>Save</button>
                                        </> :
                                        <>
                                            <Disclosure.Button as="div">
                                                {description}
                                            </Disclosure.Button>
                                            {showDelete ?
                                                <TrashIcon className="h-5 w-5" onClick={handleDelete} />
                                                :

                                                <PencilSquareIcon className="h-5 w-5" onClick={handleEdit} />
                                            }
                                        </>
                                    }
                                </div>
                                {open ?
                                    <CreateCommitForm createCommit={createCommit} />
                                    :
                                    <></>
                                }
                            </div>
                            <Disclosure.Panel>
                                {commits.map((commit) =>
                                    <CommitItem key={commit.id} commit={commit} editCommit={editCommit} deleteCommit={deleteCommit} />
                                )}
                            </Disclosure.Panel>
                        </>
                    )}

                </Disclosure>
            </div >
        </>
    )
})

export default GoalCard