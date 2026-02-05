import { FreelaProvider } from "./providers/FreelaProvider";
import { useFreelaContext } from "./hooks/useFreelaContext";
import { Navegacao } from "./components/Navegacao";
import { FreelaManager } from "./components/FreelaManager";
import { Metas } from "./components/Metas";
import { Gastos } from "./components/Gastos";

function AppContent() {
  const { paginaAtiva } = useFreelaContext();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mt-8 mb-8">
        <Navegacao />
        
        {paginaAtiva === "freelas" && <FreelaManager />}
        {paginaAtiva === "metas" && <Metas />}
        {paginaAtiva === "gastos" && <Gastos />}
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