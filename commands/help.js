const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
	try {
		let commandlist = `:information_source: commands \n`;
		bot.commands.forEach(async (cmd) => {
			commandlist = `${commandlist} \n_${cmd.help.name}`;
		})

		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setDescription(`${commandlist}`)
			.setTimestamp()
			.setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

		message.channel.send({ embeds: [exampleEmbed] });
	}
	catch (err) {
		throw new Error(err.message)
	}
}

module.exports.help = {
	name: "help"
}
