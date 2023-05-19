export interface GoalQueryResult {
    id: string
    description: string
    completed: boolean
    groups: string[]
}

export interface Goal {
    id: string
    description: string
    completed: boolean
    userId: string
    commits: Commit[]
    groups: {
        id: string
        name: string
    }[]
}

export interface Commit {
    id: string
    createdAt: string
    description: string
    hours: number
    goalId: string
}

export interface Group {
    id: string
    name: string
    timeZone: string
    users?: {
        id: string
        email: string
        name: string
    }[]
}

// enum emulation from stackoverflow.com
export class GoalFilter {
    static readonly values: GoalFilter[] = []

    static readonly ALL = new GoalFilter('All Goals')
    static readonly ACTIVE = new GoalFilter('Active')
    static readonly COMPLETED = new GoalFilter('Completed')
    

    private constructor(public readonly name: string) {
        GoalFilter.values.push(this)
    }
}

export type GoalListSpec = Group | GoalFilter