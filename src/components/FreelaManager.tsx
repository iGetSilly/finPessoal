import { useEffect, useState } from "react";
import type { Freela } from "../types/Freela";

export function FreelaManager() {
  const PRECO_PASSAGEM = 5.5;

  const [listaFreelas, setListaFreelas] = useState<Freela[]>(() => {
    return JSON.parse(localStorage.getItem("freelas") || "[]");
  });
  // Estado para saber qual card estou editando
  const [editId, setEditId] = useState<number | null>(null);

  // Estados dos Inputs
  const [data, setData] = useState("");
  const [valorFreela, setValorFreela] = useState(130);
  const [qtdPublico, setQtdPublico] = useState(0);
  const [valorUber, setValorUber] = useState(0);

  const custoPublico = qtdPublico * PRECO_PASSAGEM;
  const liquidoNoDia = valorFreela - custoPublico - valorUber;

  useEffect(() => {
    localStorage.setItem("freelas", JSON.stringify(listaFreelas));
  }, [listaFreelas]);

  // Função para carregar os dados do card no formulário
  const prepararEdicao = (item: Freela) => {
    setEditId(item.id);
    setData(item.data);
    setValorFreela(item.valorBruto);
    setQtdPublico(item.transportePublico / PRECO_PASSAGEM);
    setValorUber(item.transporteUber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Opcional: sobe a tela para o formulário
  };

  const deletarFreela = (id: number) => {
    const confirma = window.confirm(
      "Tem certeza que deseja deletar esta diária?",
    );

    if (confirma) {
      setListaFreelas(listaFreelas.filter((freela) => freela.id !== id));
    }
  };

  const salvarFreela = () => {
    if (!data) return alert("Coloque a data");

    if (editId) {
      // Lógica para ATUALIZAR o card existente
      setListaFreelas(
        listaFreelas.map((freela) =>
          freela.id === editId
            ? {
                ...freela,
                data,
                valorBruto: valorFreela,
                transportePublico: custoPublico,
                transporteUber: valorUber,
                totalLiquido: liquidoNoDia,
              }
            : freela,
        ),
      );
      setEditId(null); // Limpa o estado de edição
    } else {
      const novo: Freela = {
        id: Date.now(),
        data,
        valorBruto: valorFreela,
        transportePublico: custoPublico,
        transporteUber: valorUber,
        totalLiquido: liquidoNoDia,
      };
      setListaFreelas([novo, ...listaFreelas]);
    }
    // Resetar campos
    setData("");
    setQtdPublico(0);
    setValorUber(0);
  };

  const saldoTotal = listaFreelas.reduce(
    (acumulador, freela) => acumulador + freela.totalLiquido,
    0,
  );


  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      {/* CARD DE ENTRADA */}
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

          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 text-xs">
              Valor do Freela (R$)
            </label>
            <input
              type="number"
              value={valorFreela}
              className="bg-zinc-800 p-2 rounded border border-zinc-700 text-white"
              onChange={(e) => setValorFreela(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 text-xs">
              Qtd. Transporte Público
            </label>
            <input
              type="number"
              value={qtdPublico}
              className="bg-zinc-800 p-2 rounded border border-zinc-700 text-white"
              onChange={(e) => setQtdPublico(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 text-xs">Valor Uber (R$)</label>
            <input
              type="number"
              value={valorUber}
              className="bg-zinc-800 p-2 rounded border border-zinc-700 text-white"
              onChange={(e) => setValorUber(Number(e.target.value))}
            />
          </div>
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
          className={`w-full mt-4 ${editId ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"} text-white font-bold py-3 rounded-xl transition-all cursor-pointer`}
        >
          {editId ? "Salvar Alterações" : "Confirmar e Salvar Dia"}
        </button>
      </div>

      {/* CARD DO TOTAL LÍQUIDO ADQUIRIDO */}
      <div className="sticky top-0 z-10 mb-6 bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-800">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">
              Saldo Líquido Acumulado
            </p>
            <h2 className="text-3xl font-black text-emerald-400">
              R$ {saldoTotal.toFixed(2)}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-[10px] uppercase font-bold">
              Meta Mensal
            </p>
            <p className="text-sm font-bold text-white tracking-tighter">
              R$ 20.000,00
            </p>
          </div>
        </div>
      </div>

      {/* LISTA DE CARDS DOS DIAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listaFreelas
          .sort(
            (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
          )
          .map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-zinc-500 text-sm font-mono">
                  {item.data}
                </span>
                <button
                  onClick={() => prepararEdicao(item)}
                  className="text-emerald-500 text-xs hover:underline cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => deletarFreela(item.id)}
                  className="flex justify-center items-center px-2 py-0.5 text-xs font-bold text-red-500 border border-red-500/50 rounded-md transition-all hover:bg-red-600 hover:text-white hover:border-red-600 cursor-pointer"
                  title="Excluir permanentemente"
                >
                  X
                </button>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs text-zinc-500 space-y-1">
                  <p>Bruto: R$ {item.valorBruto}</p>
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
