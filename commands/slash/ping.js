const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("ping")
  .setDescription("View the bot's latency")
  .setRun(async (client, interaction, options) => {
  const embed1 = new MessageEmbed()
            .setDescription("🏓 | Fetching ping...")
            .setColor("#6F8FAF")

        let msg = await interaction.reply({
            embeds: [embed1]
        })

        let ping = ${Date.now() - message.createdTimestamp}

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        let zap = "⚡"

        let green = "🟢"

        let red = "🔴"

        let yellow = "🟡"

        var color = zap;
        var color2 = zap;

        let cPing = Math.round(client.ws.ping)

        if (cPing >= 40) {
            color2 = green;
        }

        if (cPing >= 200) {
            color2 = yellow;
        }

        if (cPing >= 400) {
            color2 = red;
        }

        if (ping >= 40) {
            color = green;
        }

        if (ping >= 200) {
            color = yellow;
        }

        if (ping >= 400) {
            color = red;
        }

        let info = new MessageEmbed()
            .setTitle("🏓 | Pong!")
            .addField("API Latency", `${color2} | ${cPing}ms`, true)
            .addField("Message Latency", `${color} | ${ping}ms`, true)
            .addField("Uptime", `⏲️ | ${duration}`, true)
            .setColor("#6F8FAF")
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
            iconURL: (message.author.avatarURL())}
            );
        msg.edit({ embeds: [info] })

    }
});
  }
