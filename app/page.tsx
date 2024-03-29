'use client'

import React, { useState } from 'react';
import Layout from '@/components/Layout'
import { AnswerType, MatchedMovie } from '@/types'
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

async function getChatCompletions(questionsAndAnswers: string, context: string) {
  try {
    const response = await fetch('api/getChatCompletions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ questionsAndAnswers, context })
    })

    if (!response.ok) throw new Error('Network from getChatCompletions resposne was no ok')
    
    return response.json()

  } catch (error) {
    console.error(`Error during getChatCompletion. - ${error}`)
  }
}

export default function Home() {
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [recommendationResult, setRecommendationResult] = useState('')

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

  const formSubmit = async (e: React.FormEvent) => {
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
    if (matchings.length <= 0) {
      setRecommendationResult(() => {
        return `Sorry, we couldn't find a movie you'd like. My database is pretty small.`
      })
      throw new Error('No movie matching found.')
    }
    const matchingInString = matchings.map(matchedMovie => matchedMovie.content).join(', ')

    // 3. Use openai chat completion to give recommendation.
    const recommendationAnswer = await getChatCompletions(concat, matchingInString)
    
    setRecommendationResult(() => {
      return recommendationAnswer.choices[0].message.content
    })
    console.log('Recommendation: ', recommendationAnswer.choices[0].message.content)
  
  }

  return (
    <Layout>
      <form onSubmit={formSubmit}>
        {questionList.map( question => (
          <Questions key={question.id} id={question.id} question={question.text} updateAnswer={updateAnswer}/>
        ))}
        
        <button type="submit">Get Recommendation</button>
        
        <h2>Recommendation:</h2>
        <div>{recommendationResult}</div>
      </form>
    </Layout>
  )
}
