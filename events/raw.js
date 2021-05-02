module.exports = (client, data) => {
  //What is data? Discord Gateway Data, Please check discord api docs
  client.Manager.updateVoiceState(data);
};
