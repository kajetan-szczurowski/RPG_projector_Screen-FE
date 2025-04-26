import { ContextMenuStateType } from '../types'
import { createContext, useState, Dispatch, SetStateAction, useContext } from 'react';

export const contextMenuState = createContext<Dispatch<SetStateAction<ContextMenuStateType>>>(()=>{}); 
const dialogID = 'context-menu-dialog';

export function ContextMenuProvider({children}: any){
    const [contextOptions, setContextOptions] = useState<ContextMenuStateType>([]);
    return(
        <contextMenuState.Provider value={setContextOptions}>
            <div id = {dialogID} style = {{'display': 'none'}}>
                {contextOptions.map(entry => <div onClick = {e => handleOptionClick(e, entry.action)}>{entry.label}</div>)}
            </div>
            {children}
        </contextMenuState.Provider>
)

    function handleOptionClick(e:React.MouseEvent, callback: Function){
        e.preventDefault();
        callback();
        closeContextMenu();
    }
}

export function useContextMenu(){
    return useContext(contextMenuState);
}

export function openContextMenu(x: number, y: number){
    const contextDialog = document.getElementById(dialogID);
    if (!contextDialog) return;

    contextDialog.style.top = `${y}px`;
    contextDialog.style.left = `${x}px`;
    contextDialog.style.display = 'block';
}

export function closeContextMenu(){
    const contextDialog = document.getElementById(dialogID);
    if (!contextDialog) return;
    contextDialog.style.display = 'none';
}