import { useFreelaContext } from "../hooks/useFreelaContext";

export function Navegacao() {
  const { paginaAtiva, mudarPagina } = useFreelaContext();

  return (
    <nav className="flex gap-4 mb-6">
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
        onClick={() => mudarPagina("freelas")}
        className={`px-6 py-3 rounded-xl font-bold transition-all ${
          paginaAtiva === "freelas"
            ? "bg-emerald-600 text-white"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
        }`}
      >
        📅 Freelas
      </button>
    </nav>
  );
}