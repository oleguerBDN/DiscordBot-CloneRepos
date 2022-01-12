const { Client, Intents } = require("discord.js");
const config = require("./config.json");
const shell = require("shelljs");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", (msg) => {
  let channel = msg.guild.channels.cache.get(msg.channelId);
  let category = msg.guild.channels.cache.get(channel.parentId);
  let message = msg.content;
  const gitLink = getGitLink(message);
  const pathToCopy =
    "C:/Users/User/Desktop/StudentsChallenges/" +
    category.name +
    "/" +
    channel.name;
  cloneGitRepo(gitLink, pathToCopy);
});

client.login(config.BOT_TOKEN);

function getGitLink(text) {
  const textAfterRepoWord = text.substring(text.indexOf("Repo:") + 5).trim();
  return textAfterRepoWord.substring(0, textAfterRepoWord.indexOf(" "));
}

function cloneGitRepo(link, path) {
  shell.cd(path);
  shell.exec("git clone " + link);
}
