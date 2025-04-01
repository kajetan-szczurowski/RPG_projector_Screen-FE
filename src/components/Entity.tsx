import { usersDataState } from "../GlobalState";
import { EntityType } from "../types";
import ProgressBar from "./ProgressBar";
import {useRef} from 'react';
import { useSocket } from "../SocketProvider";
import { getSkullImageUrl } from "../../secret/constant";

import '../styles/entity.css';

export default function Entity({entityData}: props) {
    const socket = useSocket();
    const conditionsDialogRef = useRef<HTMLDialogElement>(null);
    const conditionsTextRef = useRef<HTMLInputElement>(null);
    const skullImageUrl = getSkullImageUrl();
    const isGM = usersDataState.value.isGM;
    const userID = usersDataState.value.userID;
    const HP_Data = {value: entityData.healthPoints.currentValue, maxValue: entityData.healthPoints.maxValue, foregroundClassName: 'HP-bar'};
    const MP_Data = {value: entityData.magicPoints.currentValue, maxValue: entityData.magicPoints.maxValue, foregroundClassName: 'MP-bar'};
    const PE_Data = {value: entityData.equipmentPoints.currentValue, maxValue: entityData.equipmentPoints.maxValue, foregroundClassName: 'PE-bar'};
    const barBackgroundClassName = 'bar-wrapper';
    const barWidthRem = 5;

    const conditionsClassName = `conditions gm-${isGM}`;
    const imgClassNameSuffix = entityData.turnDone? 'turn-done': '';
    const imgClassNamePrefix = `entity-image ${entityData.status}`;
    const imgClassName = `${imgClassNamePrefix} ${imgClassNameSuffix}`;
    const defaultConditions = isGM? 'No conditions' : '';
    const conditionsText = entityData.conditions.length === 0 ? defaultConditions : entityData.conditions;
    
    return(
        <>
            <div className = 'entity-wrapper'>
                <div className = 'image-and-name-wrapper'>
                    <div className = {`image-wrapper ${imgClassName}`}>
                        <img src={entityData.imgSource} className = {imgClassName} onClick={handleImageClick}></img>
                        {entityData.status === 'dead' && <div className = "dead-overlay"/>}
                        {entityData.status === 'dead' && <img src = {skullImageUrl} className = "skull-image"/>}
                    </div>
                    <div className = 'entity-name'>{entityData.name}</div>
                    {isGM && <GM_Tools/>}
                </div>
                <div>
                    <div className = {conditionsClassName} onClick = {handleConditionsClick}>{conditionsText}</div>
                    <ProgressBar {...HP_Data} mainDivClassName={barBackgroundClassName} widthRem={barWidthRem} entityID = {entityData.id} showValues = {entityData.statsVisibleByPlayers}/>
                    <ProgressBar {...MP_Data} mainDivClassName={barBackgroundClassName} widthRem={barWidthRem} entityID = {entityData.id} showValues = {entityData.statsVisibleByPlayers}/>
                    <ProgressBar {...PE_Data} mainDivClassName={barBackgroundClassName} widthRem={barWidthRem} entityID = {entityData.id} showValues = {entityData.statsVisibleByPlayers}/>
                </div>
            </div>
        <ConditionsDialog/>
        </>
    )

    function ConditionsDialog(){
        return(
            <dialog ref = {conditionsDialogRef}>
                <form onSubmit = {handleConditionsSubmit}>
                    <label>Conditions:</label>
                    <input type = 'text' defaultValue = {entityData.conditions} ref = {conditionsTextRef}/>
                </form>
            </dialog>
        )
    }

    function GM_Tools(){
        return(
            <>
                <div>
                    <button onClick = {kill}>K</button>
                    <button onClick = {knockDown}>U</button>
                    <button onClick = {deleteEntity}>D</button>
                    <button onClick = {revive}>A</button>
                    <button onClick = {showStats}>S</button>
                </div>
            </>
        )
    }


    function kill(){
        socket.emit('entiity-set-state', {userID: userID, entityID: entityData.id, newState: 'dead'});
    }

    function knockDown(){
        socket.emit('entiity-set-state', {userID: userID, entityID: entityData.id, newState: 'unconscious'});
    }

    function revive(){
        socket.emit('entiity-set-state', {userID: userID, entityID: entityData.id, newState: 'alive'});
    }

    function showStats(){
        socket.emit('entiity-set-state', {userID: userID, entityID: entityData.id, newState: 'visible-stats'});
    }

    function deleteEntity(){
        socket.emit('delete-entity', {userID: userID, entityID: entityData.id});
    }

    function handleImageClick(){
        if (!isGM) return;
        socket.emit('toogle-turn-done', {userID: userID, entityID: entityData.id});
    }

    function handleConditionsClick(){
        if (!isGM || !conditionsDialogRef.current) return;
        if (conditionsDialogRef.current.open) return;
        conditionsDialogRef.current.showModal();
    }

    function handleConditionsSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (!conditionsTextRef.current) return;
        socket.emit('entiity-edit', {
            userID: userID,
            entityID: entityData.id,
            barType: 'conditions',
            value: conditionsTextRef.current.value
        });
        if (conditionsDialogRef.current?.open) conditionsDialogRef.current.close();
    }

    
}

type props = {
    entityData: EntityType
}

