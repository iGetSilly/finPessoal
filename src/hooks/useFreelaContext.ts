import { useContext } from "react";
import { FreelaContext } from "../contexts/FreelaContext";

export function useFreelaContext() {
  const context = useContext(FreelaContext);
  
  if (context === undefined) {
    throw new Error("useFreelaContext deve ser usado dentro de FreelaProvider");
  }
  
  return context;
}