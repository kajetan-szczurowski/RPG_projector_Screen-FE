import { ContextMenuStateType } from '../types'
import { createContext, useState, Dispatch, SetStateAction, useContext } from 'react';

export const contextMenuState = createContext<Dispatch<SetStateAction<ContextMenuStateType>>>(()=>{}); 
const dialogID = 'context-menu-dialog';

export function ContextMenuProvider({children}: any){
    const [contextOptions, setContextOptions] = useState<ContextMenuStateType>([]);
    return(
        <contextMenuState.Provider value={setContextOptions}>
            <dialog id = {dialogID}>
                {contextOptions.map(entry => <div>{entry.label}</div>)}
            </dialog>
            {children}
        </contextMenuState.Provider>
)
}

export function useContextMenu(){
    return useContext(contextMenuState);
}

export function toogleContextMenu(){
    const contextDialog = document.getElementById(dialogID) as HTMLDialogElement;
    if (!contextDialog) return;

    if (contextDialog.open) contextDialog.close();
    else contextDialog.show();

}
