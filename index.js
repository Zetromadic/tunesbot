const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.token;

const PREFIX = '-';

const cheerio = require ('cheerio');
const request = require('request');
const ytdl = require('ytdl-core');

var version = '0.0.1';

var servers = {};

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
            .setColor('0xb99dfa')
            .addField('-play', 'Followed by a song you would liked played while in a voice chat!')
            .addField('-skip', 'This will skip the song that is playing!')
            .addField('-stop', 'This will stop the queue of songs!')
            .addField('-info', 'Followed by "Ping", "Uptime", or "Version"')

            message.channel.send(helpEmbed);

        break;

        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("finish", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else{
                        connection.disconnect();
                    }
                })
            }
        
            if(!args[1])
            {
                message.channel.send("You need to provide a link to a song!");
            }

            if(!message.member.voice.channel){
                message.channel.send("You must be in a voice channel to play a song!");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);
            })

        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
        break;

        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voice.connection){
                for(var i = server.queue.length -1; i >=0; i--){
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end;
                console.log('stopped the queue');
            }

            if(message.guild.connection) message.guild.voice.connection.disconnect();
        break;
    }

})

client.login(token);