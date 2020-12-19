const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.token;

const PREFIX = '-';

const cheerio = require ('cheerio');
const request = require('request');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

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
            .addField('-stop', 'This will stop the queue of songs!')
            .addField('-info', 'Followed by "Ping", "Uptime", or "Version"')

            message.channel.send(helpEmbed);

        break;

        case 'play':

            const voiceChannel = message.member.voice.channel;

            if(!voiceChannel) return message.channel.send('You must be in a voice channel to use this command!');
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if(!permissions.has('CONNECT')) return message.channel.send('You do not have the correct permissions to use this command!');
            if(!permissions.has('SPEAK')) return message.channel.send('You do not have the correct permissions to use this command!');
            if(!args.length) return message.channel.send('You need to send the second argument!');

            const validURL = (str) =>{
                var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
                if(!regex.test(str)){
                    return false;
                } else {
                    return true;
                }
            }

            if(validURL(args[0])){
 
                const  connection = await voiceChannel.join();
                const stream  = ytdl(args[0], {filter: 'audioonly'});
     
                connection.play(stream, {seek: 0, volume: 1})
                .on('finish', () =>{
                    voiceChannel.leave();
                    message.channel.send('leaving channel');
                });
     
                await message.reply(`:thumbsup: Now Playing ***Your Link!***`)
     
                return
            }
            
            const connection = await voiceChannel.join();

            const videoFinder = async(query) => {
                const videoResult = await ytSearch(query);

                return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }
            
            const video = await videoFinder(args.join(''));

            if(video){
                const stream = ytdl(video.url, {filter: 'audioonly'});
                connection.play(stream, {seek: 0, volume: 1})
                .on('finish', () =>{
                    voiceChannel.leave();
                })

                await message.reply(`:thumbsup: Now Playing ***${video.title}***`)
            }
            else{
                message.channel.send('No video results found');
            }
            

        break;

        case 'skip':
            
        break;

        case 'stop':
            const voiceChannel = message.member.voice.channel;

            if(!voiceChannel) return message.channel.send('You must be in a voice channel to use this command!');
            await voiceChannel.leave();
            await message.channel.send('Leaving channel :smiling_face_with_tear:');
        break;
    }

})

client.login(token);