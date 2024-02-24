'use client'

import React, { useState } from 'react';
import Layout from '@/components/Layout'
import { Questions } from '@/components'

type AnswerType = {
  questionId: string;
  answer: string;
}

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
