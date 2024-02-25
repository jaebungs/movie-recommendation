export type InitialQuestionList = {
    id: string,
    text: string
}

export type QuestionsProps = {
    id: string
    question: string,
    updateAnswer: (questionId: string, answeredText: string) => void;
}

export type AnswerType = {
    questionId: string;
    answer: string;
  }

export interface MatchedMovie {
    content: string;
    id: number;
    similarity: number;
}