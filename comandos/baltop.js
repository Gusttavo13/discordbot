const discord = require("discord.js");
const mysql = require("mysql");
const config = require('../config.json')

const pool = mysql.createPool({
    connectionLimit : 10, 
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
  });

exports.run = (client, message, args) => {
    var args = message.content.slice(config.cfg.prefix.length).trim().split(/ +/g);
    var comando = args.shift().toLowerCase();

        if (args.length || args.length > 0) return message.channel.send(`Use: ${config.cfg.prefix}Baltop`); {
          pool.getConnection(function(err, connection){
          connection.query("SELECT money, player_name FROM mpdb_economy ORDER BY money DESC LIMIT 10", function (err, ecocheck, fields) {
            if(!ecocheck[0].money < 10){
    
          const embedbaltop = {
            "color": "5301186",
            "footer": {
            },
            "author": {
              "name": "💸 Rank Money 💸"
            },
            "fields": [
              {
                "name": `[1] ${ecocheck[0].player_name}`,
                "value": `T$${ecocheck[0].money}`
              },
              {
                "name": `[2] ${ecocheck[1].player_name}`,
                "value": `T$${ecocheck[1].money}`
              },
              {
                "name": `[3] ${ecocheck[2].player_name}`,
                "value": `T$${ecocheck[2].money}`
              },
              {
                "name": `[4] ${ecocheck[3].player_name}`,
                "value": `T$${ecocheck[3].money}`
              },
              {
                "name": `[5] ${ecocheck[4].player_name}`,
                "value": `T$${ecocheck[4].money}`
              },
              {
                "name": `[6] ${ecocheck[5].player_name}`,
                "value": `T$${ecocheck[5].money}`
              },
              {
                "name": `[7] ${ecocheck[6].player_name}`,
                "value": `T$${ecocheck[6].money}`
              },
              {
                "name": `[8] ${ecocheck[7].player_name}`,
                "value": `T$${ecocheck[7].money}`
              },
              {
                "name": `[9] ${ecocheck[8].player_name}`,
                "value": `T$${ecocheck[8].money}`
              },
              {
                "name": `[10] ${ecocheck[9].player_name}`,
                "value": `T$${ecocheck[9].money}`
              }
              
    
    
            ]
          };
          message.channel.send({ embed: embedbaltop });
          }else{
            message.channel.send("Baltop em Manutenção!");
              }
            });
            connection.release();
          });  
        }
    }
exports.help = {
    name: "baltop"
}