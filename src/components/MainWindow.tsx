import { useState, useEffect } from 'react'
import { MainStateType } from '../types';
import Entity from './Entity';
import NewEntityForm from './NewEntityForm';
import { useSocket } from '../SocketProvider';
import "../styles/main.css";
import { usersDataState } from '../GlobalState';
import GM_Tools from './GM_Tools';

export default function MainWindow() {
    const socket = useSocket();
    useEffect(() => {socket.emit('get-full-state')}, []);
    const [entities, setEntities] = useState<MainStateType>({allies: [], foes: []});
    socket.on('entities-state', newState => setEntities(newState));
    socket.on('hello', () => {console.log('pinged by the server.')})
    const isGM = usersDataState.value.isGM;
    return(
      <>
        <main>
          <section>
            {entities.allies.map(ent => <Entity entityData={ent} key = {ent.id}/>)}
          </section>
          <section>
            {entities.foes.map(ent => <Entity entityData={ent} key = {ent.id}/>)}
          </section>
        </main>
        {isGM && <NewEntityForm/>}
        {isGM && <GM_Tools/>}
      </>
    )
}
