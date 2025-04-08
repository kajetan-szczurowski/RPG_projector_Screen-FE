import React, { useState, useRef } from "react";
import MainWindow from "./MainWindow";
import { useSocket } from "../SocketProvider";
import { usersDataState } from "../GlobalState";

import { toogleContextMenu, useContextMenu } from "./ContextMenuProvider";

export default function Index() {
    const setContextOptions = useContextMenu();
    const [logged, setLogged] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const socket = useSocket();
    socket.on('login-result', response => {response? setSuccesfullLogin() : ()=>{}})
    
    return (
        <>
            {!logged && <LoginWindow />}
            {logged && <MainWindow />}
        </>
    )

    function LoginWindow(){
      return(
        <form onSubmit = {handleLoginSubmit} onContextMenu = {handleContext}>
          <label>ID:</label>
          <input type = 'password' ref = {passwordRef}/>
          <button type = 'submit'>Login</button>
          <button onClick = {() => setLogged(true)}>Spectator</button>
        </form>
      )
    }

    function handleContext(e: React.MouseEvent){
      e.preventDefault();
      setContextOptions([{label: 'opcja1', action: () => {console.log('jedynka')}}, {label: 'opcja2', action: () => {console.log('dwojka')}}]);
      toogleContextMenu();
    }

    function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (!passwordRef.current) return;
        socket.emit('login-request', passwordRef.current.value);
    }

    function setSuccesfullLogin(){
        if (!passwordRef.current) return;
        usersDataState.value.isGM = true;
        usersDataState.value.userID = passwordRef.current.value;
        setLogged(true);
    }
}
