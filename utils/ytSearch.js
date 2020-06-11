const axios = require("axios");
const cheerio = require("cheerio");

const YouTube = require("simple-youtube-api");
const youtube = new YouTube("AIzaSyC9wP9rVzyoeAt0EFNZmYmz0jPlpaCfhtg");

const parseDuration = (string) => {
  const units = string.split(":").reverse();
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  while (units.length) {
    if (!seconds) seconds = parseInt(units.shift());
    else if (!minutes) minutes = parseInt(units.shift());
    else if (!hours) hours = parseInt(units.shift());
  }
  minutes += hours * 60;
  seconds += minutes * 60;
  return seconds;
};

// old method, doesn't work most of the time
// const search = async (query) => {
//   let response;
//   let song = {};
//   try {
//     response = await axios.get(
//       `https://www.youtube.com/results?search_query=${query}`,
//       {
//         // headers: {
//         //   "User-Agent":
//         //     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
//         //   "x-youtube-client-name": "1",
//         //   "x-youtube-client-version": "2.20191008.04.01",
//         //   "x-youtube-page-cl": "276511266",
//         //   "x-youtube-page-label": "youtube.ytfe.desktop_20191024_3_RC0",
//         //   "x-youtube-utc-offset": "0",
//         //   "x-youtube-variants-checksum": "7a1198276cf2b23fc8321fac72aa876b",
//         //   "accept-language": "en",
//         // },
//       }
//     );
//   } catch (err) {
//     response = err.response;
//   }
//   if (
//     response.status === 200 ||
//     response.status === 203 ||
//     response.status === 206
//   ) {
//     const html = response.data;
//     require("fs").writeFileSync("oof.html", html);
//     const $ = cheerio.load(html);

//     const results = $(".yt-lockup").toArray();
//     for (const resultElement of results) {
//       const result = $(resultElement);
//       if (!result.find(".standalone-ypc-badge-renderer-label").length) {
//         const durationElement = result.find("[class^=video-time]").first();
//         const contentElement = result.find(".yt-lockup-content").first();
//         const videoId = result.attr("data-context-item-id");

//         if (durationElement && contentElement && videoId) {
//           song.videoId = videoId;
//           song.url = `https://www.youtube.com/watch?v=${videoId}`;
//           const titleElement = contentElement.find(".yt-lockup-title");
//           if (titleElement) {
//             song.title = titleElement.find("a").first().text();
//           }
//           const bylineElement = contentElement.find(".yt-lockup-byline");
//           if (bylineElement) {
//             song.author = bylineElement.find("a").first().text();
//           }
//           song.duration = durationElement.text();
//           song.durationSeconds = parseDuration(durationElement.text());
//           const metaElement = contentElement.find(".yt-lockup-meta");
//           if (metaElement) {
//             song.ago = metaElement
//               .find(".yt-lockup-meta-info li")
//               .first()
//               .text();
//             song.views = parseInt(
//               metaElement
//                 .find(".yt-lockup-meta-info li")
//                 .eq(1)
//                 .text()
//                 .replace(" views", "")
//                 .replace(/,/g, "")
//             );
//           }
//           return song;
//         }
//       }
//     }
//   }
// };

const search = async (query, limit) => {
  return await youtube.searchVideos(query, limit);
};

module.exports.parseDuration = parseDuration;
module.exports.search = search;
module.exports = search;
