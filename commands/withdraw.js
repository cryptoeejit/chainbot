const { MessageEmbed } = require('discord.js');

module.exports.help = {
    name: "withdraw"
}
const Client = require("bitcoin-core");
const chc = new Client(global.gConfig.chccore);
let explorerlink = "https://openchains.info/coin/chaincoin/tx/";
let symbol = "chc";

module.exports.run = async (bot, message, args) => {
    let words = message.content.trim().split(" ").filter(function (n) {
        return n !== "";
    });
    if (words.length != 3) {
        message.channel.send("Sorry, Please use **withdraw [amount] [address] or withdraw [address] [amount]**");
        return;
    }
    if ((!Number.isNaN(parseFloat(words[2]))) || (words[2].toUpperCase() == ("all").toUpperCase())) {
        let temp = words[2];
        words[2] = words[1];
        words[1] = temp;
    }
    if (((Number.isNaN(parseFloat(words[1]))) && (words[1].toUpperCase() != ("all").toUpperCase())) || ((getValidatedAmount(words[1]) == null) && (words[1].toUpperCase() != ("all").toUpperCase())) || (parseFloat(words[1]) == 0)) {
        message.channel.send("Sorry, Please use **withdraw [amount] [address] or withdraw [address] [amount]**");
        return;
    }

    chc.getBalance(message.author.id, 1).then((before, error) => {
        if (words[1].toUpperCase() == ("all").toUpperCase()) {
            words[1] = before;
        }
        if (parseFloat(words[1]) <= (parseFloat(before) - 0.1)) {
            if (parseFloat(words[1]) < 1) {
                message.channel.send("Minimum amount for withdraw is **1** " + symbol);
                return;
            }
            chc.sendFrom(message.author.id, words[2], words[1], 1).then((txid, error) => {
                if (error) {
                    console.log(words[2]);
                    console.log(parseFloat(words[1]));
                    console.log(error);
                    return;
                } else {
                    //message.author.send("Here's your transaction id " + txid + "\n[**Block explorer**](" + explorer + txid + ")");
                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription(`:moneybag: Withdraw Completed :moneybag:\n\n:mag:${explorerlink}${txid}`)
                        .setTimestamp()
                        .setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

                    message.author.send({ embeds: [exampleEmbed] });
                    return;
                    // no service fee
                    //chc.getBalance(message.author.id, 1).then((after, error) => {
                    //    let txfee = parseFloat(before) - parseFloat(words[1]) - parseFloat(after);
                    //    let servicesfee = 0.1 - txfee.toFixed(8);
                    //    chc.move(message.author.id, "services fee", servicesfee, 1, "services fee").then(result => {
                    //        if (result == true) {
                    //            console.log("Earn Services Fee: " + servicesfee + " " + symbol);
                    //            return;
                    //        }
                    //        return;
                    //    });
                    //});
                }
            });
        } else {
            message.channel.send("Please check your " + symbol + " with **balance ** command.");
            return;
        }
    });
}

function getValidatedAmount(amount) {
    amount = amount.trim();
    if (amount.toLowerCase().endsWith('chc')) {
        amount = amount.substring(0, amount.length - 3);
    }
    return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}