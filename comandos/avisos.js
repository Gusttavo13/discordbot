const discord = require("discord.js");
const config = require('../config.json')

exports.run = (client, message, args) => {
    var args = message.content.slice(config.cfg.prefix.length).trim().split(/ +/g);
    ///////////////AVISO///////////
    if(!message.member.hasPermission('ADMINISTRATOR')){
      return message.channel.sendMessage(":no_entry: Você não tem permissão para executar esse comando :no_entry:")
    }
    const embedAvisoHelp = {
      "title": `Tipos de Aviso`,
      "color": 65535,
      "footer": {
        "text": "Informações do Aviso"
      },
      "author": {
        "name": "📃Aviso do Thornya📃"
      },
      "fields": [
        {
          "name": "Atualizações :page_with_curl: ",
          "value": "1"
        },
        {
          "name": "Informação :warning:",
          "value": "2"
        },
        {
          "name": "Grave :no_entry:",
          "value": "3"
        },
        {
          "name": "Como usar",
          "value": `${config.cfg.prefix}aviso 1 texto`
        }
      ]
    };

    const canal = client.channels.get(config.aviso.canaldeaviso)
    const canalbotcomandosstaff = client.channels.get(config.aviso.logdeaviso)
    var emojiaviso = ":page_with_curl:"
    var coraviso = "4886754"
    //Check tipo do aviso
    if (args[0] === "1"){
      emojiaviso = ":page_with_curl:"
      coraviso = "4886754"
      nomedoaviso = config.aviso.textatt
    }
    else if(args[0] === "2"){
      emojiaviso = ":warning:"
      coraviso = "16312092"
      nomedoaviso = config.aviso.textinfo
    }
    else if(args[0] === "3"){
      emojiaviso = ":no_entry:"
      coraviso = "16712965"
      nomedoaviso = config.aviso.textgrave
    }
    //
    let splitargs = args.slice(1).join(" ")
    var args = splitargs;
    if (!args.length) return canalbotcomandosstaff.send({ embed: embedAvisoHelp });   
    const embedAviso = {
      "title": `${nomedoaviso} ${emojiaviso}`,
      "color": `${coraviso}`,
      "footer": {
        "icon_url": `${message.author.avatarURL}`,
        "text": `Aviso enviado por ${message.author.username}`
      },
      "author": {
        "name": "📃Aviso do Thornya📃"
      },
      "fields": [
        {
          "name": "Mensagem",
          "value": `${args}`
        }
      ]
    };
    canal.send({ embed: embedAviso });
    message.channel.send("Aviso enviado com Sucesso!");
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.help = {
    name: "aviso"
}