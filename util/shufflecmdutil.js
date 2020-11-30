module.exports = {
    canModifyQueue(member) {
      const { channelID } = member.voice;
      const botChannel = member.guild.voice.channelID;
  
      if (channelID !== botChannel) {
        member.send("You need to join the voice channel first!").catch(console.error);
        return;
      }
  
      return true;
    }
  };
  