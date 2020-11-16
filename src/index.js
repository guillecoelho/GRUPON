const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

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
	var db = new sqlite3.Database(
		'./src/servers.db',
		sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
	);
	db.run(
		`CREATE TABLE IF NOT EXISTS server (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, serverid TEXT, adminid TEXT, adminname TEXT, logchannelid TEXT)`
	);

	console.log('---------- Estoy listo! ----------');
	client.user.setActivity('gr-help | doname en PayPal o te mato', {
		type: 'WATCHING',
	});
});

client.on('messageDelete', (message) => {
	if (config.recording == 1) {
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
	}
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if (config.recording == 1) {
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
	}
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

	if (
		message.content.startsWith(prefix + 'ping') &&
		message.author.id == config.admin
	) {
		let ping = Math.floor(message.client.ws.ping);
		message.channel.send(ping + ' ms.');
	}

	if (message.content.startsWith(prefix + 'admin') && config.recording == 1) {
		let query = `SELECT * FROM server WHERE adminid = ?`;
		db.get(query, [adminname], (err, row) => {
			if (err) {
				console.log(err);
				return;
			}
			if (row == undefined) {
				let insertdata = db.prepare(`INSERT INTO server VALUES(?,?,?,?)`);
				insertdata.run(
					message.guild.id,
					message.author.id,
					message.author.username,
					message.channel.id
				);
			} else {
				let user = row.adminname;
				console.log(user);
			}
      console.log('xd');
		});
	}

	if (
		message.content.startsWith(prefix + 'activate') &&
		message.author.id == config.admin
	) {
		var archivo = fs.readFileSync(__dirname + '/config.json', {
			encoding: 'utf8',
			flag: 'r',
		});

		if (archivo.includes('"recording": "0"')) {
			archivo = archivo.replace('"recording": "0"', '"recording": "1"');

			fs.writeFileSync(__dirname + '/config.json', archivo, function (err) {
				if (err) throw err;
				console.log('Wrote sitemap to XML');
			});

			message.channel.send('El bot ha sido activado.');
		} else {
			message.channel.send('El bot ya estaba activado. No estaba funcionando?');
		}
	} else if (
		message.content.startsWith(prefix + 'desactivate') &&
		message.author.id == config.admin
	) {
		var archivo = fs.readFileSync(__dirname + '/config.json', {
			encoding: 'utf8',
			flag: 'r',
		});

		if (archivo.includes('"recording": "1"')) {
			archivo = archivo.replace('"recording": "1"', '"recording": "0"');

			fs.writeFileSync(__dirname + '/config.json', archivo, function (err) {
				if (err) throw err;
				console.log('Wrote sitemap to XML');
			});

			message.channel.send('El bot ha sido desactivado.');
		} else {
			message.channel.send('El bot ya estaba desactivado. Estaba funcionando?');
		}
	}
});

client.login(process.env.TOKEN);
