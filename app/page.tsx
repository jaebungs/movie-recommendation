'use client'

import React, { useState } from 'react';
import Layout from '@/components/Layout'
import { AnswerType } from '@/types'
import { main } from '@/libs/api/main'
import { Questions } from '@/components'

const questionList = [
  {
    id: '1',
    text: "What's your favorite movie and why?"
  },
  {
    id: '2',
    text: "Are you in the modde for something new or a classic?"
  },
  {
    id:'3',
    text: "Do you wanna have fun or something serious?"
  },
]

export default function Home() {
  const [answer, setAnswer] = useState<AnswerType[]>([]);

  const updateAnswer = (questionId: string, answeredText: string) => {
    setAnswer(prevAnswers => {
      const existAnswer = prevAnswers.findIndex(answer => answer.questionId === questionId)

      if (existAnswer > -1) {
        const updatedAnswer = [...prevAnswers]
        updatedAnswer[existAnswer] = {questionId, answer: answeredText}
        
        return updatedAnswer
      } else {
        return [...prevAnswers, {questionId, answer: answeredText}]
      }
    })
  }

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    main(questionList, answer)
    console.log(answer)
  }

  return (
    <Layout>
      <form onSubmit={formSubmit}>
        {questionList.map( question => (
          <Questions key={question.id} id={question.id} question={question.text} updateAnswer={updateAnswer}/>
        ))}
        
        <button type="submit">Get Recommendation</button>
      </form>
    </Layout>
  )
}
