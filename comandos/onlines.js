const discord = require("discord.js");
const config = require('../config.json')
const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit : 10, 
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
  });

exports.run = (client, message, args) => {
    //Command Perfil
    var args = message.content.slice(config.cfg.prefix.length).trim().split(/ +/g);
    var comando = args.shift().toLowerCase();

    ////////////////////////////////////////////////////////////////////
    if (comando === "onlines" || comando === "players" || comando === "online") {
        if (args.length || args.length > 0) return message.channel.send(`Use: ${config.cfg.prefix}onlines`); {
          pool.getConnection(function(err, connection){
            connection.query(`SELECT COUNT(*)isLogged FROM authme  WHERE isLogged='1' LIMIT 20`, function (err, countonlines, fields) {

              connection.query(`SELECT isLogged, realname FROM authme  WHERE isLogged='1' LIMIT 20`, function (err, resultadoonlines, fields) {
  
              var numerosdejogadores = countonlines[0].isLogged
              var totaldejogadoreson = ""
              if (numerosdejogadores == 0){
                totaldejogadoreson = "Sem jogadores onlines"
              }
              if (numerosdejogadores > 0){
  
                for(var i = 0;i < numerosdejogadores; i++){
                  var numerofixo = i + 1
                  totaldejogadoreson += `[${numerofixo}] ` + resultadoonlines[i].realname + ` ${config.embed.emojiOn}` + "\n"           
                }
  
              }
          const embedonlines = {
            "color": "5301186",
            "footer": {
            },
            "author": {
              "name": "🌐 Jogadores Onlines 🌐"
            },
            "fields": [
              {
                "name": `${config.embed.onlines}`,
                "value": `${totaldejogadoreson}`
              }           
              ]
            };
          message.channel.send({ embed: embedonlines });          
          });
        });
            connection.release();
          });  
        }
      }
       
}
exports.help = {
    name: "onlines"
}