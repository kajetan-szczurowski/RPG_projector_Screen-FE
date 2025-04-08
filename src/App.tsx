import GlobalState from './GlobalState';
import { SocketProvider } from './SocketProvider';
import Index from './components/Index';
import { ContextMenuProvider } from './components/ContextMenuProvider';

function App() {
  return (
      <SocketProvider>
        <GlobalState />
        <ContextMenuProvider>
          <Index />
        </ContextMenuProvider>
      </SocketProvider>
  )



}



export default App