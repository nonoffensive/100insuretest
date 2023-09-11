import axios from 'axios'

export enum OperationEnum {
  ADD = 'plus',
  SUBTRACT = 'minus',
  MULTIPLY = 'times',
  DIVIDE = 'divided by',
}

export interface CalculateRequest {
  num1: number              // First number in calculation
  num2: number              // Second number in calculation
  operation: OperationEnum  // Operation to be performed
}   

export interface CalculateResponse {
  readonly result: number;
}

export function requestCalculation (request: CalculateRequest): Promise<CalculateResponse> {
// TODO: Implement request submission when object is required
// TODO: Handle errors
  return new Promise((resolve, reject) => {
    axios.request({
      method: 'post',
      url: 'https://100insure.com/mi/api2.php',
      data: JSON.stringify(request)
    }).then(response => {
      resolve({
        result: Number(response.data)
      })
    })
  })
}
