import { createContext } from "react";
import type { Freela } from "../types/Freela";
import type { Meta } from "../types/Meta";

export type FreelaContextType = {
  listaFreelas: Freela[];
  adicionarFreela: (freela: Freela) => void;
  atualizarFreela: (id: number, freelaAtualizada: Freela) => void;
  deletarFreela: (id: number) => void;

  paginaAtiva: "freelas" | "metas";
  mudarPagina: (pagina: "freelas" | "metas") => void;

  listaMetas: Meta[];
  adicionarMeta: (meta: Meta) => void;
  deletarMeta: (id: number) => void;
  saldoTotal: number;
};

export const FreelaContext = createContext<FreelaContextType | undefined>(undefined);