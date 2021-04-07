module.exports = async (client) => {
  console.log(`[API] Logged in as ${client.user.username}`);
let statuses = [
            `This Is status 1`,
            `This Is status 2`,
            `This Is status 3`
        ]
        setInterval(() => {
            let status = statuses[Math.floor(Math.random() * statuses.length)]
            client.user.setActivity(status, {
                type: 'LISTENING', //can be LISTENING, WATCHING, PLAYING, STREAMING
            });
        }, 60000) // I really don't recommend Lowering this It could get you in trouble
    }
