import { useState } from "react";
import { useFreelaContext } from "../hooks/useFreelaContext";
import type { Freela } from "../types/Freela";
import { NumericInput } from "./NumericInput";  // NOVO

export function FreelaManager() {
  const PRECO_PASSAGEM = 5.5;

  const { listaFreelas, adicionarFreela, atualizarFreela, deletarFreela } = useFreelaContext();

  const [editId, setEditId] = useState<number | null>(null);

  const [data, setData] = useState("");
  const [valorFreela, setValorFreela] = useState(130);
  const [qtdPublico, setQtdPublico] = useState(0);
  const [valorUber, setValorUber] = useState(0);

  const custoPublico = qtdPublico * PRECO_PASSAGEM;
  const liquidoNoDia = valorFreela - custoPublico - valorUber;

  const prepararEdicao = (item: Freela) => {
    setEditId(item.id);
    setData(item.data);
    setValorFreela(item.valorBruto);
    setQtdPublico(item.transportePublico / PRECO_PASSAGEM);
    setValorUber(item.transporteUber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const salvarFreela = () => {
    if (!data) return alert("Coloque a data");

    if (editId) {
      const freelaAtualizada: Freela = {
        id: editId,
        data,
        valorBruto: valorFreela,
        transportePublico: custoPublico,
        transporteUber: valorUber,
        totalLiquido: liquidoNoDia,
      };
      atualizarFreela(editId, freelaAtualizada);
      setEditId(null);
    } else {
      const novo: Freela = {
        id: Date.now(),
        data,
        valorBruto: valorFreela,
        transportePublico: custoPublico,
        transporteUber: valorUber,
        totalLiquido: liquidoNoDia,
      };
      adicionarFreela(novo);
    }

    setData("");
    setQtdPublico(0);
    setValorUber(0);
  };

  const saldoTotal = listaFreelas.reduce((total, item) => total + item.totalLiquido, 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-4">
          {editId ? "Editando Diária" : "Configurar Diária"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 text-xs">Data</label>
            <input
              type="date"
              value={data}
              className="bg-zinc-800 p-2 rounded border border-zinc-700 text-white"
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <NumericInput
            label="Valor do Freela (R$)"
            value={valorFreela}
            onChange={setValorFreela}
            min={0}
          />

          <NumericInput
            label="Qtd. Transporte Público"
            value={qtdPublico}
            onChange={setQtdPublico}
            min={0}
            step={1}
          />

          <NumericInput
            label="Valor Uber (R$)"
            value={valorUber}
            onChange={setValorUber}
            min={0}
          />
        </div>

        <div className="mt-6 p-4 bg-zinc-950 rounded-xl border border-dashed border-zinc-700">
          <p className="text-zinc-400 text-sm">
            Resumo do dia:{" "}
            <span className="text-emerald-400 font-bold">
              R$ {liquidoNoDia.toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={salvarFreela}
          className={`w-full mt-4 ${editId ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"} text-white font-bold py-3 rounded-xl transition-all`}
        >
          {editId ? "Salvar Alterações" : "Confirmar e Salvar Dia"}
        </button>
      </div>

      {/* PAINEL FIXO */}
      <div className="sticky top-0 z-10 mb-6 bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-800">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Saldo Líquido Acumulado</p>
            <h2 className="text-3xl font-black text-emerald-400">R$ {saldoTotal.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listaFreelas
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-zinc-500 text-sm font-mono">{item.data}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => prepararEdicao(item)}
                    className="text-emerald-500 text-xs hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deletarFreela(item.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Deletar
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-zinc-500 space-y-1">
                  <p>Bruto: R$ {item.valorBruto.toFixed(2)}</p>
                  <p>🚌 Público: R$ {item.transportePublico.toFixed(2)}</p>
                  <p>🚗 Uber: R$ {item.transporteUber.toFixed(2)}</p>
                </div>
                <span className="text-emerald-400 font-bold">
                  R$ {item.totalLiquido.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}