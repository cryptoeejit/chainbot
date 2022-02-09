const { MessageEmbed } = require('discord.js');
module.exports.help = {
    name: "megasoak"
}
const Client = require("bitcoin-core");
const chc = new Client(global.gConfig.chccore);
let symbol = "chc";
module.exports.run = async (bot, message, args) => {
 
    let words = message.content.trim().split(" ").filter(function (n) {
        return n !== "";
    });
    if (words.length == 1) {
        message.channel.send("<@" + message.author.id + "> Please use ** megasoak[amount] **");
        return;
    }
    if (((Number.isNaN(parseFloat(words[1]))) && (words[1].toUpperCase() != ("all").toUpperCase())) || ((getValidatedAmount(words[1]) == null) && (words[1].toUpperCase() != ("all").toUpperCase())) || (parseFloat(words[1]) == 0)) {
        message.channel.send("<@" + message.author.id + "> Please use **!megasoak [amount]**");
        return;
    }

    let balance = await chc.getBalance(message.author.id);
    if (words[1].toUpperCase() == ("all").toUpperCase()) {
        words[1] = balance;
    }
    if (parseFloat(words[1]) > parseFloat(balance)) {
        message.channel.send("<@" + message.author.id + "> Please deposit your " + symbol + " with **deposit** command");
        return;
    }

    if (parseFloat(words[1]) < 1) {
        message.channel.send("<@" + message.author.id + "> Minimum amount for megasoak is **1** " + symbol);
        return;
    }

    let moveresult = await chc.move(message.author.id, "megasoak", parseFloat(words[1]), 1, "megasoak");
    if (moveresult == "false") {
        console.log("donate fail, result false");
    } else {
        balance = await chc.getBalance("megasoak");
        //message.channel.send("<@" + message.author.id + "> Donated **" + words[1] + "** " + symbol + " to megasoak pot. \nCurrent megasoak pot: " + balance.toString() + " " + symbol + ".");
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setDescription(':thunder_cloud_rain: <@' + message.author.id + '> Donated **' + words[1] + '** ' + symbol + ' to megasoak pot. \nCurrent megasoak pot: ' + balance.toString() + " " + symbol + '. :thunder_cloud_rain:')
            .setTimestamp()
            .setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

        message.channel.send({ embeds: [exampleEmbed] });
    }
    if (parseFloat(balance) < 200) {
        return;
    }
    // eligible members
    const memberArr = new Array();
    let guild = bot.guilds.cache.first();

    console.log(`guild ${guild.id} - ${guild.name}`);

    guild.members.cache.forEach(async (member) => {
        let user = member.user;
        if (!user.bot && member.presence !== null) { //&& (member.presence.status == 'online' | member.presence.status == 'idle')) {
            member.roles.cache.forEach(async (memberRole) => {
                if (memberRole.name == 'Member') {
                    memberArr.push(member);
                }
            })
        }
    })

    // convert valid members to string for display
    var membersDisplay = memberArr.map(function (member) {
        return `<@${member.id}>`;
    }).join(" ");
    //console.log(`Eligible members - ${membersDisplay}`);

    let list = memberArr;

    let totalsoak = parseFloat(balance); // leave
    
    let soak = Math.round((totalsoak / list.length) * 100000000) / 100000000;
    if (totalsoak > (soak * list.length)) {
        soak = Math.floor((totalsoak / list.length) * 100000000) / 100000000;
    }
    
    for (var i = 0; i < list.length; i++) {
        let moveresult = await chc.move("megasoak", list[i].id, soak, 1, "megasoak");
        if (moveresult == "false") {
            console.log(list[i].id + " move fail, result false");
        }
    }

    // message
    const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setDescription(`:thunder_cloud_rain: <@${message.author.id}> triggered the megasoak pot. :star:\n\n ${membersDisplay} each receive ${soak} chc`)
        .setTimestamp()
        .setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

    message.channel.send({ embeds: [exampleEmbed] });
    return;
}
function callback(elmnt, index, array) {
    console.log(`${elmnt.id}`);
}
function presentMembers(elmnt, index, array) {
    console.log(`${elmnt.id}`);
}


function getValidatedAmount(amount) {
    amount = amount.trim();
    if (amount.toLowerCase().endsWith('chc')) {
        amount = amount.substring(0, amount.length - 3);
    }
    return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}