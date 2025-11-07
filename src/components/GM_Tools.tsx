import '../styles/tools.css'
import { socketEmit } from '../SocketProvider';
import { useRef } from 'react';
import { usersDataState } from '../GlobalState';
export default function GM_Tools() {
    const terminalRef = useRef<HTMLInputElement>(null);
    const userID = usersDataState.value.userID;
    return(
        <div className = 'gm-tools'>
            <form onSubmit={handleTerminalSubmit}>
                <label>GM Terminal</label>
                <input type = 'text' ref = {terminalRef}/>
            </form>
            <div>
                <button onClick = {undo}>U</button>
                <button onClick = {redo}>R</button>
            </div>
        </div>
    )

    function handleTerminalSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (!terminalRef.current) return;
        socketEmit('terminal-command', JSON.stringify({userID: userID, command: terminalRef.current.value}));
    }

    function undo(){
        console.log('undoing')
        socketEmit('undo', '');

    }

    function redo(){

    }
}
