const express = require("express");
const app = express();

// Permite que a API receba dados no formato JSON
app.use(express.json());

app.post("/calcular-estacionamento", (req, res) => {
  const { entrada, saida } = req.body;

  // Converte as strings de entrada para objetos Date
  const dataEntrada = new Date(entrada);
  const dataSaida = new Date(saida);

  // Validação básica
  if (isNaN(dataEntrada) || isNaN(dataSaida)) {
    return res
      .status(400)
      .json({
        erro: "Por favor, envie datas válidas no formato ISO (ex: 2023-10-27T10:00:00Z).",
      });
  }

  const diferencaMilissegundos = dataSaida - dataEntrada;

  if (diferencaMilissegundos <= 0) {
    return res
      .status(400)
      .json({ erro: "A data de saída deve ser posterior à data de entrada." });
  }

  // Calcula o total em minutos e em seguida arredonda as horas para cima
  const minutosTotais = diferencaMilissegundos / (1000 * 60);
  const horasCobradas = Math.ceil(minutosTotais / 60);

  let valorTotal = 0;

  // Regra de negócio de cobrança
  if (horasCobradas > 0) {
    // R$ 8 pela primeira hora + R$ 5 por cada hora adicional
    valorTotal = 8 + (horasCobradas - 1) * 5;
  }

  // Formata o tempo de permanência para ficar amigável na resposta
  const horasPermanencia = Math.floor(minutosTotais / 60);
  const minutosPermanencia = Math.floor(minutosTotais % 60);

  return res.json({
    entrada: dataEntrada.toISOString(),
    saida: dataSaida.toISOString(),
    tempo_permanencia: `${horasPermanencia}h e ${minutosPermanencia}m`,
    horas_cobradas: horasCobradas,
    valor_a_pagar: `R$ ${valorTotal.toFixed(2)}`,
  });
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API do Estacionamento rodando em http://localhost:${PORT}`);
});
