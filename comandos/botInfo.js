const discord = require("discord.js");

exports.run = (client, message, args) => {
    //Comando de Mostrar quem fez o BOT
    const embedBot = {
      "title": "Informações do BOT",
      "color": 10197915,
      "footer": {
        "text": "Programador do BOT"
      },
      "thumbnail": {
        "url": "https://minotar.net/helm/Gusttavo13/100.png"
      },
      "author": {
        "name": "📃Criador do BOT📃"
      },
      "fields": [
        {
          "name": "📃Nick",
          "value": `Gusttavo13`
        },
        {
          "name": "📃Nick no Discord",
          "value": "Gusttavo13#0123"
        },
        {
          "name": "📃Criado em",
          "value": "27/07/2019"
        }
        ,
        {
          "name": "📃Linguagens usadas",
          "value": "Javascript, MySQL e Java"
        }
      ]
    };
    message.channel.send({ embed: embedBot });
  }
exports.help = {
    name: "bot"
}