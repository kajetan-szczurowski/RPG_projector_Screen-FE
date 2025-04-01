import GlobalState from './GlobalState';
import { SocketProvider } from './SocketProvider';
import Index from './components/Index';

function App() {
  return (
      <SocketProvider>
        <GlobalState />
        <Index />
      </SocketProvider>
  )



}



export default App