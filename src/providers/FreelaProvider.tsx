import { useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { Freela } from "../types/Freela";
import type { Meta } from "../types/Meta";
import type { Gasto } from "../types/Gasto";
import { FreelaContext } from "../contexts/FreelaContext";

type FreelaProviderProps = {
  children: ReactNode;
};

export function FreelaProvider({ children }: FreelaProviderProps) {
  const [listaFreelas, setListaFreelas] = useState<Freela[]>(() => {
    return JSON.parse(localStorage.getItem("freelas") || "[]");
  });

  const [paginaAtiva, setPaginaAtiva] = useState<"freelas" | "metas" | "gastos">("freelas");

  const [listaMetas, setListaMetas] = useState<Meta[]>(() => {
    return JSON.parse(localStorage.getItem("metas") || "[]");
  });

  // NOVO: Estado de gastos
  const [listaGastos, setListaGastos] = useState<Gasto[]>(() => {
    return JSON.parse(localStorage.getItem("gastos") || "[]");
  });

  // Calcular saldo total
  const saldoTotal = useMemo(() => {
    return listaFreelas.reduce((acc, freela) => acc + freela.totalLiquido, 0);
  }, [listaFreelas]);

  // Calcular saldo mensal (mês atual)
  const saldoMensal = useMemo(() => {
  if (listaFreelas.length === 0) return 0;
  
  // Cria uma lista de strings "AAAA-MM"
  const mesesComAtividade = listaFreelas.map(freela => freela.data.substring(0, 7));
  
  // O Set remove as duplicatas automaticamente
  const quantidadeMeses = new Set(mesesComAtividade).size;
  
  return saldoTotal / (quantidadeMeses || 1); 
}, [listaFreelas, saldoTotal]);

  // Calcular média líquida por dia de freela
  const mediaLiquidaPorDia = useMemo(() => {
    if (listaFreelas.length === 0) return 0;
    return saldoTotal / listaFreelas.length;
  }, [saldoTotal, listaFreelas.length]);

  useEffect(() => {
    localStorage.setItem("freelas", JSON.stringify(listaFreelas));
  }, [listaFreelas]);

  useEffect(() => {
    localStorage.setItem("metas", JSON.stringify(listaMetas));
  }, [listaMetas]);

  // NOVO: Salvar gastos no localStorage
  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(listaGastos));
  }, [listaGastos]);

  const adicionarFreela = (freela: Freela) => {
    setListaFreelas((prev) => [freela, ...prev]);
  };

  const atualizarFreela = (id: number, freelaAtualizada: Freela) => {
    setListaFreelas((prev) =>
      prev.map((freela) => (freela.id === id ? freelaAtualizada : freela))
    );
  };

  const deletarFreela = (id: number) => {
    const confirma = window.confirm("Tem certeza que deseja deletar esta diária?");
    if (confirma) {
      setListaFreelas((prev) => prev.filter((freela) => freela.id !== id));
    }
  };

  const mudarPagina = (pagina: "freelas" | "metas" | "gastos") => {
    setPaginaAtiva(pagina);
  };

  const adicionarMeta = (meta: Meta) => {
    setListaMetas((prev) => [meta, ...prev]);
  };

  const deletarMeta = (id: number) => {
    const confirma = window.confirm("Tem certeza que deseja deletar esta meta?");
    if (confirma) {
      setListaMetas((prev) => prev.filter((meta) => meta.id !== id));
    }
  };

  // NOVO: Funções de gastos
  const adicionarGasto = (gasto: Gasto) => {
    setListaGastos((prev) => [gasto, ...prev]);
  };

  const deletarGasto = (id: number) => {
    const confirma = window.confirm("Tem certeza que deseja deletar este gasto?");
    if (confirma) {
      setListaGastos((prev) => prev.filter((gasto) => gasto.id !== id));
    }
  };

  return (
    <FreelaContext.Provider
      value={{
        listaFreelas,
        adicionarFreela,
        atualizarFreela,
        deletarFreela,
        paginaAtiva,
        mudarPagina,
        listaMetas,
        adicionarMeta,
        deletarMeta,
        saldoTotal,
        saldoMensal,
        listaGastos,         // NOVO
        adicionarGasto,      // NOVO
        deletarGasto,        // NOVO
        mediaLiquidaPorDia,  // NOVO
      }}
    >
      {children}
    </FreelaContext.Provider>
  );
}