import { useState, useEffect } from 'react'
import { MainStateType } from '../types';
import Entity from './Entity';
import { useSocket } from '../SocketProvider';
import "../styles/main.css";
import { usersDataState } from '../GlobalState';
import GM_Tools from './GM_Tools';
import { useContextMenu, openContextMenu, closeContextMenu } from './ContextMenuProvider';
import { getMainContextMenu } from '../gmToolSet';
import GlobalDialogsWrapper from './GlobalDIalogs/GlobalDialogsWrapper';

export default function MainWindow() {
    const setContextOptions = useContextMenu();
    const socket = useSocket();
    useEffect(() => {socket.emit('get-full-state')}, []);
    const [entities, setEntities] = useState<MainStateType>({allies: [], foes: []});
    socket.on('entities-state', newState => setEntities(newState));
    socket.on('hello', () => {console.log('pinged by the server.')})
    const isGM = usersDataState.value.isGM;
    const userID = usersDataState.value.userID;
    socket.on('reconnect-order', () => {socket.emit('reconnecting-attempt', userID)});
    return(
      //TODO: pack to component to not reapet code
      <>
        <main onContextMenu = { handleRightClick } onClick = { handleClick }>
          <section className = 'entities-wrapper'>
            {entities.allies.map(ent => <Entity entityData={ent} key = {ent.id}/>)}
          </section>
          <section className = 'entities-wrapper'>
            {entities.foes.map(ent => <Entity entityData={ent} key = {ent.id}/>)}
          </section>
        </main>
        {isGM && <GlobalDialogsWrapper/>}
        {isGM && <GM_Tools/>}
      </>
    )

    function handleRightClick(e: React.MouseEvent){
      if (!isGM) return;
      e.preventDefault();
      setContextOptions(getMainContextMenu());
      openContextMenu(e.pageX, e.pageY);
  }

  function handleClick(){
    closeContextMenu();
  }
}
