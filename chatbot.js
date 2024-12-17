import axios from "axios";

const bot = {
  data: {},
  set: function (key, value) {
    this.data[key] = value;
  },
  get: function (key) {
    return this.data[key];
  },
  return: () => {
    return;
  },
  api_error: (err, msg) => {
    return console.error(err, msg);
  },
};

bot.set("nome_lead", "João Silva");
bot.set("email_lead", "joao.silva+teste@example.com"); // Use "+" para evitar conflitos no RD Station
bot.set("telefone_lead", "11912345678");
bot.set("empresa_lead", "Empresa Fictícia LTDA");
bot.set("cargo_lead", "Gerente de Projetos");

bot.set("api_token", `66d5b2fdac34290014adb5d6`);
async function criarLead() {
  const rdToken = bot.get("api_token"); // Token do RD Station
  const leadData = {
    contact: {
      emails: [{ email: bot.get("email_lead") }],
      name: bot.get("nome_lead"),
      phones: [{ phone: bot.get("telefone_lead"), type: "home" }],
    },
  };

  const options = {
    url: `https://crm.rdstation.com/api/v1/contacts?token=${rdToken}`,
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

// Função principal para execução
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
