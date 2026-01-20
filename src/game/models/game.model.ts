export interface PlayerAnswer {
    questionId: string
    answer: string
    isCorrect: boolean
    answeredAt: Date
}

export interface PlayerState {
    userId: string
    score: number
    currentQuestionIndex: number
    answers: PlayerAnswer[]
}

export interface GameWinner {
    userId: string
    score: number
}

export class Game {
    constructor(
        public readonly id: string,
        public readonly players: string[],
        public readonly questions: string[],
        public status: 'waiting' | 'active' | 'completed',
        public playerStates: Record<string, PlayerState>,
        public winner?: GameWinner | null
    ) { }
}