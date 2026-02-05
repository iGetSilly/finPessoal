import { AuthProvider } from "./providers/AuthProvider";
import { FreelaProvider } from "./providers/FreelaProvider";
import { useAuth } from "./hooks/useAuth";
import { useFreelaContext } from "./hooks/useFreelaContext";
import { Navegacao } from "./components/Navegacao";
import { FreelaManager } from "./components/FreelaManager";
import { Metas } from "./components/Metas";
import { Gastos } from "./components/Gastos";
import { Login } from "./components/Login";

function AppContent() {
  const { paginaAtiva } = useFreelaContext();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-4xl mt-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-bold">💰 Freela Manager</h1>
          <button
            onClick={signOut}
            className="text-zinc-400 hover:text-white text-sm"
          >
            Sair
          </button>
        </div>

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
    <AuthProvider>
      <FreelaProvider>
        <AppContent />
      </FreelaProvider>
    </AuthProvider>
  );
}

export default App;