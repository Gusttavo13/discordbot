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
  client.user.setActivity(config.cfg.setGame);

  const embedboton = {
    "color": 65535,
    "author": {
      "name": "📃Bot Online📃"
    },
    "fields": [
      {
        "name": "Status do BOT",
        "value": "Online"
      }
    ]
  };
  const logboton = client.channels.get(config.cfg.logbot)
  logboton.send({ embed: embedboton });
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
    connection.query(`SELECT COUNT(*)username, uuid FROM luckperms_players WHERE username='${args}' GROUP BY username, uuid`, function (err, checarnabase, fields) {
        if (err) throw err;
      //Check nick in db
      if (checarnabase[0].username > 0) {
        connection.query(`SELECT username, uuid, primary_group FROM luckperms_players WHERE username='${args}' GROUP BY username, uuid, primary_group`, function (err, resultnick, fields) {

          //Converts First Letter from Title to Uppercase
          const cargo = resultnick[0].primary_group
          const cargoT = cargo.charAt(0).toUpperCase() + cargo.slice(1);
          const username = resultnick[0].username
          //User Logged or no
          connection.query(`SELECT username, realname, isLogged, lastlogin FROM authme WHERE username='${username}' GROUP BY username, realname, isLogged, lastlogin`, function (errplayerclan, resultlogged, fieldsplayerclan) {

            /////Pega o Último dia do player no Servidor////////////////////////////////////////////////
            var data = new Date()
            var dayatual = data.getTime()
            var mili = (1*24*60*60*1000)
            var lastday = resultlogged[0].lastlogin
            lastday = dayatual - resultlogged[0].lastlogin
            var conversion = Math.abs(lastday / mili)
            var conversion1 = Math.ceil(conversion)
            resultday = data.setDate(data.getDate() - conversion1)
            var dayembedlast = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear()
            ////////////////////////////////////////////////////////////////////////////////////////////
          connection.query(`SELECT COUNT(*)name, tag FROM sc_players WHERE name='${resultlogged[0].realname}' GROUP BY name, tag`, function (err, checarclan, fields) {
            if (err) throw err;
            //Money
            connection.query(`SELECT money, player_name FROM mpdb_economy WHERE player_name='${username}' GROUP BY money, player_name`, function (errmoney, resultmoney, fieldsmoney) {
              if (errmoney) throw errmoney;
              //Total XP 
              connection.query(`SELECT exp_lvl, player_name FROM mpdb_experience WHERE player_name='${username}' GROUP BY exp_lvl, player_name`, function (errxp, resultxp, fieldsxp) {
                if (err) throw err;
                //Clan
                connection.query(`SELECT name, tag FROM sc_players WHERE name='${resultlogged[0].realname}' GROUP BY name, tag`, function (errplayerclan, resultplayerclan, fieldsplayerclan) {
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
                  
                        connection.query(`SELECT COUNT(*)username FROM jobs_users WHERE username='${realnome}' GROUP BY`, function (err, countjobsuser, fields) {
                          var resultjobs = config.messages.emprego
                            connection.query(`SELECT id, username FROM jobs_users WHERE username='${realnome}' GROUP BY id, username`, function (errplayerclan, resultidjob, fieldsplayerclan) {
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
                          connection.query(`SELECT player_name, food FROM mpdb_health_food_air WHERE player_name='${realnome}' GROUP BY player_name, food`, function (errmpdb, resultmpdbfood, fieldsplayermpdbfood) {

                            var valuefood = resultmpdbfood[0].food
                            var comidacheia = config.embed.emojicomidacheia
                            var meiacomida = config.embed.emojicomidameia
                            var comidavazia = config.embed.emojicomidavazia
                            var resultadocomida = (comidavazia + comidavazia
                              + comidavazia + comidavazia + comidavazia + comidavazia
                              + comidavazia + comidavazia + comidavazia + comidavazia)  

                              

                              if(valuefood == 1){
                                resultadocomida = meiacomida+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 2){
                                resultadocomida = comidacheia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 3){
                                resultadocomida = comidacheia+meiacomida+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 4){
                                resultadocomida = comidacheia+comidacheia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 5){
                                resultadocomida = comidacheia+comidacheia+meiacomida+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia 
                              }
                              if(valuefood == 6){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia 
                              }
                              if(valuefood == 7){
                                resultadocomida = comidacheia+comidacheia+comidacheia+meiacomida+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 8){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 9){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+meiacomida+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 10){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidavazia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 11){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+meiacomida+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 12){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidavazia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 13){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+meiacomida+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 14){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidavazia+comidavazia+comidavazia
                              }
                              if(valuefood == 15){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+meiacomida+comidavazia+comidavazia
                              }
                              if(valuefood == 16){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidavazia+comidavazia
                              }
                              if(valuefood == 17){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+meiacomida+comidavazia
                              }
                              if(valuefood == 18){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidavazia
                              }
                              if(valuefood == 19){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+meiacomida
                              }
                              if(valuefood == 20){
                                resultadocomida = comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia+comidacheia
                              }
                              connection.query(`SELECT COUNT(*)username FROM thornya_vinculo WHERE username='${realnome}'`, function (err, countlinked, fields) {  
                              connection.query(`SELECT username, userID FROM thornya_vinculo WHERE username='${realnome}' GROUP BY userID, username`, function (err, resultvinculo, fields) { 
                                var vinclinked = "Sem vínculo"
                                if (countlinked[0].username == 1){
                                  vinclinked = resultvinculo[0].userID
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
                            "name": `${config.embed.lastday}`,
                            "value": `${dayembedlast}`
                          },
                          {
                            "name": `${config.embed.fome}`,
                            "value": `${resultadocomida}`
                          },
                          {
                            "name": `${config.embed.vinculado}`,
                            "value": `${vinclinked}`
                          }
                        ]
                      };
                      message.channel.send({ embed: embedPlayer });
                            });
                          });
                        });
                      });         
                    });
                  });
                });
              });
            });
          });
        });
      });
    })
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
    ////////////////////////////////////////////////////////////////////
    if (comando === "onlines" || comando === "players" || comando === "online") {
      if (args.length || args.length > 0) return message.channel.send(`Use: ${config.cfg.prefix}onlines`); {
        pool.getConnection(function(err, connection){
          connection.query(`SELECT COUNT(*)isLogged, realname FROM authme  WHERE isLogged='1' LIMIT 20`, function (err, countonlines, fields) {
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
            //SELECT isLogged, realname FROM authme ORDER BY isLogged DESC LIMIT 20
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
     ///////////////Verificar///////////
     if (comando === "vincular" || comando === "v"){
      const embedverificar = {
        "color": 65535,
        "footer": {
          "text": "Verificar perfil"
        },
        "author": {
          "name": "Banco de Dados"
        },
        "fields": [
          {
            "name": "Comando no Servidor",
            "value": "`Use /vincular [Código]`"
          },
          {
            "name": "Comando no Discord",
            "value": "`Use /vincular`"
          }
        ]
      };
      if (args.length > 0) return message.channel.send({ embed: embedverificar });
      pool.getConnection(function(err, connection){
        connection.query(`SELECT COUNT(userID)userID FROM thornya_vinculo WHERE userID='${message.member.user.tag}' LIMIT 20`, function (err, resultlinked, fields) {
          if(resultlinked[0].userID == 0){
            function makecode(length) {
              var result = '';
              var characters = 'Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0KkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
              var charactersLength = characters.length;
              for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              return result;
            }
            var codeverification = makecode(15)
            veriricarCodeExist()
            //////////////////////////////
            function veriricarCodeExist(){
              connection.query(`SELECT COUNT(code)code FROM thornya_vinculo WHERE code='${codeverification}' LIMIT 20`, function (err, resultcode, fields) {
                if(resultcode[0].code == 1){
                  codeverification = makecode(15)
                  veriricarCodeExist()               
                  }
               });
            }
            ///////////////////////
            connection.query(`INSERT INTO thornya_vinculo(id, username, userID, code, linked) VALUES (NULL, '','${message.member.user.tag}',"${codeverification}",'0')`, function (err, attlinked, fields) {
              message.channel.send("🔰Seu código foi enviado no seu Privado🔰")
              message.author.send(`Seu **novo** código de verificação para o Servidor do **Thornya Club**\nCódigo: ${codeverification}\n\nUtilize o comando **/vincular [código]** dentro do Servidor\n**Exemplo: /vincular 12345**`)

            }); 
          }else if(resultlinked[0].userID == 1){
            connection.query(`SELECT userID, code FROM thornya_vinculo WHERE userID='${message.member.user.tag}' LIMIT 20`, function (err, resultlinked, fields) {
            var usedcodeverification = resultlinked[0].code
            message.channel.send(`Você já tem um Código\nVeja seu Privado!`)
            message.author.send(`Seu código de verificação para o Servidor do **Thornya Club**\nCódigo: ${usedcodeverification}\n\nUtilize o comando **/vincular [código]** dentro do Servidor\n**Exemplo: /vincular 12345**`)
            });

          }else{
            message.channel.send("⛔Ocorreu um Erro⛔\nChame um Administrador\nErro #013")
          }         
        });
        connection.release();            
      });    
    }
});
module.exports = pool
client.login(config.cfg.token);
//
//BUILD 1.0
//