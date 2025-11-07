import { useState, useEffect, useRef } from 'react'
import { GameState, EntityType } from '../types';
import Entity from './Entity';
import Clock from './Clock';
import { useSocket, socketEmit } from '../SocketProvider';
import "../styles/main.css";
import { usersDataState } from '../GlobalState';
import GM_Tools from './GM_Tools';
import { useContextMenu, openContextMenu, closeContextMenu } from './ContextMenuProvider';
import { getMainContextMenu } from '../gmToolSet';
import GlobalDialogsWrapper from './GlobalDIalogs/GlobalDialogsWrapper';

export default function MainWindow() {
    const lastDataTimeStamp = useRef(-1);
    const setContextOptions = useContextMenu();
    const socket = useSocket();
    // useEffect(() => {socket.emit('get-full-state')}, []);
    useEffect(() => {socketEmit('get-full-state', '')}, []);
    useEffect(checkForUpdates, []);
    const [gameState, setGameSate] = useState<GameState>({entities: [], clocks: []});
    console.log(gameState)
    //TODO: socket key from entities state to gameState

    // socket.on('entities-state', newState => setGameSate(newState));
    // socket.on('hello', () => {console.log('pinged by the server.')})
    const isGM = usersDataState.value.isGM;
    const userID = usersDataState.value.userID;
    const POLLING_INTERVAL_MILISECONDS = 3000;

    socket.onmessage = (event) => {handleMessages(event.data)};

    const [allies, foes] = divideEntities(gameState.entities);
    return(
      //TODO: pack to component to not reapet code
      <>
        <main onContextMenu = { handleRightClick } onClick = { handleClick } >
          <section className = 'entities-wrapper'>
            {allies.map(ent => <Entity entityData={ent} key = {ent.id}/>)}
          </section>
          <section>
            {gameState.clocks.map(clock => <Clock clockData={clock}/>)}
          </section>
          <section className = 'entities-wrapper'>
            {foes.map(ent => <Entity entityData={ent} key = {ent.id}/>)}
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

  function divideEntities(entities: EntityType[]){
    const allies : EntityType[] = [];
    const foes : EntityType[] = [];
    entities.map(
      ent => ent.affiliation === 'ally'? allies.push(ent): ent.affiliation === 'foe'? foes.push(ent): console.log('wrong entity'));
    return [allies, foes];
  }

  function handleMessages(message: string){
      const payload = JSON.parse(message);
      if (!('head' in payload && 'text' in payload)) return;
      const content = JSON.parse(payload.text);

      switch(payload.head){
        case 'entities-state': {
          setGameSate(content.state);
          lastDataTimeStamp.current = content.timestamp;
          return;
        }

        case 'hello':{
          console.log('pinged by the server.');
          return;
        }

        case 'reconnect-order': {
          socketEmit('reconnecting-attempt', `${userID}`);
          return;
        }

        case 'edit-time-stamp': {
          if (content == lastDataTimeStamp.current) return;
          socketEmit('get-full-state', '');
          return;
        }

        default: {
          return;
        }
      }
  }

  function checkForUpdates(){
    setInterval(() => socketEmit('get-edit-time-stamp', ''), POLLING_INTERVAL_MILISECONDS);
  }

}
