const { MessageEmbed } = require('discord.js');

const Client = require("bitcoin-core");
const chc = new Client(global.gConfig.chccore);

module.exports.run = async (bot, message, args) => {

	try {
        // eligible members
        const memberArr = new Array();
        let guild = bot.guilds.cache.first(); // todopw: should be specific

        //bot.guilds.cache.forEach(async (guild) => { // member on any guild
            guild.members.cache.forEach(async (member) => {
                let user = member.user;
                member.roles.cache.forEach(async (memberRole) => {
                    if (memberRole.name == 'Member') {
                        memberArr.push(member.id); // just id
                    }
                })
            })
        //})

        // all accounts
        var easy = await chc.listAccounts();
        var keys = [], vals = []
        for (var key in easy) {
            
            if ((key.match(/^[0-9]+$/) != null) && (key.length === 18)) {
                var found = memberArr.includes(key);
                if (!found) // not a current member
                {
                    var nonZeroAmt = easy[key];
                    if (nonZeroAmt > 0) {
                        keys.push(key)
                        vals.push(easy[key])
                    }
                }
            }
        }

        // convert valid members to string for display
        var membersDisplay = "";

        // move
        for (var i = 0; i < keys.length; i++) //
        {
            var reclaimAmt = vals[i];
            var id = keys[i];
            if (reclaimAmt > 0) {
                let moveresult = await chc.move(id, "megasoak", reclaimAmt, 1, "reclaim");
                if (moveresult == "false") {
                    console.log(keys[i] + " move fail, result false");
                }
                membersDisplay += `<@${id}> donated ${reclaimAmt}\n`;
            }
        }
        //console.log(membersDisplay)
        // message
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setDescription(`:cheese: <@${message.author.id}> reclaimed from ${keys.length} non members.  Donations will be transferred to the megasoak pot.\n ${membersDisplay} \n:cheese:`)
            .setTimestamp()
            .setFooter('\u00A9 ' + global.gConfig.bot.name, global.gConfig.bot.iconurl);

        message.channel.send({ embeds: [exampleEmbed] });
        return;
	}
	catch (err) {
		throw new Error(err.message)
	}
}

function callback(elmnt, index, array) {
	console.log(`${elmnt.id}`);
}

module.exports.help = {
    name:"reclaim"
}
