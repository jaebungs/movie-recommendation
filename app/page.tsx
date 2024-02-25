'use client'

import React, { useState } from 'react';
import Layout from '@/components/Layout'
import { AnswerType } from '@/types'
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

async function callCreateEmbedding(prompt : string) {
  try {
    const response = await fetch('/api/createEmbedding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    console.log('callCreateEmbedding', response)
    if (!response.ok) throw new Error('Network from callCreateEmbedding resposne was no ok')

    return response.json();

  } catch (error) {
    console.error(`API failed during createEmbedding. - ${error}`)
  }
}

async function callNearestMatch(embedding: []) {
  try {
    const response = await fetch('/api/findNearestMatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ embedding })
    })

    if (!response.ok) throw new Error('Network from callNearestMatch resposne was no ok')

    return response.json()
  
  } catch (error) {
    console.error(`Error during callNearestMatch. - ${error}`)
  }
}

export default function Home() {
  const [answers, setAnswers] = useState<AnswerType[]>([]);

  const updateAnswer = (questionId: string, answeredText: string) => {
    setAnswers(prevAnswers => {
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

    let concat : string = ''
    for (let i = 0; i < answers.length; i++) {
        const question = questionList[i].text
        const answer = answers[i].answer
        concat += `${question} and the answer is ${answer} ||`
    }

    // 1. Get Question and answer embedding values
    const embeddingResponse = await callCreateEmbedding(concat)
    const embedding = embeddingResponse[0].embedding

    // 2. Perfrom smiliarity search using the embedding values
    const matchings: MatchedMovie[] = await callNearestMatch(embedding)
    const matchingInString = matchings.map(matchedMovie => matchedMovie.content).join(', ')
    console.log('matchings', matchingInString)
    
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
