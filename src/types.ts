export interface ConfigParams {
  projectName: string
  useStorage: boolean
  msgFrequency: number
  autosaveInterval: number
}

export interface LoginResult {
  loginStatus: boolean
  email?: string
}
