import { useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { Freela } from "../types/Freela";
import type { Meta } from "../types/Meta";
import type { Gasto } from "../types/Gasto";
import { FreelaContext } from "../contexts/FreelaContext";
import { useAuth } from "../hooks/useAuth";
import * as api from "../lib/api";

type FreelaProviderProps = {
  children: ReactNode;
};

export function FreelaProvider({ children }: FreelaProviderProps) {
  const { user } = useAuth();
  
  const [listaFreelas, setListaFreelas] = useState<Freela[]>([]);
  const [listaMetas, setListaMetas] = useState<Meta[]>([]);
  const [listaGastos, setListaGastos] = useState<Gasto[]>([]);
  const [paginaAtiva, setPaginaAtiva] = useState<"freelas" | "metas" | "gastos">("freelas");
  const [loading, setLoading] = useState(true);

  // Carregar dados do Supabase quando user logar
  useEffect(() => {
    if (!user) {
      setListaFreelas([]);
      setListaMetas([]);
      setListaGastos([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [freelas, metas, gastos] = await Promise.all([
          api.getFreelas(user.id),
          api.getMetas(user.id),
          api.getGastos(user.id),
        ]);

        setListaFreelas(freelas);
        setListaMetas(metas);
        setListaGastos(gastos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Calcular saldo total
  const saldoTotal = useMemo(() => {
    return listaFreelas.reduce((acc, freela) => acc + freela.totalLiquido, 0);
  }, [listaFreelas]);

  // Calcular média mensal
  const saldoMensal = useMemo(() => {
    if (listaFreelas.length === 0) return 0;

    const mesesComAtividade = listaFreelas.map((f) => f.data.substring(0, 7));
    const quantidadeMeses = new Set(mesesComAtividade).size;

    return saldoTotal / (quantidadeMeses || 1);
  }, [listaFreelas, saldoTotal]);

  // Calcular média líquida por dia
  const mediaLiquidaPorDia = useMemo(() => {
    if (listaFreelas.length === 0) return 0;
    return saldoTotal / listaFreelas.length;
  }, [saldoTotal, listaFreelas.length]);

  // ==================== FREELAS ====================

  const adicionarFreela = async (freela: Freela) => {
    if (!user) return;

    try {
      const novaFreela = await api.addFreela(user.id, freela);
      setListaFreelas((prev) => [novaFreela, ...prev]);
    } catch (error) {
      console.error("Erro ao adicionar freela:", error);
      alert("Erro ao salvar freela");
    }
  };

  const atualizarFreela = async (id: number, freelaAtualizada: Freela) => {
    try {
      await api.updateFreela(id, freelaAtualizada);
      setListaFreelas((prev) =>
        prev.map((freela) => (freela.id === id ? freelaAtualizada : freela))
      );
    } catch (error) {
      console.error("Erro ao atualizar freela:", error);
      alert("Erro ao atualizar freela");
    }
  };

  const deletarFreela = async (id: number) => {
    const confirma = window.confirm("Tem certeza que deseja deletar esta diária?");
    if (!confirma) return;

    try {
      await api.deleteFreela(id);
      setListaFreelas((prev) => prev.filter((freela) => freela.id !== id));
    } catch (error) {
      console.error("Erro ao deletar freela:", error);
      alert("Erro ao deletar freela");
    }
  };

  // ==================== METAS ====================

  const adicionarMeta = async (meta: Meta) => {
    if (!user) return;

    try {
      const novaMeta = await api.addMeta(user.id, meta);
      setListaMetas((prev) => [novaMeta, ...prev]);
    } catch (error) {
      console.error("Erro ao adicionar meta:", error);
      alert("Erro ao salvar meta");
    }
  };

  const deletarMeta = async (id: number) => {
    const confirma = window.confirm("Tem certeza que deseja deletar esta meta?");
    if (!confirma) return;

    try {
      await api.deleteMeta(id);
      setListaMetas((prev) => prev.filter((meta) => meta.id !== id));
    } catch (error) {
      console.error("Erro ao deletar meta:", error);
      alert("Erro ao deletar meta");
    }
  };

  // ==================== GASTOS ====================

  const adicionarGasto = async (gasto: Gasto) => {
    if (!user) return;

    try {
      const novoGasto = await api.addGasto(user.id, gasto);
      setListaGastos((prev) => [novoGasto, ...prev]);
    } catch (error) {
      console.error("Erro ao adicionar gasto:", error);
      alert("Erro ao salvar gasto");
    }
  };

  const deletarGasto = async (id: number) => {
    const confirma = window.confirm("Tem certeza que deseja deletar este gasto?");
    if (!confirma) return;

    try {
      await api.deleteGasto(id);
      setListaGastos((prev) => prev.filter((gasto) => gasto.id !== id));
    } catch (error) {
      console.error("Erro ao deletar gasto:", error);
      alert("Erro ao deletar gasto");
    }
  };

  // ==================== NAVEGAÇÃO ====================

  const mudarPagina = (pagina: "freelas" | "metas" | "gastos") => {
    setPaginaAtiva(pagina);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-white text-xl">Carregando seus dados...</p>
      </div>
    );
  }

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
        listaGastos,
        adicionarGasto,
        deletarGasto,
        mediaLiquidaPorDia,
      }}
    >
      {children}
    </FreelaContext.Provider>
  );
}