export type EntityType = {
    id: string;
    name: string;
    conditions: string,
    healthPoints: CharacterBar,
    magicPoints: CharacterBar,
    equipmentPoints: CharacterBar,
    imgSource: string,
    status: CharacterStatus,
    statsVisibleByPlayers: boolean,
    turnDone?: boolean
}

export type CharacterBar = {
    currentValue: number,
    maxValue: number
}

export type CharacterStatus = 'alive' | 'unconscious' | 'dead';

export type MainStateType = {
  allies: EntityType[],
  foes: EntityType[],
}