import axios from "axios";

const bot = {
  data: {},
  set: function (key, value) {
    this.data[key] = value;
  },
  get: function (key) {
    return this.data[key];
  },
  api_error: (err, msg) => {
    return console.error(err, msg);
  },
};
// Simulação do bot para obter os dados do lead

// Configurando os dados do lead
bot.set("client_secret", "4791e80d01ef4a64b54dcf59b9cfb3d6");
bot.set("client_id", "62ef4ccd-d929-4195-be36-ff13f8598406");
bot.set("refresh_token", "ct_aB6jzR1dtGAMUq08TwM21AMUHmcf2a1ar4Wg2dro");
bot.set("nome_lead", "Max Batista");
bot.set("email_lead", "teste9@gmail.com");
bot.set("telefone_lead", "11963561211");
bot.set("identificador_conversao", "Novo_Lead"); // Identificador da conversão

// Definindo o bot

// Função para pegar o token

const getUpdatedToken = async () => {
  const url = "https://api.rd.services/auth/token";
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };

  const data = {
    client_id: bot.get("client_id"),
    client_secret: bot.get("client_secret"),
    refresh_token: bot.get("refresh_token"),
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 200) {
      const token = response.data.access_token;
      console.log("Token atualizado com sucesso:", token);
      return token; // Retorna o token atualizado
    } else {
      bot.api_error(`Erro ao obter token: ${response.status}`);
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Função para pegar os dados do lead e registrar a conversão
const createConversionEvent = async (accessToken) => {
  const leadData = {
    event_type: "CONVERSION",
    event_family: "CDP",
    payload: {
      conversion_identifier: bot.get("identificador_conversao"),
      name: bot.get("nome_lead"),
      email: bot.get("email_lead"),
      personal_phone: bot.get("telefone_lead"),
    },
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.rd.services/platform/events",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(leadData),
  };

  try {
    const response = await axios.request(config);
    console.log("Conversão registrada com sucesso:", response.data);
    return response.data;
  } catch (error) {
    return null;
  }
};

// Fluxo principal - Organizando o código em dois botões
const main = async () => {
  try {
    // Obter token
    const token = await getUpdatedToken();
    if (!token) {
      bot.api_error("Erro: Não foi possível obter o token.");
      return;
    }

    // Agora registrar a conversão usando o token
    await createConversionEvent(token);
  } catch (error) {
    bot.api_error("Erro no fluxo principal:", error.message);
  }
};

// Inicia o processo (aqui é onde o fluxo começa)
main();
