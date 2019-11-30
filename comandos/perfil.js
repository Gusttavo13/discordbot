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

    if (!args.length | args.length > 1) return message.channel.send(`Use: ${config.cfg.prefix}${config.cfg.command} Player`); {
    } 
    pool.getConnection(function(err, connection){
    connection.query(`SELECT COUNT(*)username FROM luckperms_players WHERE username='${args}'`, function (err, checarnabase, fields) {
        if (err) throw err;
      //Check nick in db
      if (checarnabase[0].username > 0) {
        connection.query(`SELECT username, uuid, primary_group FROM luckperms_players WHERE username='${args}' GROUP BY username, uuid, primary_group`, function (err, resultnick, fields) {

          //Converts First Letter from Title to Uppercase
          const cargo = resultnick[0].primary_group
          const cargoT = cargo.charAt(0).toUpperCase() + cargo.slice(1);
          const username = resultnick[0].username
          //User Logged or no
          connection.query(`SELECT username, realname, isLogged, lastlogin FROM authme WHERE username='${username}' GROUP BY username, realname, isLogged, lastlogin`, function (err, resultlogged, fields) {

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
          connection.query(`SELECT COUNT(*)name FROM sc_players WHERE name='${resultlogged[0].realname}'`, function (err, checarclan, fields) {
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
                  
                        connection.query(`SELECT COUNT(*)username FROM jobs_users WHERE username='${realnome}'`, function (err, countjobsuser, fields) {
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
/////////////////////////////////////////////////////////////////////////////
exports.help = {
    name: "perfil"
}