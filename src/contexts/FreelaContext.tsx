import { createContext } from "react";
import type { Freela } from "../types/Freela";
import type { Meta } from "../types/Meta";
import type { Gasto } from "../types/Gasto";  // NOVO

export type FreelaContextType = {
  listaFreelas: Freela[];
  adicionarFreela: (freela: Freela) => void;
  atualizarFreela: (id: number, freelaAtualizada: Freela) => void;
  deletarFreela: (id: number) => void;
  
  paginaAtiva: "freelas" | "metas" | "gastos";  // ATUALIZADO
  mudarPagina: (pagina: "freelas" | "metas" | "gastos") => void;

  listaMetas: Meta[];
  adicionarMeta: (meta: Meta) => void;
  deletarMeta: (id: number) => void;
  
  saldoTotal: number;
  saldoMensal: number;
  
  // NOVO: Gastos
  listaGastos: Gasto[];
  adicionarGasto: (gasto: Gasto) => void;
  deletarGasto: (id: number) => void;
  mediaLiquidaPorDia: number;  // Para calcular dias necessários
};

export const FreelaContext = createContext<FreelaContextType | undefined>(undefined);