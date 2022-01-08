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
       * Sets now playing message for deleting next time
       * @param {Message} message
       */
      setNowplayingMessage(message) {
        if (this.nowPlayingMessage && !this.nowPlayingMessage.deleted)
          //Message#Deleted is deprecated soon
          this.nowPlayingMessage.delete();
        return (this.nowPlayingMessage = message);
      }
    }
);
