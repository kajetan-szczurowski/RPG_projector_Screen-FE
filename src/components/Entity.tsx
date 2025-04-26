import { usersDataState } from "../GlobalState";
import { EntityType, ContextMenuStateType } from "../types";
import ProgressBar from "./ProgressBar";
import {useRef, useState} from 'react';
import { useSocket } from "../SocketProvider";
import { getSkullImageUrl } from "../../secret/constant";
import { useContextMenu, openContextMenu } from "./ContextMenuProvider";

import '../styles/entity.css';

export default function Entity({entityData}: props) {
    const setContextOptions = useContextMenu();
    const socket = useSocket();
    const editDialogRef = useRef<HTMLDialogElement>(null);
    const entityEditTextRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [editDialogOption, setEditDialogOption] = useState<'conditions' | 'imgSource' | 'name'>('conditions');
    const skullImageUrl = getSkullImageUrl();
    const isGM = usersDataState.value.isGM;
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
            <div className = 'entity-wrapper' onContextMenu = {handleRightClick} ref = {wrapperRef}>
                <div className = 'image-and-name-wrapper'>
                    <div className = {`image-wrapper ${imgClassName}`}>
                        <img src={entityData.imgSource} className = {imgClassName} onClick={handleImageClick}></img>
                        {entityData.status === 'dead' && <div className = "dead-overlay"/>}
                        {entityData.status === 'dead' && <img src = {skullImageUrl} className = "skull-image"/>}
                    </div>
                    <div className = 'entity-name' onClick = {handleNameClick}>{entityData.name}</div>
                </div>
                <div>
                    <div className = {conditionsClassName} onClick = {handleConditionsClick}>{conditionsText}</div>
                    <ProgressBar {...HP_Data} mainDivClassName={barBackgroundClassName} widthRem={barWidthRem} entityID = {entityData.id} showValues = {entityData.statsVisibleByPlayers}/>
                    <ProgressBar {...MP_Data} mainDivClassName={barBackgroundClassName} widthRem={barWidthRem} entityID = {entityData.id} showValues = {entityData.statsVisibleByPlayers}/>
                    <ProgressBar {...PE_Data} mainDivClassName={barBackgroundClassName} widthRem={barWidthRem} entityID = {entityData.id} showValues = {entityData.statsVisibleByPlayers}/>
                </div>
            </div>
        <EditDialog/>
        </>
    )

    function EditDialog(){
        return(
            <dialog ref = {editDialogRef}>
                <form onSubmit = {handleConditionsSubmit}>
                    <label>{editDialogOption}:</label>
                    <input type = 'text' defaultValue = {entityData.conditions} ref = {entityEditTextRef}/>
                </form>
            </dialog>
        )
    }

    function handleRightClick(e: React.MouseEvent){
        e.preventDefault();
        e.stopPropagation();
        setContextOptions(getContextMenuOptions());
        openContextMenu(e.pageX, e.pageY);
    }


    function getContextMenuOptions(): ContextMenuStateType{
        return[
            {label: 'kill', action: () => setState('dead')},
            {label: 'knock down', action: () => setState('unconscious')},
            {label: 'revive', action: () => setState('alive')},
            {label: 'RESTfull', action: () => performArgumentlessAction('full-rest')},
            {label: 'change image', action: changeImage},
            {label: 'show stats', action: () => setState('visible-stats')},
            {label: 'delete', action: () => performArgumentlessAction('delete-entity')},
            {label: 'duplicate', action: () => performArgumentlessAction('duplicate-entity')},
            {label: 'toogle ally/foe', action: () => {performArgumentlessAction('toogle-affiliation')}}
        ]
    }
    
    function setState(valueToSet: string){socket.emit('entity-set-state', {entityID: entityData.id, newState: valueToSet})};
    function performArgumentlessAction(socketAction: string){socket.emit(socketAction, {entityID: entityData.id})};

    function handleImageClick(){
        if (!isGM) return;
        socket.emit('toogle-turn-done', {entityID: entityData.id});
    }

    function handleConditionsClick(){
        if (!isGM || !editDialogRef.current) return;
        if (editDialogRef.current.open) return;
        setEditDialogOption('conditions');
        editDialogRef.current.showModal();
    }

    function handleNameClick(){
        if (!isGM || !editDialogRef.current) return;
        if (editDialogRef.current.open) return;
        setEditDialogOption('name');
        editDialogRef.current.showModal();
    }

    function changeImage(){
        if (!isGM || !editDialogRef.current) return;
        if (editDialogRef.current.open) return;
        setEditDialogOption('imgSource');
        editDialogRef.current.showModal();
    }

    function handleConditionsSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (!entityEditTextRef.current) return;
        socket.emit('entity-edit', {
            entityID: entityData.id,
            barType: editDialogOption,
            value: entityEditTextRef.current.value
        });
        if (editDialogRef.current?.open) editDialogRef.current.close();
    }

    
}

type props = {
    entityData: EntityType
}

