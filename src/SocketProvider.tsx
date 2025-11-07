import { createContext, useContext } from "react";
import {getSocketServerUrl} from "../secret/constant";

// export const socket: Socket = io(getSocketServerUrl());
export const socket = new WebSocket(getSocketServerUrl());

socket.onopen = () => {console.log('Socket opened')};
socket.onclose = () => {alert('Connection lost, refresh the page')};

const SocketContext = createContext(socket);

export function useSocket(){
    return useContext(SocketContext);
}

export function socketEmit(header: string, content: string){
    socket.send(JSON.stringify({head: header, text: content}));
}


export function SocketProvider({children}: any){
    return(
        <SocketContext.Provider value = {socket}>
            {children}
        </SocketContext.Provider>
    )
}