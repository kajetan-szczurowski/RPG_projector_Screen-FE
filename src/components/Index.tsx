import React, { useState, useRef } from "react";
import MainWindow from "./MainWindow";
import { useSocket, socketEmit } from "../SocketProvider";
import { usersDataState } from "../GlobalState";


export default function Index() {
    const [logged, setLogged] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const socket = useSocket();
    socket.onmessage = (event) => {handleMessages(event.data)};
    
    return (
        <>
            {!logged && <LoginWindow />}
            {logged && <MainWindow />}
        </>
    )

    function LoginWindow(){
      return(
        <form onSubmit = {handleLoginSubmit}>
          <label>ID:</label>
          <input type = 'password' ref = {passwordRef}/>
          <button type = 'submit'>Login</button>
          <button onClick = {() => setLogged(true)}>Spectator</button>
        </form>
      )
    }

    function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (!passwordRef.current) return;
        // socket.send('login-request', passwordRef.current.value);
        socketEmit('login-request', passwordRef.current.value);

    }

    function setSuccesfullLogin(){
        if (!passwordRef.current) return;
        usersDataState.value.isGM = true;
        usersDataState.value.userID = passwordRef.current.value;
        setLogged(true);
    }

    function handleMessages(message: string){
      const payload = JSON.parse(message);
      if (!('head' in payload)) return;
      if (payload.head !== 'login-result') return;
      const rawResult = payload['text'] ?? '';
      const result = rawResult === 'true'? true : false;
      if (result) setSuccesfullLogin();
    }
}
