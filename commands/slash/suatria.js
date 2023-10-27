const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const nodefetch = require("node-fetch");

const fetchData = require("../utils/utils.js");

const imageURLList = [
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166412902220181514/suatria_tyler_bee_poo.png?ex=654a65aa&is=6537f0aa&hm=0eec2062570a21c90053d802481c40522a988e4bb2e5c1f5eeff36c61949a4c8&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166412936017879231/garruvex_fat_purple_corgi_in_the_style_of_among_us_f6a13a04-6ba6-432b-8da1-8caaf00c138c.png?ex=654a65b2&is=6537f0b2&hm=b66b0cc3d10fbb40969225827f4c79b0ddc85ee36cdad56059f0bc9b10171e96&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413085574189136/Amogus_suatria00.gif?ex=654a65d6&is=6537f0d6&hm=2c6aa5f1166c29ff0391028b283c355e04766e994e9eb2499d76f2540c676b28&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413189785845770/IMG_7066.jpg?ex=654a65ef&is=6537f0ef&hm=0fb2b10b69743ca10189d68e769bb85590c5aa8090dfa88629cc02b1373e980f&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413225521328199/download_3.jpg?ex=654a65f7&is=6537f0f7&hm=be0fca3b1a75ec10cf6b051fcd0597a812f93c752d0b56932dd4819dcfd7bcb9&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413237835800576/puppy1.png?ex=654a65fa&is=6537f0fa&hm=43120fbfbcccfd24c5dc3fcf36d3a195dd1e8c355ac65e05af77a730ce5b898f&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413261135151135/sautria_meme.png?ex=654a6600&is=6537f100&hm=34733d1f0285bbb5f02e02c7bc82478abbf4b906f2b66d95a25adc41b40015f5&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413328470519888/fosona2.png?ex=654a6610&is=6537f110&hm=942dafed5b27527e7e5c1c98433635741833de185cbb010e4cebd87e278a6356&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413343981047808/01Suatriafursona3.png?ex=654a6614&is=6537f114&hm=95853a14f9dc6db0e305aff9378f1b5a76b0cdff99dbd67769757b72d7376265&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413354986897518/dc91b588-dc5e-4a66-94a5-b65479740c67.png?ex=654a6616&is=6537f116&hm=46f766f027a8593d1d18295f0dbebb68baf7a7dedbdfaf99f89df56d44f78d4c&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413526378754078/IMG_3074.JPG?ex=654a663f&is=6537f13f&hm=72b7dcb42c06ee991cb0b59ad5aec77bdd74667074bcd36ed93ffc3b076cc5ad&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413566132359259/Woof_squidward_small.png?ex=654a6649&is=6537f149&hm=155e709a68a89454ce1a14a70c3a0e4ec5f8a5096057c63b55a68aac7cedd764&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413574135095406/suatria3.png?ex=654a664a&is=6537f14a&hm=76d7d213c5df09672c04a3a7765a05177c6f68977e29a4fa30c42e06c068e242&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166413587745615942/7.4_1.png?ex=654a664e&is=6537f14e&hm=0b9a34f34be43cfdc949ca69754a0d59e238ae360857c5fca000a1c5ac1b2222&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415463518060544/FyFVdLTaUAAy5jT.jpg?ex=654a680d&is=6537f30d&hm=93d935e5f91d4594d6d5077822dc501f56803ed10aa347555869d03ef4020031&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415472011513886/FO3BGnnVUAAo_UG.png?ex=654a680f&is=6537f30f&hm=703a6ca3961f6fa1e561d117b07aa63acde899fea1345302e1f59a4b6341bb61&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415474129645588/FSVLJJ6VsAI1i2h.jpg?ex=654a680f&is=6537f30f&hm=74aabadd7fae8c21cb75fd8b64c90692711b53c3b9389dc65978fefcf5a86e0a&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415479980703796/FHnuSEZaAAQYfzp.jpg?ex=654a6811&is=6537f311&hm=8acac69fd40c33b5c7e8f15dc330f157f8cbae50bb46e1db8f548334f559a707&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415484703473674/FC3h-foaQAA7626.jpg?ex=654a6812&is=6537f312&hm=8f0e8153429ee8fa1f46b6804895cf7bd23bea60d6f1152c0ae8142065ede32e&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415489724076182/FAYoJ15VQAM9UDx.jpg?ex=654a6813&is=6537f313&hm=40b1028d745bcc5e2ffbf1dc6e70846515d772315b2a16be96d9e03651b1e91c&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415494685933678/E7JOT1rUcAwc36_.jpg?ex=654a6814&is=6537f314&hm=9d1d0e9c4ea97208b0f8f3946719f490282dc9e71d0a59c4f23b999439587511&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415501543604346/E0Incp5VIAEXwDA.jpg?ex=654a6816&is=6537f316&hm=86772644c1c1d1dd59fca36b04aa77300718fa6b50e019ae781f190056ad4d62&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415506262208532/EkOXoNbUwAA_qqV.png?ex=654a6817&is=6537f317&hm=b6a537b0307eb75caa8bc4e21659eba99c7687f877162066d86331bc6c887db9&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415510691393536/Ee9n93gUcAEK4fD.jpg?ex=654a6818&is=6537f318&hm=f0e0fb34cab5f4ca3f874ff29e423d5b53d4c4c5a7f386adff816663a714f844&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415515766493234/Ed5V6N_VoAIsqiQ.jpg?ex=654a6819&is=6537f319&hm=d0664dce096e7fc388f90374ec3fbf4ac2bd81956ba4e847de5452aec844eaf9&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415528101949481/EdW85vrUMAAmDmQ.jpg?ex=654a681c&is=6537f31c&hm=81eac3f72e549dc7d36db42431e4e7372537d355fc532b411512f4ce61c8a6fa&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415532124291072/EW749OBX0AE_JOn.png?ex=654a681d&is=6537f31d&hm=10d2d3868b1886a200369eaa815a0af1aeadc761345c4085d24c072c0ad4bc06&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415536243089500/ESJjpR8UUAAHSKk.jpg?ex=654a681e&is=6537f31e&hm=c83d4c6c7e78e48b6ff323be6f0d2954c65afdb54afe9321d6127ebdad182e13&",
  "https://cdn.discordapp.com/attachments/1166412844183605320/1166415556207988928/EPsGc28VUAIkpoL.jpg?ex=654a6823&is=6537f323&hm=b44c189ebbcdfa8593d2bccecec75510e3c014922d9c004806e5fe03d1e65ca9&",
];

