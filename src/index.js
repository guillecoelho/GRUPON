const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

require('dotenv').config();
let prefix = process.env.PREFIX;

//
const keepAlive = require('./server.js');
const Monitor = require('ping-monitor');

keepAlive();
const monitor = new Monitor({
	website: 'https://Ping-GRUPON.elbodelajustici.repl.co',
	title: 'Secundario',
	interval: 15, // minutes
});

monitor.on('up', (res) => console.log(`${res.website} está encedido.`));
monitor.on('down', (res) =>
	console.log(`${res.website} se ha caído - ${res.statusMessage}`)
);
monitor.on('stop', (website) => console.log(`${website} se ha parado.`));
monitor.on('error', (error) => console.log(error));

client.on('ready', () => {
	console.log('---------- Estoy listo! ----------');
	client.user.setActivity('gr!help | doname en PayPal o te mato', {
		type: 'WATCHING',
	});
});

client.on('messageDelete', (message) => {
	let channelMessage = client.channels.cache.get(config.logchannel);
	const embedDelMessage = new Discord.MessageEmbed()
		.setTitle(`Un mensaje fue eliminado en ${message.channel.name}`)
		.setColor('#f67766')
		.setDescription(
			`El mensaje decia: ${message} \n Lo envio: ${message.member.displayName}`
		)
		.setFooter(`Nadie se escapa aca ;)`)
		.setThumbnail(message.author.displayAvatarURL());
	channelMessage.send({ embed: embedDelMessage });
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;

	let channelMessage = client.channels.cache.get(config.logchannel);
	let nameChannel = newMessage.channel.name;
	let nameAuthor = newMessage.member.displayName;

	const embedDelMessage = new Discord.MessageEmbed()
		.setTitle(`Un mensaje fue editado en ${nameChannel}`)
		.setColor('#f67766')
		.setDescription(
			`El mensaje: '${oldMessage}' enviado por: ${nameAuthor} fue editado y ahora dice: '${newMessage}'`
		)
		.setFooter(`Nadie se escapa aca ;)`)
		.setThumbnail(oldMessage.author.displayAvatarURL());
	channelMessage.send({ embed: embedDelMessage });
});

client.on('message', (message) => {
	if (!message.content.startsWith(prefix)) return;
	if (message.author.bot) return;

	if (message.content.startsWith(prefix + 'help')) {
		const embedDelMessage = new Discord.MessageEmbed()
			.setTitle(`Has requerido mi ayuda aventurero? Pues aqui estoy`)
			.setColor('#f67766')
			.setDescription(
				`BotGRUPON va a poder ayudarte en tu busqueda de la felicidad, solo doname 1000 dolares a mi billetera de BitCoin e ire contigo.`
			)
			.setFooter(`Por un mundo con menos geis`)
			.setThumbnail(message.author.displayAvatarURL())
			.setURL('https://github.com/ElBoDeLaJusticia');
		message.channel.send({ embed: embedDelMessage });
	}

	if (message.content.startsWith(prefix + 'ping')) {
		let ping = Math.floor(message.client.ws.ping);
		message.channel.send(':ping_pong: `' + ping + ' ms.` desde repl.');
	}
});

client.login(process.env.TOKEN);
