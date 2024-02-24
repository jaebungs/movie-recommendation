export type QuestionsProps = {
    id: string
    question: string,
    updateAnswer: (questionId: string, answeredText: string) => void;
}

export type AnswerType = {
    questionId: string;
    answer: string;
  }