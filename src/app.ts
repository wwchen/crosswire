import axios from "axios";
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay })
axios.interceptors.request.use(request => {
  console.log('Starting Request', request.url)
  return request
})

axios.interceptors.response.use(response => {
  console.log('Response:', response.status)
  return response
})


/// ==============================================================================================================

type AstralObjectType = "POLYANET" | "SPACE" | "COMETH" | "SOLOON"

interface MapAction {
  actionType: "delete" | "set"
  objectType: AstralObjectType
  param?: string
  row: number
  col: number
}

/// ==============================================================================================================
/// ==============================================================================================================

interface MegaverseApi {
  getMap(): Promise<MegaverseMap>
  getMapGoal(): Promise<MegaverseMap>
  set(action: MapAction): Promise<void>
}

/// ===============================================================================


class MegaverseLocalApi implements MegaverseApi {
  getMap(): Promise<MegaverseMap> {
    const rawState = [[null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null]]
    const validated: Array<Array<AstralObjectType>> = rawState.map(r => r.map(c => c === null ? "SPACE" : c))
    return new Promise(r => r(new MegaverseMap(validated)))
  }
  getMapGoal(): Promise<MegaverseMap> {
    const rawState: Array<Array<AstralObjectType>> = [['SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'POLYANET', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE'], ['SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE', 'SPACE']]
    return new Promise(r => r(new MegaverseMap(rawState)))
  }
  set(action: MapAction): Promise<void> {
    console.log(`${action.actionType} (${action.row}, ${action.col}) to ${action.objectType}`)
    return new Promise(r => r())
  }
}

/// ===============================================================================

abstract class RestApiConfig {
  baseUrl = "https://challenge.crossmint.io/api"
  candidateId = "52800c2e-cd85-4cba-963c-73f2300ef772"

  endpoints = {
    map: `${this.baseUrl}/map/${this.candidateId}`,
    mapGoal: `${this.baseUrl}/map/${this.candidateId}/goal`,
    validate: `${this.baseUrl}/map/${this.candidateId}/validate`,
    candidates: `${this.baseUrl}/candidates/${this.candidateId}`,
  }

  astralObjectEndpoint(objType: AstralObjectType): string {
    return `${this.baseUrl}/${objType.toLowerCase()}s`
  }
}

type MapResponse = {
  map: {
    _id: string,
    content: Array<Array<AstralObjectType>>,
    candidateId: string,
    phase: number,
    __v: number,
  }
}

type GoalResponse = {
  goal: Array<Array<AstralObjectType>>,
}

type ValidateResponse = {
  solved: boolean
}

type AstralObjectSetRequest = {
  row: number
  column: number
  candidateId: string
}
type AstralObjectSetResponse = {}

class MegaverseRestApi extends RestApiConfig implements MegaverseApi {
  async getMap() {
    const response = await axios.get<MapResponse>(this.endpoints.map)
    const rawState = response.data.map.content
    const validated: Array<Array<AstralObjectType>> = rawState.map(r => r.map(c => c === null ? "SPACE" : c))
    return new MegaverseMap(validated)
  }
  async getMapGoal() {
    const response = await axios.get<GoalResponse>(this.endpoints.mapGoal)
    return new MegaverseMap(response.data.goal)
  }
  async set(action: MapAction): Promise<void> {
    const endpoint = this.astralObjectEndpoint(action.objectType)
    const axiosOp = function () {
      switch (action.actionType) {
        case "delete": return axios.post
        case "set": return axios.post
      }
    }()
    await axiosOp<AstralObjectSetResponse>(endpoint, {
      row: action.row,
      column: action.col,
      candidateId: this.candidateId
    }).catch(err => console.error(err))
  }
}

/// ==============================================================================================================
/// ==============================================================================================================

class MegaverseMap {
  rows: number
  cols: number
  length: number
  _map: Array<Array<AstralObjectType>>
  constructor(rawState: Array<Array<AstralObjectType>>) {
    this.rows = rawState.length
    this.cols = rawState[0].length
    this.length = this.rows * this.cols
    this._map = rawState
  }

  get(row: number, col: number): AstralObjectType { return this._map[row][col] }

  *iterator(): Generator<AstralObjectType> {
    for (const row of this._map) {
      for (const cell of row) {
        yield cell
      }
    }
  }

  map<T>(f: (o: AstralObjectType, row: number, col: number) => T): Array<T> {
    const i = this.iterator()
    let curr = i.next()
    let count = 0
    const collection = Array<T>()
    while (!curr.done) {
      const row = ~~(count / this.cols)
      const col = count % this.cols
      const result = f(curr.value, row, col)
      collection.push(result)
      count += 1
      curr = i.next()
    }
    return collection
  }

  flatMap<T>(f: (o: AstralObjectType, row: number, col: number) => Array<T>): Array<T> {
    return this.map(f).reduce((acc, val) => acc.concat(val))
  }
}


class MegaverseController {
  api: MegaverseApi
  mapCurrent: MegaverseMap
  mapGoal: MegaverseMap
  private constructor(api: MegaverseApi) {
    this.api = api
  }

  static async init() {
    const instance = new MegaverseController(new MegaverseRestApi)
    await instance._init()
    return instance
  }

  private async _init() {
    this.mapCurrent = await this.api.getMap()
    this.mapGoal = await this.api.getMapGoal()
    // assertion check: this.mapCurrent.length === this.mapGoal.length
  }

  async solve() {
    // solve current state -> goal state
    await this.mapGoal.flatMap((goal, row, col) => {
      const curr = this.mapCurrent.get(row, col)
      const actions = this.generateAction(row, col, curr, goal)
      return actions.map(action => this.api.set(action))
    })
  }

  generateAction(row: number, col: number, from: AstralObjectType, to: AstralObjectType): Array<MapAction> {
    const actions = Array<MapAction>()
    if (to !== "SPACE") {
      actions.push({
        actionType: "set",
        objectType: to,
        row: row,
        col: col
      })
    }
    return actions
  }
}

/// ==============================================================================================================

console.log("----- Start -----")
const controller = await MegaverseController.init()
controller.solve()
console.log("-----  End  -----")
