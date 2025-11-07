import React from 'react'
import { useRef } from 'react';
import { publishNewEntity } from '../API/gameServer';
import '../../styles/forms.css';

export default function NewCharacterDialog({dialogID}: props) {
    const nameRef = useRef<HTMLInputElement>(null);
    const hpRef = useRef<HTMLInputElement>(null);
    const mpRef = useRef<HTMLInputElement>(null);
    const epRef = useRef<HTMLInputElement>(null);
    const imgSourceRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const isClockRef = useRef<HTMLInputElement>(null);

    return (
        <dialog id = {dialogID}>
            <form onSubmit = {handleSubmit} className = 'entity-form'>
                <InputWithLabel labelText = 'Name' inputRef = {nameRef} typeString = 'text'/>
                <InputWithLabel labelText = 'HP' inputRef = {hpRef} typeString = 'number'/>
                <InputWithLabel labelText = 'MP' inputRef = {mpRef} typeString = 'number'/>
                <InputWithLabel labelText = 'EP' inputRef = {epRef} typeString = 'number'/>
                <InputWithLabel labelText = 'Image URL' inputRef = {imgSourceRef} typeString = 'text'/>
                <InputWithLabel labelText = 'Clock?' inputRef = {isClockRef} typeString = 'text'/>
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
        if (!isClockRef.current) return;
        const newAssetType = isClockRef.current.value.includes('yes')? 'clock' : 'entity';
        publishNewEntity(nameRef.current?.value, hpRef.current?.value, mpRef.current?.value, epRef.current?.value, selectRef.current?.value, imgSourceRef.current?.value, newAssetType);
        closeDialog();
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