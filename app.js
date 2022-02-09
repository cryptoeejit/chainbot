const config = require("./config.json");
const token = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"] });
bot.commands = new Discord.Collection();

global.gConfig = config;

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = require(`./commands/${file}`)
    console.log(`${file} loaded`)
    bot.commands.set(props.help.name, props)
}

//When a member join add a role called Member to them and welcome them in a channel welcome
bot.on('guildMemberAdd', member => {
    //Log the newly joined member to console
    console.log('User' + member.user.tag + ' has joined the server!');
});

//Playing Message
bot.on("ready", async () => {
    //Log Bot's username and the amount of servers its in to console
    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers! total of ${bot.users.cache.size} users.`);
    bot.user.setActivity(`tipping on ${bot.guilds.cache.size} servers!`, { type: "PLAYING" });
    
});

//Command Manager
bot.on("messageCreate", async message => {

    try {
        //Check if author is a bot or the message was sent in dms and return
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        //get prefix from config and prepare message so it can be read as a command
        let prefix = config.prefix;
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);

        //Check for prefix
        if (!cmd.startsWith(config.prefix)) return;

        //Get the command from the commands collection and then if the command is found run the command file
        let commandfile = bot.commands.get(cmd.slice(prefix.length));
        if (commandfile) commandfile.run(bot, message, args);
    }
    catch (err) {
        console.error(err.message)
    }
});

process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
});


//bot.on('interactionCreate', async interaction => {
//    if (!interaction.isCommand()) return;

//    const command = client.commands.get(interaction.commandName);

//    if (!command) return;

//    try {
//        await command.execute(interaction);
//    } catch (error) {
//        console.error(error);
//        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
//    }
//});

//Token needed in token.json
bot.login(token.token);

