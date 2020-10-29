const Discord = require('discord.js');
const client = new Discord.client();

let prefix = process.env.PREFIX;

client.on('ready', () => {
	console.log('---------- Estoy listo! ----------');
	client.user.setActivity('doname en PayPal o te mato', { type: 'WATCHING' });
});

client.on('messageDelete', (message) => {
	let channelMessage = client.channels.cache.get('');
	const embedDelMessage = new Discord.MessageEmbed()
		.setTitle(`Un mensaje fue eliminado en ${message.channel.name}`)
		.setColor('#f67766')
		.setDescription(`El mensaje decia: ${message}`)
		.setFooter(`Nadie se escapa aca ;)`)
		.setThumbnail(message.author.displayAvatarURL());
	channelMessage.send({ embed: embedDelMessage });
});

client.on('message', (message) => {
	if (message.content.startsWith(prefix + 'ping')) {
		let ping = Math.floor(message.client.ws.ping);
		message.channel.send(':ping_pong: `' + ping + ' ms.` desde heroku.');
	}
});

client.login(process.env.TOKEN);
