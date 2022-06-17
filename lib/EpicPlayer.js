const { Message } = require("discord.js");
const { Structure } = require("erela.js");

Structure.extend(
  "Player",
  (Player) =>
    class extends Player {
      constructor(...props) {
        super(...props);
        this.twentyFourSeven = false;
      }

      /**
       * Sets the resume message as a property of the player so it can be fetched on pause
       * @param {Message} message
       */
      setResumeMessage(message) {
        if (this.pausedMessage) this.pausedMessage.delete();
        return (this.resumeMessage = message);
      }

      /**
       * Sets the pasued message as a property of the player so it can be fetched on resume
       * @param {Message} message
       */
      setPausedMessage(message) {
        if (this.resumeMessage) this.resumeMessage.delete();
        return (this.pausedMessage = message);
      }

      /**
       * Sets now playing message for deleting next time
       * @param {Message} message
       */
      setNowplayingMessage(message) {
        if (this.nowPlayingMessage) this.nowPlayingMessage.delete();
        return (this.nowPlayingMessage = message);
      }
    }
);
