const Discord = require('discord.js');
const client = new Discord.Client();
const distube = require('distube');

client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });
client.distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))

//const token = process.env.token;
const token = 'NzgxMDM1MzEyNDM1NjkxNTgy.X73x0Q.2AMQj8uxFe8h_GvHuzaAwPI6UrA';

const PREFIX = '-';

const cheerio = require ('cheerio');
const request = require('request');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

var version = '0.0.1';

const fs = require('fs');
var schedule = require('node-schedule');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('This bot is online!')
    client.user.setActivity('-help | -play', { type: 'PLAYING'}).catch(console.error);
})

client.on('message', message=> {

    if(!message.content.startsWith(PREFIX)) return;
    let args = message.content.substring(PREFIX.length).split(" ");

    const command = args.shift().toLowerCase();


    if(command === 'play'){
        client.commands.get('play').execute(message, args);
    }else if(command === 'stop'){
        client.commands.get('stop').execute(message, args);
    }

});

client.login(token);