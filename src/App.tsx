import React, { useEffect } from 'react'
import wordsToNumbers from 'words-to-numbers'
import { useState, useReducer } from 'react'
import { requestProblem } from './api/Problem'
import { requestCalculation, OperationEnum } from './api/Calculate'
import { AnswerContext, AnswerDispatchContext, EmptyAnswersArray, AnswerStateAction, AnswerStateActionType } from './AppContext'
import { Answer, AnswerList } from './ui/AnswerList'
import './App.css'

const emptyProblem = {key1: '', key2: ''}

function App() {
  const [appReady, setAppReady] = useState(false)
  const [problem, setProblem] = useState(emptyProblem)
  const [answers, dispatch] = useReducer(answerReducer, EmptyAnswersArray())

  function convertWordToNumber(word: string): number {
    return Number(wordsToNumbers(word))
  }

  function performNewProblemRequest() {
    if (appReady) {
      console.log('App Ready - Requesting New Problem')
      requestProblem().then(response => {
        setProblem(response)
      })
    } else {
      console.log('App NOT Ready - Clearing Answers From State')
      setProblem(emptyProblem)
    }
  }

  function performCalculationRequests() {
    if (problem.key1 === '' || problem.key2 === '') {
      dispatch({type: AnswerStateActionType.CLEAR})
      return // Blank Problems Have No Answers
    }

    const key1 = convertWordToNumber(problem.key1)
    const key2 = convertWordToNumber(problem.key2)

    console.log('Chaining calculation calls...', key1, key2)
    async function performCalculationCallChain(key1:number, key2:number) {
      // Wait for each calculation to complete before hammering api with more
      await dispatchNewCalculation({id: 0, num1: key1, num2: key2, operation: OperationEnum.ADD, result: null})
      console.log('Calculating Addition Complete')
      await dispatchNewCalculation({id: 1, num1: key1, num2: key2, operation: OperationEnum.SUBTRACT, result: null})
      console.log('Calculation Subtraction Complete')
      await dispatchNewCalculation({id: 2, num1: key1, num2: key2, operation: OperationEnum.MULTIPLY, result: null})
      console.log('Calculation Multiplication Complete')
      await dispatchNewCalculation({id: 3, num1: key1, num2: key2, operation: OperationEnum.DIVIDE, result: null})
      console.log('Calculation Division Complete')
    }

    performCalculationCallChain(key1, key2)
  }

  function dispatchNewCalculation(answer: Answer): Promise<number> {
    return new Promise((resolve, reject) => {
      dispatch({...answer, type: AnswerStateActionType.ADD})
      requestCalculation({
        num1: answer.num1,
        num2: answer.num2,
        operation: answer.operation
      }).then((response) => {
        dispatch({...answer, type: AnswerStateActionType.ANSWER, result: response.result})
        resolve(response.result)
      })
    })
  }

  useEffect(performNewProblemRequest, [appReady])   // Attach Hook - ask for problem when app is ready
  useEffect(performCalculationRequests, [problem])  // Attach Hook - ask for calculations when problem is ready

  useEffect(() => {
    console.log("useEffect executed (component mounted)")
    setAppReady(true)
    return () => {
      console.log("useEffect cleanup (component unmounted)")
      setAppReady(false)
    }
  }, [])

  return (
    <div className="App">
      <AnswerContext.Provider value={ answers }>
        <AnswerDispatchContext.Provider value={ dispatch }>
          <AnswerList />
        </AnswerDispatchContext.Provider>
      </AnswerContext.Provider>
    </div>
  );
}

function answerReducer(answers: Answer[], action: AnswerStateAction): Answer[] {
  console.log('Answer Reducer', answers, action)
  if (action.type === AnswerStateActionType.ADD && action.id !== undefined &&
      action.num1 !== undefined && action.num2 !== undefined && action.operation !== undefined) {
    answers = answers.filter((a): boolean => {
      return a.id !== action.id
    })
    answers.push({
      id: action.id,
      num1: action.num1,
      num2: action.num2,
      operation: action.operation,
      result: action.result || null
    })
    return answers
  } else if (action.type === AnswerStateActionType.ADD) {
    throw new Error('Invalid Answer Addition Missing Parameters')
  } else if (action.type === AnswerStateActionType.ANSWER) {
    return answers.map((a): Answer => {
      if (a.id === action.id) {
        a.result = action.result || null
      }

      return a
    })
  } else if (action.type === AnswerStateActionType.DELETE && action.id !== undefined) {
    return answers.filter((a): boolean => {
      return a.id !== action.id
    })
  } else if (action.type === AnswerStateActionType.DELETE) {
    throw new Error('Invalid Answer Delete Missing Parameters')
  } else if (action.type === AnswerStateActionType.CLEAR) {
    return EmptyAnswersArray()
  } else {
    throw new Error('Invalid Answer Reducer Action')
  }
}

export default App;
