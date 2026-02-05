import { useFreelaContext } from "../hooks/useFreelaContext";

type MetaCardProps = {
  id: number;
  titulo: string;
  valorAlvo: number;
};

export function MetaCard({ id, titulo, valorAlvo }: MetaCardProps) {
  const { deletarMeta, mediaMensal } = useFreelaContext();
  
  const porcentagem = Math.min((mediaMensal / valorAlvo) * 100, 100);

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
          {titulo}
        </h2>
        <button
          onClick={() => deletarMeta(id)}
          className="text-red-500 text-xs hover:underline"
        >
          Deletar
        </button>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">
          R$ {mediaMensal.toFixed(2)}
        </span>
        <span className="text-zinc-500 text-sm">
          de R$ {valorAlvo.toLocaleString('pt-BR')}
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="mt-6 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${porcentagem}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-zinc-500 text-right">
        {porcentagem.toFixed(1)}% concluído
      </p>
    </div>
  );
}