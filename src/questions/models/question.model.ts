export class Question {
    constructor(
        public id: string,
        public text: string,
        public choices: string[],
        public correctAnsIndex: number,
        public points: number,
    ) { }
}

