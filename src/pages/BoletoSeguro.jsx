import React, { useState } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

const bancos = {
  "121": "Agibank",
  "657": "Banco BV",
  "614": "Banco BV",
  "422": "Banco Safra"
};

function validarLinhaDigitavel(linha) {
  const limpa = linha.replace(/[^0-9]/g, "");
  if (limpa.length !== 47 && limpa.length !== 48) return { status: "invalid", msg: "Tamanho incorreto" };

  const banco = limpa.substring(0, 3);
  const nomeBanco = bancos[banco] || "Banco não reconhecido";

  const valor = parseFloat(limpa.substring(37, 47)) / 100;
  const vencimentoFator = parseInt(limpa.substring(33, 37));
  const vencimentoBase = new Date(1997, 9, 7);
  const vencimento = new Date(vencimentoBase.getTime() + vencimentoFator * 24 * 60 * 60 * 1000);

  let alerta = null;
  if (!bancos[banco]) alerta = "Banco não reconhecido";
  else if (["657", "614"].includes(banco)) alerta = "Alerta: boletos falsos do BV são comuns. Confirme o beneficiário.";

  return {
    status: "valid",
    banco: nomeBanco,
    valor: valor.toFixed(2),
    vencimento: vencimento.toLocaleDateString(),
    alerta
  };
}

export default function BoletoSeguro() {
  const [linha, setLinha] = useState("");
  const [resultado, setResultado] = useState(null);

  const verificar = () => {
    const res = validarLinhaDigitavel(linha);
    setResultado(res);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">📄 BoletoSeguro</h1>
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-4">
        <input
          type="text"
          className="w-full border rounded-xl px-4 py-2 outline-none"
          placeholder="Cole a linha digitável aqui"
          value={linha}
          onChange={(e) => setLinha(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
          onClick={verificar}
        >
          Verificar Boleto
        </button>

        {resultado && (
          <div className="mt-4 space-y-2">
            {resultado.status === "invalid" && (
              <div className="text-red-600 flex items-center gap-2">
                <AlertCircle size={20} /> {resultado.msg}
              </div>
            )}
            {resultado.status === "valid" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 size={20} /> Banco: <strong>{resultado.banco}</strong>
                </div>
                <div>💰 Valor: <strong>R$ {resultado.valor}</strong></div>
                <div>📅 Vencimento: <strong>{resultado.vencimento}</strong></div>
                {resultado.alerta && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle size={20} /> {resultado.alerta}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}