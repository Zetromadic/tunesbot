const Discord = require("discord.js")
const Client = new Discord.Client();

const token = process.env.token;

const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;

client.on("ready", () => {
    console.log("I'm ready !");
});
 
client.on("message", async (message) => {
 
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
 
    // !play Despacito
    // will play "Despacito" in the member voice channel
 
    if(command === "play"){
        client.player.play(message, args[0], message.member.user);
        // as we registered the event above, no need to send a success message here
    }
 
});

client.login(token);