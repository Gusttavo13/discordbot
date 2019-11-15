const Discord = require("discord.js");
const mysql = require("mysql");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require('./config.json')
//MySQL//

const pool = mysql.createPool({
  connectionLimit : 10, 
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

//pool.getConnection((err, connection) => {
  //if (err) {
    //  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
     //     console.error('Database connection was closed.')
     // }
     // if (err.code === 'ER_CON_COUNT_ERROR') {
      //    console.error('Database has too many connections.')
      //}
      //if (err.code === 'ECONNREFUSED') {
      //    console.error('Database connection was refused.')
     // }
  //}
  //if (connection) connection.release()
 // return
//})

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
  if (comando === `${config.cfg.command}` || comando === "pf" || comando === "p") {
    if (!args.length | args.length > 1) return message.channel.send(`Use: ${config.cfg.prefix}${config.cfg.command} Player`); {
    } 
    pool.getConnection(function(err, connection){
    connection.query(`SELECT COUNT(*)username, Uuid FROM luckperms_players WHERE username='${args}'`, function (err, checarnabase, fields) {
        if (err) throw err;
      //Check nick in db
      if (checarnabase[0].username > 0) {
        connection.query(`SELECT username, uuid, primary_group FROM luckperms_players WHERE username='${args}'`, function (err, resultnick, fields) {

          //Converts First Letter from Title to Uppercase
          const cargo = resultnick[0].primary_group
          const cargoT = cargo.charAt(0).toUpperCase() + cargo.slice(1);
          const username = resultnick[0].username
          //User Logged or no
          connection.query(`SELECT username, realname, isLogged FROM authme WHERE username='${username}'`, function (errplayerclan, resultlogged, fieldsplayerclan) {
          connection.query(`SELECT COUNT(*)name, tag FROM sc_players WHERE name='${resultlogged[0].realname}'`, function (err, checarclan, fields) {
            if (err) throw err;
            //Money
            connection.query(`SELECT money, player_name FROM mpdb_economy WHERE player_name='${username}'`, function (errmoney, resultmoney, fieldsmoney) {
              if (errmoney) throw errmoney;
              //Total XP 
              connection.query(`SELECT exp_lvl, player_name FROM mpdb_experience WHERE player_name='${username}'`, function (errxp, resultxp, fieldsxp) {
                if (err) throw err;
                //Clan
                connection.query(`SELECT name, tag FROM sc_players WHERE name='${resultlogged[0].realname}'`, function (errplayerclan, resultplayerclan, fieldsplayerclan) {
                  if (err) throw err;
                  var strup = config.messages.nohaveclan;
                  if (checarclan[0].name > 0) {
                    strup = resultplayerclan[0].tag.toUpperCase();
                  }               
                  
                    if (err) throw err;
                    var realnome = resultlogged[0].realname
                    var idlogado = resultlogged[0].isLogged
                    var logged = config.embed.emojiOff
                    if(idlogado == 1){
                      logged = config.embed.emojiOn
                    }
                  
                        connection.query(`SELECT COUNT(*)username FROM jobs_users WHERE username='${realnome}'`, function (err, countjobsuser, fields) {
                          var resultjobs = config.messages.emprego
                          if (countjobsuser[0].username > 0 ){
                            connection.query(`SELECT id, username FROM jobs_users WHERE username='${realnome}'`, function (errplayerclan, resultidjob, fieldsplayerclan) {
                              var jobid = resultidjob[0].id
                            connection.query(`SELECT userid, job, level FROM jobs_jobs WHERE userid='${jobid}'`, function (errplayerclan, resultjobsbase, fieldsplayerclan) {
                            connection.query(`SELECT COUNT(*)userid FROM jobs_jobs WHERE userid='${jobid}'`, function (err, countjobs, fields) {
                              var jobscontados = countjobs[0].userid
                              if (jobscontados == 1 ){
                                  resultjobs = `${resultjobsbase[0].job} [${resultjobsbase[0].level}]`
                              }
                              if (jobscontados == 2 ){
    
                                resultjobs = `${resultjobsbase[0].job} [${resultjobsbase[0].level}] - ${resultjobsbase[1].job} [${resultjobsbase[1].level}]`
                            }
                            if (jobscontados == 3 ){
                              resultjobs = `${resultjobsbase[0].job} [${resultjobsbase[0].level}] - ${resultjobsbase[1].job} [${resultjobsbase[1].level}] - ${resultjobsbase[2].job} [${resultjobsbase[2].level}]`
                          }
                        
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
                            "value": `T$${resultmoney[0].money}`
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
                            "name": `${config.embed.clan}`,
                            "value": `${strup}`
                          },
                          {
                            "name": `${config.embed.jobs}`,
                            "value": `${resultjobs}`
                          },
                          {
                            "name": "Vinculado",
                            "value": "None"
                          }
                        ]
                      };
                      message.channel.send({ embed: embedPlayer });
                    
                          });
                        });         
                      });
                    }else{
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
                            "value": `T$${resultmoney[0].money}`
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
                            "name": `${config.embed.clan}`,
                            "value": `${strup}`
                          },
                          {
                            "name": `${config.embed.jobs}`,
                            "value": `${resultjobs}`
                          },
                          {
                            "name": "Vinculado",
                            "value": "None"
                          }
                          
                        ]
                      };
                      message.channel.send({ embed: embedPlayer });
                    }
                  });
                });
              });
            });
          });
        });
      });
      } else {
        return message.channel.send(config.messages.noexists);
          };
          connection.release();              
        });

      });

    };
    //Comando Ping
  if (comando === "ping") {
    const m = await message.channel.send("Pong!");
    m.edit(`A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latência da API é ${Math.round(client.ping)}ms`);
  }
  //Comando de Mostrar quem fez o BOT
  if (comando === "bot") {
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
  ///////////////AVISO///////////
  if (comando === "aviso" || comando === "av"){
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

    ///615330098949652480
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
  ///////////////////////////////////////////////////////////////////////////////////



  ////////////////Baltop

  if (comando === "baltop") {
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
     ///////////////Verificar///////////
     if (comando === "vincular" || comando === "v"){
      const embedverificar = {
        "title": `Database não encontrada❌`,
        "color": 65535,
        "footer": {
          "text": "Verificar perfil"
        },
        "author": {
          "name": "Banco de Dados"
        },
        "fields": [
          {
            "name": "Comando no Discord",
            "value": "`Use /vincular [Código]`"
          },
          {
            "name": "Comando no Servidor",
            "value": "`Use /vincular`"
          }
        ]
      };
      if (args.length > 1 || args.length < 1) return message.channel.send({ embed: embedverificar });

      if (args.length == 1){
        message.channel.send("Código Inválido ❌");
      }
    }  
});
module.exports = pool
client.login(config.cfg.token);
//
//BUILD 1.0
//