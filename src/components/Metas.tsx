import { useState } from "react";
import { useFreelaContext } from "../hooks/useFreelaContext";
import { MetaCard } from "./MetaCard";

export function Metas() {
  const { listaMetas, adicionarMeta } = useFreelaContext();
  
  const [titulo, setTitulo] = useState("");
  const [valorAlvo, setValorAlvo] = useState(20000);

  const salvarMeta = () => {
    if (!titulo) return alert("Coloque um título para a meta");
    if (valorAlvo <= 0) return alert("Valor da meta deve ser maior que zero");

    const novaMeta = {
      id: Date.now(),
      titulo,
      valorAlvo,
    };

    adicionarMeta(novaMeta);

    // Resetar campos
    setTitulo("");
    setValorAlvo(20000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      {/* CARD DE CADASTRO DE META */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-4">
          🎯 Criar Nova Meta
        </h3>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 text-xs">Título da Meta</label>
            <input
              type="text"
              placeholder="Ex: Meta Mensal, Meta anual..."
              value={titulo}
              className="bg-zinc-800 p-2 rounded border border-zinc-700 text-white"
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 text-xs">Valor Alvo (R$)</label>
            <input
              type="number"
              value={valorAlvo}
              className="bg-zinc-800 p-2 rounded border border-zinc-700 text-white"
              onChange={(e) => setValorAlvo(Number(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={salvarMeta}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all"
        >
          Criar Meta
        </button>
      </div>

      {/* LISTA DE METAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listaMetas.length === 0 ? (
          <p className="text-zinc-500 text-center col-span-2">
            Nenhuma meta cadastrada ainda. Crie sua primeira meta acima! 🎯
          </p>
        ) : (
          listaMetas.map((meta) => (
            <MetaCard
              key={meta.id}
              id={meta.id}
              titulo={meta.titulo}
              valorAlvo={meta.valorAlvo}
            />
          ))
        )}
      </div>
    </div>
  );
}