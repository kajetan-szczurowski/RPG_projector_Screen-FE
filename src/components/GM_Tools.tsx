import '../styles/tools.css'
import { useSocket } from '../SocketProvider';
import { useRef } from 'react';
import { usersDataState } from '../GlobalState';
export default function GM_Tools() {
    const socket = useSocket();
    const terminalRef = useRef<HTMLInputElement>(null);
    const userID = usersDataState.value.userID;
    return(
        <div className = 'gm-tools'>
            <form onSubmit={handleTerminalSubmit}>
                <label>GM Terminal</label>
                <input type = 'text' ref = {terminalRef}/>
            </form>
        </div>
    )

    function handleTerminalSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (!terminalRef.current) return;
        socket.emit('terminal-command', {userID: userID, command: terminalRef.current.value})
    }
}
