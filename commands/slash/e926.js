const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed, MessageAttachment } = require("discord.js");

const fetchData = require("../utils/utils.js");

const e926ICON =
  "https://cdn.discordapp.com/attachments/1125098716886474802/1165536799666475008/e926Logo_1_10.png?ex=654735bb&is=6534c0bb&hm=acb5ceb6cfa4878103029119378e7c4019a22051d5f4be31ddbbbfd297cf444d&";

const e926404 = "https://img.lovepik.com/element/40021/7866.png_1200.png";

const limitFavCount = 100;

function getValue(obj, key) {
  const value = obj?.[key];
  if (!value || value === undefined || value === null) return "N/A";
  if ((Array.isArray(value) && value.length === 0)) return ["N/A"];
  return value;
}

// const funnyPhrase = [
//   "Rawr X3"
//   "*nuzzles* How are you?" 
//   "*pounces on you* you're so warm o3o" 
//   "*notices you have a bulge* someone's happy!" 
//   "*nuzzles your necky wecky* ~murr~ hehe ;)" 
//   "*rubbies your bulgy wolgy* you're so big!" 
//   "*rubbies more on your bulgy wolgy* it doesn't stop growing .///. "
//   "*kisses you and licks your neck* daddy likes ;)" 
//   "*nuzzle wuzzle* I hope daddy likes" 
//   "*wiggles butt and squirms* I wanna see your big daddy meat!" 
//   "*wiggles butt* I have a little itch o3o *wags tails* can you please get my itch? "
//   "*put paws on your chest* nyea~ it's a seven inch itch *rubs your chest* can you pwease? *squirms* pwetty pwease? :( I need to be punished "
//   "*runs paws down your chest and bites lip* like, I need to be punished really good "
//   "*paws on your bulge as I lick my lips* I'm getting thirsty. I could go for some milk" 
//   "*unbuttons your pants as my eyes glow* you smell so musky ;) "
//   "*licks shaft* mmmmmmmmmmmmmmmmmmm so musky ;) "
//   "*drools all over your cawk* your daddy meat. I like. Mister fuzzy balls. "
//   "*puts snout on balls and inhales deeply* oh my gawd. I'm so hard "
//   "*rubbies your bulgy wolgy* *licks balls* punish me daddy nyea~" 
//   "*squirms more and wiggles butt* I9/11 lovewas an yourinside muskyjob goodness" 
//   "*bites lip* please punish me *licks lips* nyea~" 
//   "*suckles on your tip* so good" 
//   "*licks pre off your cock* salty goodness~" 
//   "*eyes roll back and goes balls deep*"
// ]


