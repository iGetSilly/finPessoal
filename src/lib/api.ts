import { supabase } from "./supabase";
import type { Freela } from "../types/Freela";
import type { Meta } from "../types/Meta";
import type { Gasto } from "../types/Gasto";

// ==================== FREELAS ====================

export async function getFreelas(userId: string): Promise<Freela[]> {
  const { data, error } = await supabase
    .from("freelas")
    .select("*")
    .eq("user_id", userId)
    .order("data", { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.id,
    data: item.data,
    valorBruto: Number(item.valor_bruto),
    transportePublico: Number(item.transporte_publico),
    transporteUber: Number(item.transporte_uber),
    totalLiquido: Number(item.total_liquido),
    user_id: item.user_id,
  }));
}

export async function addFreela(userId: string, freela: Omit<Freela, "id">): Promise<Freela> {
  const { data, error } = await supabase
    .from("freelas")
    .insert({
      user_id: userId,
      data: freela.data,
      valor_bruto: freela.valorBruto,
      transporte_publico: freela.transportePublico,
      transporte_uber: freela.transporteUber,
      total_liquido: freela.totalLiquido,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    data: data.data,
    valorBruto: Number(data.valor_bruto),
    transportePublico: Number(data.transporte_publico),
    transporteUber: Number(data.transporte_uber),
    totalLiquido: Number(data.total_liquido),
    user_id: data.user_id,
  };
}

export async function updateFreela(id: number, freela: Freela): Promise<void> {
  const { error } = await supabase
    .from("freelas")
    .update({
      data: freela.data,
      valor_bruto: freela.valorBruto,
      transporte_publico: freela.transportePublico,
      transporte_uber: freela.transporteUber,
      total_liquido: freela.totalLiquido,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteFreela(id: number): Promise<void> {
  const { error } = await supabase.from("freelas").delete().eq("id", id);
  if (error) throw error;
}

// ==================== METAS ====================

export async function getMetas(userId: string): Promise<Meta[]> {
  const { data, error } = await supabase
    .from("metas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.id,
    titulo: item.titulo,
    valorAlvo: Number(item.valor_alvo),
    user_id: item.user_id,
  }));
}

export async function addMeta(userId: string, meta: Omit<Meta, "id">): Promise<Meta> {
  const { data, error } = await supabase
    .from("metas")
    .insert({
      user_id: userId,
      titulo: meta.titulo,
      valor_alvo: meta.valorAlvo,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    titulo: data.titulo,
    valorAlvo: Number(data.valor_alvo),
    user_id: data.user_id,
  };
}

export async function deleteMeta(id: number): Promise<void> {
  const { error } = await supabase.from("metas").delete().eq("id", id);
  if (error) throw error;
}

// ==================== GASTOS ====================

export async function getGastos(userId: string): Promise<Gasto[]> {
  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.id,
    nome: item.nome,
    valor: Number(item.valor),
    user_id: item.user_id,
  }));
}

export async function addGasto(userId: string, gasto: Omit<Gasto, "id">): Promise<Gasto> {
  const { data, error } = await supabase
    .from("gastos")
    .insert({
      user_id: userId,
      nome: gasto.nome,
      valor: gasto.valor,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nome: data.nome,
    valor: Number(data.valor),
    user_id: data.user_id,
  };
}

export async function deleteGasto(id: number): Promise<void> {
  const { error } = await supabase.from("gastos").delete().eq("id", id);
  if (error) throw error;
}