const axios = require("axios");

async function renovarToken() {
  const url = "https://api.rd.services/auth/token";
  const data = {
    client_id: "62ef4ccd-d929-4195-be36-ff13f8598406",
    client_secret: "4791e80d01ef4a64b54dcf59b9cfb3d6",
    refresh_token: "ct_aB6jzR1dtGAMUq08TwM21AMUHmcf2a1ar4Wg2dro",
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("Novo token gerado:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao renovar o token:", error.message);
    throw error;
  }
}

async function criarLead() {
  const rdToken = bot.get("refresh_token"); // Token do RD Station
  const leadData = {
    contact: {
      emails: [{ email: bot.get("email_lead") }],
      name: bot.get("nome_lead"),
      phones: [{ phone: bot.get("telefone_lead"), type: "home" }],
    },
  };

  const options = {
    url: `https://api.rd.services/platform/contacts`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: leadData,
  };

  try {
    const response = await axios(options);
    console.log(`Lead criado com sucesso: ${response.data.id}`);
    return response.data;
  } catch (err) {
    // Verificar se o erro é relacionado ao token

    bot.api_error(err, "Erro na API RD Station");

    return null;
  }
}

// Execute a função para renovar o token
renovarToken();

// Dados coletados do chatbot
async function main() {
  try {
    const lead = await criarLead();
    if (lead) {
      bot.set("api_ok", "1");
    } else {
      bot.set("api_ok", "0");
    }
    return "";
  } catch (err) {
    bot.api_error(err, "Erro inesperado na execução.");
  }
}

main();
