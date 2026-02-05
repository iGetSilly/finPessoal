import "./App.css";
import { Metas } from "./components/Metas";
import { FreelaManager } from "./components/FreelaManager";
import { Navegacao } from "./components/Navegacao";
import { useFreelaContext } from "./hooks/useFreelaContext";
import { FreelaProvider } from "./providers/FreelaProvider";

function AppContent() {
  const { paginaAtiva } = useFreelaContext();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl mt-8">
        <Navegacao />
        
        {paginaAtiva === "freelas" && <FreelaManager />}
        {paginaAtiva === "metas" && <Metas />}
      </div>
    </div>
  );
}

function App() {
  return (
    <FreelaProvider>
      <AppContent />
    </FreelaProvider>
  );
}

export default App;
