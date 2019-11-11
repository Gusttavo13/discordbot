const Discord = require("discord.js");
const mysql = require("mysql");
const client = new Discord.Client();
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
  if (comando === `${config.cfg.command}`) {
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
                            "name": `${config.embed.clan}`,
                            "value": `${strup}`
                          },
                          {
                            "name": `${config.embed.jobs}`,
                            "value": `${resultjobs}`
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
                            "name": `${config.embed.clan}`,
                            "value": `${strup}`
                          },
                          {
                            "name": `${config.embed.jobs}`,
                            "value": `${resultjobs}`
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
        });
        connection.release();
      });
    };    
  });
module.exports = pool
client.login(config.cfg.token);
//
//BUILD 1.0
//