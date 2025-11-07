
export type EntityType = {
    id: string,
    name: string,
    conditions: string,
    healthPoints: CharacterBar,
    magicPoints: CharacterBar,
    equipmentPoints: CharacterBar,
    imgSource: string,
    status: CharacterStatus,
    statsVisibleByPlayers: boolean,
    affiliation: 'ally' | 'foe',
    turnDone?: boolean
}

export type CharacterBar = {
    currentValue: number,
    maxValue: number
}

export type CharacterStatus = 'alive' | 'unconscious' | 'dead';

export type ClockType = {
  id: string;
  label: string;
  chunks: number;
  completed: number;
}

export type GameState = {
  clocks: ClockType[],
  entities: EntityType[]
}

export type ContextMenuStateType = {label: string, action: Function}[]

export type AssetEditPayload = {
  order: 'add' | 'delete' | 'update',
  assetType: 'entity' | 'clock',
  id: string,
  key: string,
  value: string | boolean,
  barType?: "MP" | "HP" | "PE",
  newEntityData? : NewEntityRequestData
}

export type NewEntityRequestData = {
  name: string;
  hp: string;
  mp: string;
  pe: string;
  imgSource: string;
  affilation: 'ally' | 'foe'
}
