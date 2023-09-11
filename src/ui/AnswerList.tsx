import { useEffect, useContext, ReactElement } from 'react';
import { AnswerContext } from '../AppContext'
import { OperationEnum } from '../api/Calculate'

export interface Answer {
  id: number
  num1: number
  num2: number
  operation: OperationEnum
  result: number | null
}

export interface AnswerItemProps {
  answer: Answer
}

export function AnswerList() {
  const answers: Answer[] = useContext(AnswerContext);

  useEffect(() => {
    console.log('List Update', answers)
  }, [answers])

  return (
    <div className="answerList">
      {answers.map((a: Answer) => {
        return (
          <div key={ a.id }>
            <AnswerItem answer={ a } />
          </div>)
      })}
    </div>
  );
}

export function AnswerItem(props: AnswerItemProps) {
  function operationSymbol(op: OperationEnum): string {
    return 'op ' + op.replace(' ', '-')
  }

  function displayResultField(result: number | null): ReactElement<any, any> {
    if (result !== null) {
      return (
        <span className="result">{ String(props.answer.result).slice(0,5) }</span>
      )
    } else {
      return (
        <span className="result-pending" />
      )
    }
  }

  return (
    <div className="answer-item">
      <span className="num arg1">{ props.answer.num1 }</span>
      <span className={ operationSymbol(props.answer.operation) }></span>
      <span className="num arg2">{ props.answer.num2 }</span>
      <span className="equals"></span>
      { displayResultField(props.answer.result) }
    </div>
  );
}
