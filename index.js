const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.token;

const PREFIX = '-';

const { Player } = require("discord-player");
const Player = new Player(client);
client.player = player;

var version = '0.0.3';

const fs = require('fs');
var schedule = require('node-schedule');

const ms = require('ms');
var profanitites = require('profanities');

client.on('ready', () => {
    console.log('This bot is online!')
    client.user.setActivity('-help | -play', { type: 'PLAYING'}).catch(console.error);
})

client.on('message', message=> {

    if(!message.content.startsWith(PREFIX)) return;
    let args = message.content.substring(PREFIX.length).split(" ");


    switch(args[0]){

       
        case 'info':
            if(args[1] === 'version'){
                message.delete();
                message.channel.send('Version ' + version)
            }
            else if(args[1] === 'ping')
            {

                message.channel.send("Pinging...").then(m => {
                    let ping = m.createdTimestamp - message.createdTimestamp
                    
                    m.edit(`Bot Latency: \`${ping}\``)
                })

                message.delete();
            }
            else if(args[1] === 'uptime')
            {
                message.delete();

                function duration(ms)
                {
                    const sec = Math.floor((ms/1000) % 60).toString()
                    const min = Math.floor((ms / (1000 * 60)) % 60).toString()
                    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
                    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
                    return `${days.padStart(1, '0')} days, ${hrs.padStart(2, '0')} hours, ${min.padStart(2, '0')} mintues, ${sec.padStart(2, '0')} seconds,`
                }

                message.channel.send(`Uptime: ${duration(client.uptime)}`)

            }
            else{
                message.delete();
                message.reply('Please follow with "uptime", "ping", or "version"')
            }
        break;

        case 'help':
        
            message.delete();

            let helpEmbed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setColor('0x00FFC7')
            .addField('-play', 'Followed by a song you would liked played while in a voice chat!')
            .addField('-skip', 'This will skip the song that is playing!')
            .addField('-stop', 'This will stop the queue of songs!')
            .addField('-info', 'Followed by "Ping", "Uptime", or "Version"')

            message.channel.send(helpEmbed);

        break;

        case 'play':

            let track = await client.player.play(message.member.voice.channel, args[0], message.member.user.tag);
            message.channel.send(`Playing ${track.name}! - Requested by ${track.requestedBy}`);

        break;

        case 'skip':
            
        break;

        case 'stop':
           let track = await client.player.stop(message.guild.id);
           message.channel.send(`STOPPED`);
        break;
    }

})

client.login(token);