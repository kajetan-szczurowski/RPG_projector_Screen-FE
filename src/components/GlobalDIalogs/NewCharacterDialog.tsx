import React from 'react'
import { useSocket } from '../../SocketProvider';
import { useRef } from 'react';
import '../../styles/forms.css';

export default function NewCharacterDialog({dialogID}: props) {
    const socket = useSocket();
    const nameRef = useRef<HTMLInputElement>(null);
    const hpRef = useRef<HTMLInputElement>(null);
    const mpRef = useRef<HTMLInputElement>(null);
    const epRef = useRef<HTMLInputElement>(null);
    const imgSourceRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    return (
        <dialog id = {dialogID}>
            <form onSubmit = {handleSubmit} className = 'entity-form'>
                <InputWithLabel labelText = 'Name' inputRef = {nameRef} typeString = 'text'/>
                <InputWithLabel labelText = 'HP' inputRef = {hpRef} typeString = 'number'/>
                <InputWithLabel labelText = 'MP' inputRef = {mpRef} typeString = 'number'/>
                <InputWithLabel labelText = 'EP' inputRef = {epRef} typeString = 'number'/>
                <InputWithLabel labelText = 'Image URL' inputRef = {imgSourceRef} typeString = 'text'/>
                <select ref = {selectRef} className = 'new-form-selection'>
                    <option value = 'ally'>Ally</option>
                    <option value = 'foe'>Foe</option>
                </select>

                <input type="submit" value="Append" className = 'new-form-selection'/>

            </form>
        </dialog>
    )

    function InputWithLabel({labelText, inputRef, typeString}: InputType){
        return (
            <label>
                {labelText}
                <input type= {typeString} ref = {inputRef} />
            </label>
        )
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const newEntity = gatherEntityData();
        socket.emit('add-entity', {...newEntity});
        closeDialog();
    }

    function gatherEntityData(){
        return {
            name: nameRef.current?.value || 'Andrzej',
            hp: hpRef.current?.value || '69',
            mp: mpRef.current?.value || '69',
            pe: epRef.current?.value || '69',
            entityType: selectRef.current?.value || 'ally',
            imgSource: imgSourceRef.current?.value || ''
        }
    }

    function closeDialog(){
        const dialog = document.getElementById(dialogID) as HTMLDialogElement | null;
        if (!dialog) return;
        if (dialog.open) dialog.close();
    }
}

type InputType = {
    labelText: string,
    inputRef: React.RefObject<HTMLInputElement | null>
    typeString: string
}

type props = {
    dialogID: string;
}