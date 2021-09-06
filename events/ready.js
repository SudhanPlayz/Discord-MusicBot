module.exports = async (client,message,args) => {
  
  const custom_status = "false"; //make it true If you want Custom status
  
  if(custom_status==="true"){//you can add or remove activities from the array as per your wish
  const array = [
    {
      name: ">help",
      type: "LISTENING"
    },
    {
      name:  "Music For "+client.users.cache.size+" users" ,//client.users.cache.size extracts number of bot users ;-;
      type: "PLAYING"
    },
  
    { 
      name: ""+client.guilds.cache.size+" Servers!",//client.guilds.cache.size extracts number of guilds the bot is in
      type: "WATCHING"
    }
  ]
    setInterval(() => {
      function presence(){
        client.user.setPresence({
          status: "online",
          activity: array[Math.floor(Math.random() * array.length)]
        });
      }
      presence();
    }, 10000)//the time is in milli-seconds so in this case, the status will change in 10 seconds interval, you can change it if you want but dont keep it less than 5 seconds cause that might rate-limit.
  }
  else{//change your status here if you want a single status
     client.Ready = true, 
  client.user.setPresence({
    status: "online",  // You can show online, idle, and dnd
    activity: {
        name: "Music",  // The message shown
        type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING,
    }
});
    
  
  }
    client.Manager.init(client.user.id);
    client.log("Successfully Logged in as " + client.user.tag); // You can change the text if you want, but DO NOT REMOVE "client.user.tag"
client.RegisterSlashCommands();
};
