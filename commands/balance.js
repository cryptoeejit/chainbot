const { MessageEmbed } = require('discord.js');

module.exports.help = {
    name: "balance"
}
const Client = require("bitcoin-core");
const chc = new Client(global.gConfig.chccore);

module.exports.run = async (bot, message, args) => {
    chc.getBalance(message.author.id, 1).then((result, error) => {
        if (error) {
            console.log(error);
            return;
        } else {
            //message.author.send(result.toString());
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setDescription('Your balance: ' + result.toString() + ' :money_mouth:')
                .setTimestamp()
                .setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

            message.author.send({ embeds: [exampleEmbed] });

            return;
        }
    });
}
