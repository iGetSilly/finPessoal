import { useFreelaContext } from "../hooks/useFreelaContext";

export function Navegacao() {
  const { paginaAtiva, mudarPagina } = useFreelaContext();

  return (
    <nav className="flex gap-4 mb-6 flex-wrap">
      <button
        onClick={() => mudarPagina("freelas")}
        className={`px-6 py-3 rounded-xl font-bold transition-all ${
          paginaAtiva === "freelas"
            ? "bg-emerald-600 text-white"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
        }`}
      >
        📅 Freelas
      </button>
      
      <button
        onClick={() => mudarPagina("metas")}
        className={`px-6 py-3 rounded-xl font-bold transition-all ${
          paginaAtiva === "metas"
            ? "bg-emerald-600 text-white"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
        }`}
      >
        🎯 Metas
      </button>

      <button
        onClick={() => mudarPagina("gastos")}
        className={`px-6 py-3 rounded-xl font-bold transition-all ${
          paginaAtiva === "gastos"
            ? "bg-emerald-600 text-white"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
        }`}
      >
        💸 Gastos
      </button>
    </nav>
  );
}