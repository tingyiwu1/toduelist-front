import React, { useState, useEffect, useCallback } from 'react'
import { Disclosure, Menu } from '@headlessui/react'
import { EllipsisHorizontalIcon, CheckCircleIcon as SolidCheckCircleIcon, PencilSquareIcon, TrashIcon, FolderMinusIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon as OutlineCheckCircleIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

import { Goal, Commit } from '../util/interfaces'
import { EditButtonState } from './GoalListPanel'

import CommitItem from './CommitItem'
import CreateCommitForm from './CreateCommitForm'

interface GoalCardProps {
    goalId: string
    description: string
    completed: boolean
    editButtonState: EditButtonState
    editGoal: (goalId: string, description: string, completed: boolean) => Promise<void>
    deleteGoal: (goalId: string) => Promise<void>
    removeGoal: (goalId: string) => Promise<void>
}

const GoalCard = React.memo(({ goalId, editButtonState, description, completed, editGoal, deleteGoal, removeGoal }: GoalCardProps) => {

    const [edit, setEdit] = useState<boolean>(false)
    const [descriptionInput, setDescriptionInput] = useState<string>(description)
    const [commits, setCommits] = useState<Commit[]>([])

    useEffect(() => {
        const load = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const res = await axios.post('goals/getGoal', {
                id: goalId
            })
            setCommits(res.data.commits)
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

    const handleRemove = () => {
        removeGoal(goalId)
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
                                            {editButtonState === 'edit' ?
                                                <PencilSquareIcon className="h-5 w-5" onClick={handleEdit} />
                                                : editButtonState === 'delete' ?
                                                    <TrashIcon className="h-5 w-5" onClick={handleDelete} />
                                                    :
                                                    <FolderMinusIcon className="h-5 w-5" onClick={handleRemove}/>
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