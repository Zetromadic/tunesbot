const distube = require('distube');

module.exports = {
    name: 'stop',
    description: 'Stops the bot and leaves the channel',
    async execute(message, args) {
        
        if(!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command!')

        if(queue)
        {
            client.distube.stop(message)

            message.channel.send('DONE!')
        }
        else (!queue)
        {
            return
        };

    }
}