const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");


module.exports = {
    info: {
        name: "disconnect",
        aliases: ["goaway", "leave", "dc"],
        description: "Leave the current voice channel!",
        usage: "",
    },

    run: async function (client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel) return sendError("You need to be in a voice channel to play!", message.channel);
        if (!message.guild.me.voice.channel) return sendError("I'm not in any voice channel!", message.channel);

        try {
            await message.guild.me.voice.channel.leave();
        } catch (error) {
            await message.guild.me.voice.kick(message.guild.me.id);
            return sendError("Trying To Leave The Voice Channel...", message.channel);
        }

        const Embed = new MessageEmbed()
            //.setAuthor()
            .setColor("GREEN")
            .setTitle("Success")
            .setDescription(":notes: The player has stopped and the queue has been cleared.")
            .setTimestamp();

        return message.channel.send(Embed).catch(() => message.channel.send(":notes: The player has stopped and the queue has been cleared."));
    },
};