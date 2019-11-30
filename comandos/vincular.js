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
    var args = message.content.slice(config.cfg.prefix.length).trim().split(/ +/g);
    var comando = args.shift().toLowerCase();
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
/////////////////////////////////////////////////////////////////////////////
exports.help = {
    name: "vincular"
}