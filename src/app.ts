import axios from "axios";
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay })
axios.interceptors.request.use(request => {
  console.log(`(${request.method} ${request.url} ${JSON.stringify(request.data)}`)
  return request
})
axios.interceptors.response.use(response => {
  if (response.status !== 200) {
    console.log(`(${response.status})${response.config.url} ${JSON.stringify(response.data)}`)
  }
  return response
})


/// ==============================================================================================================

type AstralObjectType = "POLYANET" | "SPACE" | "COMETH" | "SOLOON"
class AstralObject {
  type?: AstralObjectType
  attributeKey?: string
  attribute?: string
  row: number
  col: number
  value: string
  constructor(raw: string | null, row: number, col: number) {
    this.value = raw ?? "SPACE"
    this.row = row
    this.col = col
    this.parse(this.value)
  }
  private parse(raw: string) {
    // warning: this is done in blind faith
    const words = raw.split("_")
    this.type = words[words.length - 1] as AstralObjectType
    if (words.length > 1) {
      this.attribute = words[0].toLowerCase()
      if (["blue", "red", "purple", "white"].some(v => v === this.attribute)) {
        this.attributeKey = "color"
      }
      if (["up", "down", "left", "right"].some(v => v === this.attribute)) {
        this.attributeKey = "direction"
      }
    }
  }
  equals(o: AstralObject): boolean {
    return this.value === o.value && this.row === o.row && this.col === o.col
  }
}

interface MapAction {
  actionType: "delete" | "set"
  object: AstralObject
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
    const rawState = [[{ "type": 2, "direction": "up" }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]]
    const resetState = rawState.map(r => r.map(c => c ? "ALREADYSET" : c))
    return Promise.resolve(MegaverseMap.fromRaw(resetState))
  }
  getMapGoal(): Promise<MegaverseMap> {
    const rawState: Array<Array<string>> = [["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "WHITE_SOLOON", "POLYANET", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "BLUE_SOLOON", "POLYANET", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH"], ["SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "WHITE_SOLOON", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "RED_SOLOON", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "WHITE_SOLOON", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "BLUE_SOLOON", "POLYANET", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "RED_SOLOON", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE"], ["SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "PURPLE_SOLOON", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "BLUE_SOLOON", "POLYANET", "POLYANET", "SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "POLYANET", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "DOWN_COMETH", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "WHITE_SOLOON", "POLYANET", "POLYANET", "SPACE", "POLYANET", "SPACE", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "LEFT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "POLYANET", "POLYANET", "WHITE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "PURPLE_SOLOON", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "RED_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "WHITE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["RIGHT_COMETH", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "RED_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "WHITE_SOLOON", "POLYANET", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "RED_SOLOON", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "POLYANET", "RED_SOLOON", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE"], ["SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"], ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"]]
    return Promise.resolve(MegaverseMap.fromRaw(rawState))
  }
  set(action: MapAction): Promise<void> {
    const obj = action.object
    const attr = obj.attributeKey ? `(${obj.attributeKey}=${obj.attribute})` : ""
    console.log(`${action.actionType} (${obj.row}, ${obj.col}) to ${obj.type} ${attr}`)
    return Promise.resolve()
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

type MapContent = {
  type: number,
  direction?: string,
  color?: string
}

type MapResponse = {
  map: {
    _id: string,
    content: Array<Array<MapContent | null>>,
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
    const resetState = rawState.map(r => r.map(c => c ? "ALREADYSET" : c))
    return MegaverseMap.fromRaw(resetState)
  }
  async getMapGoal() {
    const response = await axios.get<GoalResponse>(this.endpoints.mapGoal)
    const rawState = response.data.goal
    return MegaverseMap.fromRaw(rawState)
  }
  async set(action: MapAction): Promise<void> {
    const obj = action.object
    if (!obj.type) { return Promise.resolve() }
    const endpoint = this.astralObjectEndpoint(obj.type)
    const axiosOp = function () {
      switch (action.actionType) {
        case "delete": return axios.delete
        case "set": return axios.post
      }
    }()
    const attr = obj.attributeKey ? { [obj.attributeKey]: obj.attribute } : {}
    await axiosOp<AstralObjectSetResponse>(endpoint, {
      ...attr,
      row: obj.row,
      column: obj.col,
      candidateId: this.candidateId,
    }).then(r => console.log(r.status)).catch(err => console.error(err))
  }

}

/// ==============================================================================================================
/// ==============================================================================================================

class MegaverseMap {
  rows: number
  cols: number
  length: number
  _map: Array<Array<AstralObject>>
  constructor(objects: Array<Array<AstralObject>>) {
    this.rows = objects.length
    this.cols = objects[0].length
    this.length = this.rows * this.cols
    this._map = objects // todo flatten it
  }

  static fromRaw(raw: Array<Array<string | null>>): MegaverseMap {
    const objects = raw.map((r, ri) => r.map((c, ci) => new AstralObject(c, ri, ci)))
    return new MegaverseMap(objects)
  }

  get(row: number, col: number): AstralObject { return this._map[row][col] }

  *iterator(): Generator<AstralObject> {
    for (const row of this._map) {
      for (const cell of row) {
        yield cell
      }
    }
  }

  map<T>(f: (o: AstralObject, row: number, col: number) => T): Array<T> {
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

  flatMap<T>(f: (o: AstralObject, row: number, col: number) => Array<T>): Array<T> {
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
    const instance = new MegaverseController(new MegaverseLocalApi())
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
    const promises = this.mapGoal.flatMap((goal, row, col) => {
      const curr = this.mapCurrent.get(row, col)
      const actions = this.generateAction(row, col, curr, goal)
      return actions.map(action => this.api.set(action))
    })
    // chain instead of firing all at once
    if (promises.length) {
      await promises.reduce((acc, p) => acc.then(_ => p), Promise.resolve())
      return false
    }
    else {
      return true
    }
  }

  generateAction(row: number, col: number, from: AstralObject, to: AstralObject): Array<MapAction> {
    const actions = Array<MapAction>()
    if (from.type !== "SPACE" && !to.equals(from)) {
      // hack: skip if "ALREADYSET"
      if (from.type?.toString() !== "ALREADYSET") {
        actions.push({
          actionType: "delete",
          object: from
        })
      }
    }
    if (to.type !== "SPACE") {
      // hack: skip if "ALREADYSET"
      if (from.type?.toString() !== "ALREADYSET") {
        actions.push({
          actionType: "set",
          object: to
        })
      }
    }
    return actions
  }
}

/// ==============================================================================================================

console.log("----- Start -----")
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const controller = await MegaverseController.init()
// keep running until there's no more diffs
let result = await controller.solve()
while (!result) {
  result = await controller.solve()
  await delay(1000)
}
console.log("-----  End  -----")
