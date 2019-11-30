const Discord = require("discord.js");
const mysql = require("mysql");
const jimp = require("jimp");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require('./config.json')
var fs = require('fs');
var text2png = require('text2png');
//MySQL//

fs.readdir("./comandos/", (err, files) => {

  if(err) console.log("Erro ao ler os arquivos: "+ err)
  let jsFile = files.filter(f => f.split(".").pop() === "js");
  if(jsFile.length <= 0){
    console.log("Nenhum JS encontrado!");
    return
  }

  jsFile.forEach((f, i) => {
    let props = require(`./comandos/${f}`);
    console.log(`Arquivo ${f} Carregado!`)
    client.commands.set(props.help.name, props)
    client.commands.set(props.help.aliases, props)
  });
})

const pool = mysql.createPool({
  connectionLimit : 10, 
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

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
  
});
client.on("guildMemberAdd", async member => {
  /////////////////////////////////////////////////////////////
  let memberRoleMembro = member.guild.roles.get("615323943565262858")
  member.addRole(memberRoleMembro)
  /////////////////////////////////////////////////////////////
  let canal = client.channels.get("615316171499110412")
  let masklogo = await jimp.read("bemvindo/LogoMask.png")
  let fundo = await jimp.read("bemvindo/Fundo.png")
  fs.writeFileSync('bemvindo/nome.png', text2png(member.user.username, {
    color: 'white',
    font: '15px Minecraft',
    localFontPath: 'bemvindo/Minecraft.ttf',
    localFontName: 'Minecraft'}));
  /* 
  fs.writeFileSync('bemvindo/bem_vindo.png', text2png('Bem Vindo ao Thornya', {
    color: 'yellow',
    font: '18px Minecraft',
    localFontPath: 'bemvindo/Minecraft.ttf',
    localFontName: 'Minecraft'}));
 */
  let bemvindopng = await jimp.read("bemvindo/bem_vindo.png")
  let nome = await jimp.read("bemvindo/nome.png")
  jimp.read(member.user.displayAvatarURL).then(logo => {
    logo.resize(50, 50)
    masklogo.resize(50, 50)
    logo.mask(masklogo)
    fundo.composite(bemvindopng,90,15)
    fundo.composite(nome,90,35)
    fundo.composite(logo,20, 8).write('bemvindo/welcome.png')  
    canal.send(`${member}`, { files: ["bemvindo/welcome.png"] })

  }).catch(err =>{
    console.log("Erro ao Carregar a Imagem:" + err)
  })
  
  
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
  let prefix = config.cfg.prefix;
  let messageArray = message.content.split(" ");
  let argumentos = messageArray[0];
  let jsCMD = client.commands.get(argumentos.slice(prefix.length));

  if(jsCMD) jsCMD.run(client, message, args);


  var args = message.content.slice(config.cfg.prefix.length).trim().split(/ +/g);
  var comando = args.shift().toLowerCase();
  
  
    //Comando Ping
  if (comando === "ping") {
    const m = await message.channel.send("Pong!");
    m.edit(`A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latência da API é ${Math.round(client.ping)}ms`);
  }
  
});
module.exports = pool
client.login(config.cfg.token);
//
//BUILD 5.0
//