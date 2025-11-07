
import { NewEntityRequestData, AssetEditPayload, EntityType } from "../../types";
import { socketEmit } from "../../SocketProvider";

export function publishNewEntity( entityName: string = 'A', healthPoints: string = '2', magicPoints: string = '2', equipmentPoints: string = '2', affillation: string = 'ally', imageURL: string = '', newAssetType: 'entity' | 'clock' = 'entity'){
    const entityAffilation = affillation === 'foe'? 'foe' : 'ally';
    const entityDataPayload = getNewEntityPayload(entityName, healthPoints, magicPoints, equipmentPoints, entityAffilation, imageURL);
    emitNewEntity(entityDataPayload, newAssetType);
}

export function duplicateEntity( entityData: EntityType){
    const entityDataPayload = getNewEntityPayload(entityData.name, String(entityData.healthPoints.maxValue),
     String(entityData.magicPoints.maxValue), String(entityData.equipmentPoints.maxValue), 
     entityData.affiliation, entityData.imgSource);
   
     emitNewEntity(entityDataPayload);
}

function emitNewEntity( dataPayload: NewEntityRequestData, newAssetType: 'entity' | 'clock' = 'entity'){
    const payload = {
            order: 'add',
            assetType: newAssetType,
            newEntityData: dataPayload
    }
    // socket.emit('edit-asset', payload);
    socketEmit('edit-asset', JSON.stringify(payload));
    
}

export function publishObjectStateChange(objectID: string, objectKey:string, newValue: string | boolean, requestedAssetType: 'entity' | 'clock'){

    const payload: AssetEditPayload = {
            order: "update",
            assetType: requestedAssetType,
            id: objectID,
            key: objectKey,
            value: newValue
    }

    // socket.emit('edit-asset', payload);
    socketEmit('edit-asset', JSON.stringify(payload));

}

export function publishObjectDeletion( objectID: string, requestedAssetType: 'entity' | 'clock'){
    const payload = {
        order: "delete",
        assetType: requestedAssetType, 
        id: objectID};

    socketEmit('edit-asset', JSON.stringify(payload));

}



function getNewEntityPayload(entityName: string, healthPoints: string, magicPoints: string, equipmentPoints: string, entityAffilation: 'foe' | 'ally', entityImage: string): NewEntityRequestData{
        return {
            name: entityName,
            hp: healthPoints,
            mp: magicPoints,
            pe: equipmentPoints,
            affilation: entityAffilation,
            imgSource: entityImage
    };
}