const command = new SlashCommand()
  .setName("e926")
  .setDescription("Search on e926 for a random image")
  .addStringOption(
    (option) => option.setName("query").setDescription("add tags to search")
    // .setRequired(true)
  )
  .setRun(async (client, interaction) => {
    const search = interaction.options.getString("query") || "";
    console.log("UserSearch: " + search);

    // const BASE_URL = `https://e926.net/posts.json?tags=${search}+order:random+favcount:>${limitFavCount}+-filetype:swf&limit=1`;

    const BASE_URL = `https://e926.net/posts.json?tags=${search}+order:random+favcount:>${limitFavCount}&limit=1`;

    const data = (await fetchData(BASE_URL)).posts[0];
    if (data === undefined) {
      return await interaction.reply({
        embeds: [
          new MessageEmbed().setDescription(
            "no result, please try a different tag"
          ),
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply({ephemeral: true});

    console.log(data);
    console.log(data.file);
    console.log(data.tags);
    console.log(data.description);
    console.log(getValue(data.preview, "url"));
    console.log(data.fav_count);
    try {
      const maxLength = 1000;

      var descriptionStr =
        `Description: \n${ getValue(data, "description")}`;
      if (descriptionStr.length > maxLength) {
        descriptionStr = descriptionStr.slice(0, maxLength - 3) + "...";
      }

      var tags_string = getValue(data.tags, "general").join(", ");
      if (tags_string.length > maxLength) {
        tags_string = tags_string.slice(0, maxLength - 3) + "...";
      }

      console.log("-----");
      console.log("test:   " + getValue(data.tags, "copyright"))
      console.log("title: " + (search || "RANDOM"));
      console.log("des: " + descriptionStr);
      console.log("ID: " + getValue(data, "id"));
      console.log("create: " + getValue(data, "created_at"));
      console.log("update: " + getValue(data, "updated_at"));
      console.log("score: " + getValue(data, "score"));
      console.log("rating: " + getValue(data, "rating"));
      console.log("prev_link: " + getValue(data.preview, "url") || e926404);
      console.log("artist" + getValue(data.tags, "artist").join(" |"));
      console.log("copyright: " + getValue(data.tags, "copyright").join(", "));
      console.log("character: " + getValue(data.tags, "character").join(", "));
      console.log("species: " + getValue(data.tags, "species").join(", "));
      console.log("Width: " + getValue(data.file, "width"));
      console.log("height: " + getValue(data.file, "height"));
      console.log("ext: " + getValue(data.file, "ext"));
      console.log("size: " + getValue(data.file, "size"));
      console.log("tags: " + tags_string);
      console.log("source: " + getValue(data, "sources").join("\n"));
      console.log("-----");

      // console.log(interaction.user);
      // console.log(interaction.member);
      // console.log(
      //   interaction.user.displayAvatarURL({ format: "png", dynamic: true })
      // );

      const e926EmbedIntro = new MessageEmbed()
        .setTitle(
          `[${
            interaction.member.nickname || interaction.user.username
          }] wants to find a <${search || "RANDOM"}> image on e926 *notices your bulge* UwU What's This?`
        )
        .setAuthor({ name: "e926", iconURL: e926ICON, proxyIconURL: e926ICON })
        // .setImage(getValue(data.file, "url"))
        .setDescription(`\`\`\`yml\n${ descriptionStr }\`\`\``)
        .setColor(client.config.embedColor)
        .setThumbnail(
          interaction.user.displayAvatarURL({ format: "png", dynamic: true })
        );

      const e926EmbedMeta = new MessageEmbed()
        .setThumbnail(getValue(data.preview, "url") != "N/A" ? getValue(data.preview, "url") : e926404)
        .setFields([
          {
            name: "Meta",
            value: `\`\`\`yml\nID: ${getValue(
              data,
              "id"
            )}\nCreated At: ${getValue(
              data,
              "created_at"
            )}\nUpdated At: ${getValue(data, "updated_at")}\nScore:  🔼${
              getValue(data, "score").up
            } | 🔽 ${getValue(data, "score").down} | 📈 ${
              getValue(data, "score").total
            } | ❤️: ${getValue(data, "fav_count")} \nRating: ${getValue(
              data,
              "rating"
            )}\`\`\``,
            inline: false,
          },
          {
            name: `Artists & Characters`,
            value: `\`\`\`yml\nArtist: ${getValue(data.tags, "artist").join(
              " |"
            )}\nCopyright: ${getValue(data.tags, "copyright").join(
              ", "
            )} \nCharacter: ${getValue(data.tags, "character").join(
              ", "
            )} \nSpecies: ${getValue(data.tags, "species").join(", ")} \`\`\``,
            inline: true,
          },
          {
            name: `File`,
            value: `\`\`\`yml\nWidth: ${getValue(
              data.file,
              "width"
            )}\nHeight: ${getValue(
              data.file,
              "height"
            )} \nExtension: ${getValue(data.file, "ext")} \nSize: ${getValue(
              data.file,
              "size"
            )} \`\`\``,
            inline: true,
          },
        ]);
      const e926EmbedTags = new MessageEmbed()
        .setColor("NOT_QUITE_BLACK")
        .setFields([
          {
            name: "Tags",
            value: `\`\`\`yml\n${tags_string}\`\`\``,
            inline: false,
          },
        ]);

      const e926EmbedSource = new MessageEmbed().setFields([
        {
          name: `Sources`,
          value: `\n${getValue(data, "sources").join("\n")}`,
          inline: false,
        },
      ]);

      const imgURL = getValue(data.file, "url") === "N/A" ?  e926404 : getValue(data.file, "url")

      const e926Attach = new MessageAttachment()
        .setFile(imgURL)
        .setName(
          `SPOILER_IMG_${ imgURL.split("/").pop() }.${getValue(data.file, "ext") != "N/A" ? getValue(data.file, "ext") : "jpg"}`
        );

      return await interaction.editReply({
        embeds: [e926EmbedIntro, e926EmbedMeta, e926EmbedTags, e926EmbedSource],
        files: [e926Attach],
        ephemeral: false,
      });
    } catch (e) {
      console.log(e);
      return await interaction.editReply({
        embeds: [
          new MessageEmbed().setDescription(
            "something went wrong, please try again later"
          ),
        ],
        ephemeral: true,
      });
    }
  });

module.exports = command;
