const distube = require('distube');

module.exports = {
    name: 'skip',
    description: 'Skips the song that is playing',
    async execute(message, args) {
        
        if(!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command!')

        if(queue)
        {
            client.distube.skip(message)

            message.channel.send('DONE!')
        }
        else (!queue)
        {
            return
        };

    }
}