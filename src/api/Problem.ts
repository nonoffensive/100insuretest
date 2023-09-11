import axios from 'axios'

export interface ProblemRequest {
    // TODO: Implement request parameters when needed
}

export interface ProblemResponse {
    readonly key1: string
    readonly key2: string
}

export function requestProblem(request?: ProblemRequest): Promise<ProblemResponse> {
    return new Promise((resolve, reject) => {
        axios.request({
            method: 'get',
            url: 'https://100insure.com/mi/api1.php'
        }).then(response => {
            resolve(response.data)
        }, (error: object) => {
            // TODO: Handle service errors
            return {
                key1: '',
                key2: ''
            }
        })
    })
}
