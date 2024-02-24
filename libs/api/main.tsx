/*
    1. Get answer embedding from ChatGPT
    2. Simliarity search in the supabase vector DB
    3. Get Chat completion from ChatGPT using the data from the nearest search(#2)
*/

import { getEmbedding } from './getEmbedding'
import { InitialQuestionList, AnswerType } from '@/types'

export const main = (questions: InitialQuestionList[], answers: AnswerType[]) => {

    for (let i = 0; i < answers.length; i++) {
        const question = questions[i].text
        const answer = answers[i].answer
    }
}
