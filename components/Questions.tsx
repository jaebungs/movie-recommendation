'use client'
import React from 'react'
import { QuestionsProps } from '@/types'

const Questions = ({ id, question, updateAnswer} : QuestionsProps) => {
  return (
    <div>
        <label htmlFor={id}>{ question }</label>
        <input className="question-answer" type="text" id={id} name={id} onChange={(e) => updateAnswer(id, e.target.value)}/>
    </div>
  )
}

export default Questions