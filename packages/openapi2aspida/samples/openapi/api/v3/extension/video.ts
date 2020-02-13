/* eslint-disable */
import * as Types from '../../../@types'

export interface Methods {
  post: {
    reqHeaders?: Types.AppIdHeader & Types.AppPlatformHeader & Types.AppVersionHeader & Types.AppOrganisationToken

    resBody: {
      id: string
      width?: number
      height?: number
    }

    reqFormat: FormData

    reqBody?: {
      file: ArrayBuffer
    }
  }
}
