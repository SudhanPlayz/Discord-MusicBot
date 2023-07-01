/**
 * /servers route
 * returns the servers the bot is in
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("../../../lib/Bot")} bot
 */
module.exports = (req, res, bot) => {
	const id = req.query.id;
	if (id) {
		const guild = bot.guilds.cache.get(id);
		if (!guild) return res.status(404).json({ error: "Server not found" });

		return res.status(200).json({
			id: guild.id,
			name: guild.name,
			icon: guild.iconURL(),
			owner: guild.ownerId,
			roles: guild.roles.cache.map(role => ({
				id: role.id,
				name: role.name,
				color: role.hexColor,
			})),
			channels: guild.channels.cache.map(channel => ({
				id: channel.id,
				name: channel.name,
				type: channel.type,
				parent: channel.parentId,
			})),
			members: guild.members.cache.map(member => ({
				id: member.id,
				username: member.user.username,
				discriminator: member.user.discriminator,
				avatar: member.user.avatarURL(),
				roles: member.roles.cache.map(role => role.id),
			})),
			player: {
				queue: bot.manager.Engine.players.get(guild.id)?.queue.map(track => ({
					title: track.title,
					author: track.author,
					duration: track.duration,
				})),
				playing: {
					title: bot.manager.Engine.players.get(guild.id)?.queue.current?.title,
					author: bot.manager.Engine.players.get(guild.id)?.queue.current?.author,
					duration: bot.manager.Engine.players.get(guild.id)?.queue.current?.duration,
				}
			}
		});
	}

	res.status(200).json({
		servers: bot.guilds.cache.map(guild => ({
			id: guild.id,
			name: guild.name,
			icon: guild.iconURL(),
		})),
	});
}