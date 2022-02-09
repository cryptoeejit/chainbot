const { MessageEmbed } = require('discord.js');
module.exports.help = {
    name: "tip"
}
const Client = require("bitcoin-core");
const chc = new Client(global.gConfig.chccore);
let symbol = "chc";

module.exports.run = async (bot, message, args) => {

    let words = message.content.trim().split(" ").filter(function (n) {
        return n !== "";
    });
    if (words.length != 3) {
        message.channel.send("<@" + message.author.id + "> Please use **tip [amount] [@username] or !tip [@username] [amount]**");
        return;
    }
    if ((!Number.isNaN(parseFloat(words[2]))) || (words[2].toUpperCase() == ("all").toUpperCase())) {
        let temp = words[2];
        words[2] = words[1];
        words[1] = temp;
    }
    if (((Number.isNaN(parseFloat(words[1]))) && (words[1].toUpperCase() != ("all").toUpperCase())) || ((getValidatedAmount(words[1]) == null) && (words[1].toUpperCase() != ("all").toUpperCase())) || (parseFloat(words[1]) == 0)) {
        message.channel.send("<@" + message.author.id + "> Please use **tip [amount] [@username] or tip [@username] [amount]**");
        return;
    }

    chc.getBalance(message.author.id, 1).then((result, error) => {
        if (words[1].toUpperCase() == ("all").toUpperCase()) {
            words[1] = result;
        }
        if (parseFloat(words[1]) <= parseFloat(result)) {
            if (message.author.id == message.mentions.members.first().id) {
                message.channel.send("<@" + message.author.id + "> Sorry, you're not allowed to tip yourself.");
                return;
            } else {
                if (parseFloat(words[1]) < 1) {
                    message.channel.send("<@" + message.author.id + "> Minimum amount for tip is **1**");
                    return;
                }
                chc.move(message.author.id, message.mentions.members.first().id, parseFloat(words[1]), 1, "tip").then(result => {
                    if (result == "false") {
                        console.log("move fail, result false");
                        return;
                    } else {
                        //message.channel.send("<@" + message.author.id + "> Sent ** " + words[1] + " ** " + symbol + " to: <@" + message.mentions.members.first().id + "> ");
                        const exampleEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setDescription('<@' + message.author.id + '> Sent ** ' + words[1] + ' ** ' + symbol + ' to: <@' + message.mentions.members.first().id + '> ')
                            .setTimestamp()
                            .setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

                        message.channel.send({ embeds: [exampleEmbed] });
                        return;
                    }
                });
            }
        } else {
            message.channel.send("<@" + message.author.id + "> Please deposit your " + symbol + " with **deposit** command.");
        };
       
    });
    return;
}

function getValidatedAmount(amount) {
    amount = amount.trim();
    if (amount.toLowerCase().endsWith('chc')) {
        amount = amount.substring(0, amount.length - 3);
    }
    return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}


