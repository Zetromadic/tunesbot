const distube = require('distube');
 
module.exports = {
    name: 'play',
    description: 'Joins and plays a video from youtube',
    async execute(message, args) {
        
        if(!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command!')

        const music = args.join(" ");

        client.distube.play(message, music)

    }
}