const Discord = require("discord.js");
const mysql = require("mysql");
const client = new Discord.Client();
const config = require('./config.json')
//MySQL//

const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

connection.connect(function (err) {
  if (!!err) {
    console.log('Error in Database');
  } else {
    console.log('Conected Database');
  }
});


client.on("ready", () => {
  console.log(`Online, with ${client.users.size} Users, em ${client.channels.size} channels, in ${client.guilds.size} servers!`);
  client.user.setGame(config.cfg.setGame);
});

client.on("guildCreate", guild => {
  console.log(`The bot entered the server: ${guild.name} (ID: ${guild.id}). People: ${guild.memberCount} Members!`);
  client.user.setActivity(`I'm in ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`The bot has been removed from the server: ${guild.name} (ID: ${guild.id}).`);
  client.user.setActivity(`I'm in ${client.guilds.size} servers`);
});

client.on("message", async message => {

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(config.cfg.prefix)) return;

  var args = message.content.slice(config.cfg.prefix.length).trim().split(/ +/g);
  var comando = args.shift().toLowerCase();
 
  //Command Perfil
  if (comando === `${config.cfg.command}`) {
    if (!args.length | args.length > 1) return message.channel.send(`Use: ${config.cfg.prefix}${config.cfg.command} Player`); {
    }
    //Command Args
    connection.query(`SELECT COUNT(*)username, Uuid FROM luckperms_players WHERE username='${args}'`, function (err, checarnabase, fields) {
      if (err) throw err;

      //Check nick in db
      if (checarnabase[0].username > 0) {
        connection.query(`SELECT username, uuid, primary_group FROM luckperms_players WHERE username='${args}'`, function (err, resultnick, fields) {
          //Converts First Letter from Title to Uppercase
          const cargo = resultnick[0].primary_group
          const cargoT = cargo.charAt(0).toUpperCase() + cargo.slice(1);
          const username = resultnick[0].username
        if(config.dependencies.SimpleClan == true){
          connection.query(`SELECT COUNT(*)name, tag FROM sc_players WHERE name='${username}'`, function (err, checarclan, fields) {
            if (err) throw err;
            //Money
            connection.query(`SELECT money, player_name FROM mpdb_economy WHERE player_name='${username}'`, function (errmoney, resultmoney, fieldsmoney) {
              if (errmoney) throw errmoney;
              //Total XP 
              connection.query(`SELECT exp_lvl, player_name FROM mpdb_experience WHERE player_name='${username}'`, function (errxp, resultxp, fieldsxp) {
                if (err) throw err;
                //Clan
                connection.query(`SELECT name, tag WHERE name='${username}'`, function (errplayerclan, resultplayerclan, fieldsplayerclan) {
                  if (err) throw err;
                  var strup = config.message.nohaveclan;
                  if (checarclan[0].name == 1) {
                    strup = resultplayerclan[0].tag.toUpperCase();
                  }
                
                  //User Logged or no
                  connection.query(`SELECT username, realname, isLogged FROM authme WHERE username='${username}'`, function (errplayerclan, resultlogged, fieldsplayerclan) {
                    if (err) throw err;
                    var idlogado = resultlogged[0].isLogged
                    var logged = config.embed.emojiOff
                    if(idlogado == 1){
                      logged = config.embed.emojiOn
                    }
                  const embedPlayer = {
                    "title": `${config.embed.subTitle}${resultlogged[0].realname} ${logged}`,
                    "color": config.embed.color,
                    "footer": {
                      "text": `${config.embed.footer}`
                    },
                    "thumbnail": {
                      "url": `https://minotar.net/helm/${resultlogged[0].realname}/100.png`
                    },
                    "author": {
                      "name": `${config.embed.title}`
                    },
                    "fields": [
                      {
                        "name": `${config.embed.money}`,
                        "value": `R$${resultmoney[0].money}`
                      },
                      {
                        "name": `${config.embed.xp}`,
                        "value": `${resultxp[0].exp_lvl}`
                      },
                      {
                        "name": `${config.embed.group}`,
                        "value": `${cargoT}`
                      },
                      {
                        "name": `${config.embed.group}`,
                        "value": `${strup}`
                      }
                    ]
                  };
                  message.channel.send({ embed: embedPlayer });

                });

              });

            });

          });

        });
      } else {
        connection.query(`SELECT money, player_name FROM mpdb_economy WHERE player_name='${username}'`, function (errmoney, resultmoney, fieldsmoney) {
          if (errmoney) throw errmoney;
          //Total XP

                        //User Logged or no
            connection.query(`SELECT username, realname, isLogged FROM authme WHERE username='${username}'`, function (errplayerclan, resultlogged, fieldsplayerclan) {
            if (err) throw err;
              var idlogado = resultlogged[0].isLogged
              var logged = config.embed.emojiOff
            if(idlogado == 1){
              logged = config.embed.emojiOn
                          } 
          connection.query(`SELECT exp_lvl, player_name FROM mpdb_experience WHERE player_name='${resultlogged[0].realname}'`, function (errxp, resultxp, fieldsxp) {
            if (err) throw err;

              const embedPlayer = {
                "title": `${config.embed.subTitle} ${resultlogged[0].realname} ${logged}`,
                "color": config.embed.color,
                "footer": {
                  "text": `${config.embed.footer}`
                },
                "thumbnail": {
                  "url": `https://minotar.net/helm/${resultlogged[0].realname}/100.png`
                },
                "author": {
                  "name": `${config.embed.title}`
                },
                "fields": [
                  {
                    "name": `${config.embed.money}`,
                    "value": `R$${resultmoney[0].money}`
                  },
                  {
                    "name": `${config.embed.xp}`,
                    "value": `${resultxp[0].exp_lvl}`
                  },
                  {
                    "name": `${config.embed.group}`,
                    "value": `${cargoT}`
                  }
                ]
              };
              message.channel.send({ embed: embedPlayer });

  
            });

          });

        });

      }
    });

    
      } else {
        return message.channel.send(config.messages.noexists);
      };
    });
  };

});
client.login(config.cfg.token);
//
//BUILD 1.0
//