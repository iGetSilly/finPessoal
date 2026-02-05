import { useState, useEffect } from "react";

type NumericInputProps = {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

export function NumericInput({
  value,
  onChange,
  label,
  placeholder,
  min = 0,
  max,
  className = "",
}: NumericInputProps) {
  // Estado local para o texto do input
  const [displayValue, setDisplayValue] = useState(value.toString());

  // Atualiza display quando value externo muda
  useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Permite vazio
    if (inputValue === "") {
      setDisplayValue("");
      onChange(0);
      return;
    }

    // Substitui vírgula por ponto
    inputValue = inputValue.replace(",", ".");

    // Remove caracteres inválidos (mantém apenas números, ponto e sinal negativo)
    inputValue = inputValue.replace(/[^0-9.-]/g, "");

    // Remove zeros à esquerda, exceto se for "0." ou apenas "0"
    if (inputValue.startsWith("0") && inputValue.length > 1 && !inputValue.startsWith("0.")) {
      inputValue = inputValue.replace(/^0+/, "");
    }

    // Atualiza o display
    setDisplayValue(inputValue);

    // Converte para número
    const numValue = parseFloat(inputValue);

    // Valida e chama onChange
    if (!isNaN(numValue)) {
      // Aplica limites se definidos
      let finalValue = numValue;
      if (min !== undefined && numValue < min) finalValue = min;
      if (max !== undefined && numValue > max) finalValue = max;

      onChange(finalValue);
    }
  };

  const handleBlur = () => {
    // Ao sair do foco, formata o número
    if (displayValue === "" || displayValue === ".") {
      setDisplayValue("0");
      onChange(0);
    } else {
      const numValue = parseFloat(displayValue);
      if (!isNaN(numValue)) {
        setDisplayValue(numValue.toString());
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-zinc-500 text-xs">{label}</label>}
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`bg-zinc-800 p-2 rounded border border-zinc-700 text-white ${className}`}
      />
    </div>
  );
}