const { MessageEmbed } = require('discord.js');

const Client = require("bitcoin-core");
const chc = new Client(global.gConfig.chccore);

module.exports.run = async (bot, message, args) => {

	try {
 
		const testinfo = 'Ping Test';

		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setDescription(`:ping_pong: ${testinfo} :ping_pong:`)
			.setTimestamp()
			.setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

		message.channel.send({ embeds: [exampleEmbed] });
	}
	catch (err) {
		throw new Error(err.message)
	}
}

function callback(elmnt, index, array) {
	console.log(`${elmnt.id}`);
}

module.exports.help = {
    name:"ping"
}
