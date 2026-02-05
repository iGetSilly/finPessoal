import { useState, useMemo } from "react";
import { useFreelaContext } from "../hooks/useFreelaContext";

export function Gastos() {
  const {
    listaGastos,
    adicionarGasto,
    deletarGasto,
    saldoTotal,
    mediaLiquidaPorDia,
  } = useFreelaContext();

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState(0);

  // 1. Total a pagar
  const totalAPagar = useMemo(() => {
    return listaGastos.reduce((acc, gasto) => acc + gasto.valor, 0);
  }, [listaGastos]);

  // 2. Dias necessários de freela
  const diasNecessarios = useMemo(() => {
    if (mediaLiquidaPorDia === 0) return 0;
    return Math.ceil(totalAPagar / mediaLiquidaPorDia);
  }, [totalAPagar, mediaLiquidaPorDia]);

  // 3. Total recebido ao trabalhar esses dias
  const totalRecebidoPrevisao = useMemo(() => {
    return diasNecessarios * mediaLiquidaPorDia;
  }, [diasNecessarios, mediaLiquidaPorDia]);

  // 4. Total recebido até o momento (saldo total atual)
  const totalRecebidoAteMomento = saldoTotal;

  // 5. A pagar (total a pagar - total recebido até momento)
  const aPagar = useMemo(() => {
    return Math.max(totalAPagar - totalRecebidoAteMomento, 0);
  }, [totalAPagar, totalRecebidoAteMomento]);

  // 6. Dias restantes
  const diasRestantes = useMemo(() => {
    if (mediaLiquidaPorDia === 0) return 0;
    return Math.ceil(aPagar / mediaLiquidaPorDia);
  }, [aPagar, mediaLiquidaPorDia]);

  // 7. Total recebido nesses dias restantes
  const totalRecebidoDiasRestantes = useMemo(() => {
    return diasRestantes * mediaLiquidaPorDia;
  }, [diasRestantes, mediaLiquidaPorDia]);

  // 8. Resto (quanto vai sobrar)
  const resto = useMemo(() => {
    return Math.max(totalRecebidoDiasRestantes - aPagar, 0);
  }, [totalRecebidoDiasRestantes, aPagar]);

  const salvarGasto = () => {
    if (!nome) return alert("Coloque o nome do gasto");
    if (valor <= 0) return alert("Valor deve ser maior que zero");

    const novoGasto = {
      id: Date.now(),
      nome,
      valor,
    };

    adicionarGasto(novoGasto);

    // Resetar campos
    setNome("");
    setValor(0);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      {/* CARD DE CADASTRO DE GASTO */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-4">💸 Adicionar Gasto</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 text-xs">Nome do Gasto</label>
            <input
              type="text"
              placeholder="Ex: SSD, Notebook, Curso..."
              value={nome}
              className="bg-zinc-800 p-2 rounded border border-zinc-700 text-white"
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 text-xs">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={valor}
              className="bg-zinc-800 p-2 rounded border border-zinc-700 text-white"
              onChange={(e) => setValor(Number(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={salvarGasto}
          className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all"
        >
          Adicionar Gasto
        </button>
      </div>

      {/* PAINEL DE RESUMO */}
      {listaGastos.length > 0 && (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-white font-bold text-xl mb-4">📊 Resumo Financeiro</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Total a Pagar</p>
              <p className="text-red-400 font-bold text-2xl">
                R$ {totalAPagar.toFixed(2)}
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Dias Necessários</p>
              <p className="text-amber-400 font-bold text-2xl">
                {diasNecessarios} dias
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Total a Receber (Previsão)</p>
              <p className="text-blue-400 font-bold text-2xl">
                R$ {totalRecebidoPrevisao.toFixed(2)}
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Total Recebido Até Agora</p>
              <p className="text-emerald-400 font-bold text-2xl">
                R$ {totalRecebidoAteMomento.toFixed(2)}
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Ainda Falta Pagar</p>
              <p className="text-orange-400 font-bold text-2xl">
                R$ {aPagar.toFixed(2)}
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Dias Restantes</p>
              <p className="text-purple-400 font-bold text-2xl">
                {diasRestantes} dias
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Vai Receber nos Dias Restantes</p>
              <p className="text-cyan-400 font-bold text-2xl">
                R$ {totalRecebidoDiasRestantes.toFixed(2)}
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Vai Sobrar</p>
              <p className="text-emerald-400 font-bold text-2xl">
                R$ {resto.toFixed(2)}
              </p>
            </div>

            <div className="bg-zinc-800 p-4 rounded-xl">
              <p className="text-zinc-500 text-xs">Média por Dia de Freela</p>
              <p className="text-zinc-300 font-bold text-2xl">
                R$ {mediaLiquidaPorDia.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LISTA DE GASTOS */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <h3 className="text-white font-bold text-lg mb-4">📝 Lista de Gastos</h3>

        {listaGastos.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">
            Nenhum gasto cadastrado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {listaGastos.map((gasto) => (
              <div
                key={gasto.id}
                className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{gasto.nome}</p>
                  <p className="text-zinc-500 text-sm">
                    R$ {gasto.valor.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => deletarGasto(gasto.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Deletar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}