const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info: {
        name: "leave",
        aliases: ["goaway", "disconnect"],
        description: "Leave The Voice Channel!",
        usage: "Leave",
    },

    run: async function (client, message, args) {
        const Channel = message.member.voice.channel;

        if (!Channel) return sendError("Please Join A Voice Channel!", message.channel);

        if (!message.guild.me.voice) return sendError("I Am Not In Any Voice Channel!", message.channel);

        try {
            await message.guild.me.voice.channel.leave();
        } catch (error) {
            await message.guild.me.voice.channel.leave();
            return sendError("Trying To Leave The Voice Channel...", message.channel);
        }

        const Embed = new MessageEmbed()
            .setAuthor("Success Leave Voice Channel", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
            .setColor("GREEN")
            .setDescription("Left The Voice Channel.")
            .setTimestamp();

        return message.channel.send(Embed).catch(() => message.channel.send("Left The Voice Channel"));
    },
};