const baseURL = "https://some-random-api.com/canvas/misc/namecard"; // Replace with the actual API endpoint.

function getRandomElement(inputArray) {
  const randomIndex = Math.floor(Math.random() * inputArray.length);
  return inputArray[randomIndex];
}

async function fetchImage(url) {
  try {
    const response = await fetch(url);
    console.log(response.text());
    const data = await response.json();

    // Use 'data' here outside of the fetch block but still inside the async function
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const command = new SlashCommand()
  .setName("suatria")
  .setDescription("Get a random image of suatria")
  .setRun(async (client, interaction) => {
    // const data = await fetchData("https://some-random-api.com/animal/raccoon");

    try {
      console.log("start /suatria");

      // avatar = interaction.user.displayAvatarURL({
      //   format: "png",
      //   dynamic: true,
      // });

      await interaction.deferReply({ ephemeral: false });

      const statsEmbed = new MessageEmbed()
        .setTitle("🐾🐕‍🦺🍇")
        .setImage(getRandomElement(imageURLList))
        // .setImage(url.href)
        .setDescription(`💜💜💜`)
        .setFooter({ text: "狼敖大大 -> https://twitter.com/WolfAustria " });
      return interaction.editReply({ embeds: [statsEmbed], ephemeral: false });
    } catch (e) {
      console.log(e);
    }
  });

module.exports = command;
