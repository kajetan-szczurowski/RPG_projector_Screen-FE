import { usersDataState } from "../GlobalState"
import '../styles/progress-bars.css'
import '../styles/entity.css';
import { useSocket } from "../SocketProvider";
import { useRef } from "react";

export default function ProgressBar({value, maxValue, widthRem, mainDivClassName, foregroundClassName, entityID, showValues}: props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const currentValueRef = useRef<HTMLInputElement>(null);
    const socket = useSocket();
    const isGM = usersDataState.value.isGM;
    const userID = usersDataState.value.userID;
    const valueCoefficient = getValueCoefficient(value, maxValue);
    const barTextClassName = `progress-bar-text gm-${isGM}`;
    const textValue = (isGM || showValues)? `${value}/${maxValue}` : '';


    return(
        <div className = {mainDivClassName} onClick = {isGM? handleClick : function(){}}>
            <div style={{'width' : `${widthRem}rem`}} className="progress-bar">
                <div style={{'width' : `${Math.round(valueCoefficient * 100)}%`, }} className={`progress-bar  ${foregroundClassName}`} />
            </div>

            <div className = {barTextClassName}>{textValue}</div>
            <ChangeBarDialog/>
        </div>
    )

    function ChangeBarDialog(){
        return(
            <dialog ref = {dialogRef}>
                <BarForm labelText="current" currentValue={value} callback={sendChangeRequest} typeOfValue = "current" customRef={currentValueRef}/>
                <BarForm labelText="max" currentValue={value} callback={sendChangeRequest} typeOfValue = "max"/>
            </dialog>
        )
    }

    function BarForm({labelText, callback, currentValue, typeOfValue, customRef = undefined}: FormProps){
        const inputRef = customRef ?? useRef<HTMLInputElement>(null);
        return(
            <form onSubmit = {handleSubmit}>
                <label>{labelText}</label>
                <input type = 'number' defaultValue={currentValue} ref = {inputRef}></input>
            </form>
        )

        function handleSubmit(e: React.FormEvent<HTMLFormElement>){
            e.preventDefault();
            callback(typeOfValue, inputRef.current?.value || '');
            if (!dialogRef.current) return;
            if (dialogRef.current.open) dialogRef.current.close();
        }
    }

    function sendChangeRequest(typeOfValue: 'current' | 'max', newValue: string){
        socket.emit('entity-edit', {
            userID: userID,
            entityID: entityID,
            barType: foregroundClassName.replace("-bar", ""),
            valueType: typeOfValue,
            value: newValue
        });
    }

    function handleClick() {
        if (!dialogRef.current) return;
        if (!isGM) return;
        dialogRef.current.showModal();
        currentValueRef.current?.select();
    }

    function getValueCoefficient(value: number, maxValue: number){
        if (value <= 0 || maxValue <= 0) return 0;
        if (value >= maxValue) return 1;
        return value / maxValue;
      }

}

type props = {
    value: number,
    maxValue: number,
    widthRem: number,
    mainDivClassName: string,
    foregroundClassName: string,
    entityID: string,
    showValues: boolean
}

type FormProps = {
    labelText: string,
    callback: Function,
    currentValue: number,
    typeOfValue: 'current' | 'max',
    customRef?: React.RefObject<HTMLInputElement | null>
}