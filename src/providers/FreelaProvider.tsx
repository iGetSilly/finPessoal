import { useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { Freela } from "../types/Freela";
import type { Meta } from "../types/Meta";
import { FreelaContext } from "../contexts/FreelaContext";

type FreelaProviderProps = {
  children: ReactNode;
};

export function FreelaProvider({ children }: FreelaProviderProps) {
  const [listaFreelas, setListaFreelas] = useState<Freela[]>(() => {
    return JSON.parse(localStorage.getItem("freelas") || "[]");
  });

  const [paginaAtiva, setPaginaAtiva] = useState<"freelas" | "metas">("freelas");

  // Estado de metas
  const [listaMetas, setListaMetas] = useState<Meta[]>(() => {
    return JSON.parse(localStorage.getItem("metas") || "[]");
  });

  // Calcular saldo total automaticamente
  const saldoTotal = useMemo(() => {
    return listaFreelas.reduce((acc, freela) => acc + freela.totalLiquido, 0);
  }, [listaFreelas]);

  useEffect(() => {
    localStorage.setItem("freelas", JSON.stringify(listaFreelas));
  }, [listaFreelas]);

  // Salvar metas no localStorage
  useEffect(() => {
    localStorage.setItem("metas", JSON.stringify(listaMetas));
  }, [listaMetas]);

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

  const mudarPagina = (pagina: "freelas" | "metas") => {
    setPaginaAtiva(pagina);
  };

  //Funções de metas
  const adicionarMeta = (meta: Meta) => {
    setListaMetas((prev) => [meta, ...prev]);
  };

  const deletarMeta = (id: number) => {
    const confirma = window.confirm("Tem certeza que deseja deletar esta meta?");
    if (confirma) {
      setListaMetas((prev) => prev.filter((meta) => meta.id !== id));
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
      }}
    >
      {children}
    </FreelaContext.Provider>
  );
}