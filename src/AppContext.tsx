import { createContext } from 'react'
import { OperationEnum } from './api/Calculate'
import { Answer } from './ui/AnswerList'

export enum AnswerStateActionType {
  ADD,
  ANSWER,
  DELETE,
  CLEAR
}

export interface AnswerStateAction {
  type: AnswerStateActionType,
  id?: number,
  num1?: number,
  num2?: number,
  operation?: OperationEnum,
  result?: number | null
}

export function EmptyAnswersArray(): Answer[] { return [] }

export const AnswerContext = createContext(EmptyAnswersArray())
export const AnswerDispatchContext = createContext((action: AnswerStateAction) => {})
