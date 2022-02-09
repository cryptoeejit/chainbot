const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
	try {
		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setDescription('Cheers! :beers:')
			.setTimestamp()
			.setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

		message.channel.send({ embeds: [exampleEmbed] });
	}
	catch (err) {
		throw new Error(err.message)
	}
}

module.exports.help = {
	name: "beer"
}