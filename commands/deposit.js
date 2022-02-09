const { MessageEmbed } = require('discord.js');

module.exports.help = {
    name: "deposit"
}
const Client = require("bitcoin-core");
const chc = new Client(global.gConfig.chccore);

module.exports.run = async (bot, message, args) => {
	let address = await chc.getAddressesByAccount(message.author.id);

	if (address[0] == null) {
		chc.getAccountAddress(message.author.id).then((result, error) => {
			if (error) {
				console.log(error);
				return;
			} else {
				//message.author.send(result.toString());
				const exampleEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setDescription(':bank: Your deposit address: ' + result.toString() + ' :bank:')
					.setTimestamp()
					.setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

				message.author.send({ embeds: [exampleEmbed] });
				return;
			}
		});
	} else {
		//message.author.send(address[0].toString());
		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setDescription('Your deposit address: ' + address[0].toString() + ' :bank:')
			.setTimestamp()
			.setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

		message.author.send({ embeds: [exampleEmbed] });
		return;
	}
}
