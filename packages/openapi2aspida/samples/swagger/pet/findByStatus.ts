/* eslint-disable */
import * as Types from '../@types'

export interface Methods {
  get: {
    query: {
      status: 'available' | 'pending' | 'sold'[]
    }

    resBody: Types.Pet[]
  }
}
