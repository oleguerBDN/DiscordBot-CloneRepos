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

  if (gitLink) {
    const initPath = "C:/Users/User/Desktop/StudentsChallenges/";
    const pathToCopy = checkAndGetPath(initPath, category.name, channel.name);
    cloneGitRepo(gitLink, pathToCopy);
  }
});

client.login(config.BOT_TOKEN);

function getGitLink(text) {
  const textAfterRepoWord = text.substring(text.indexOf("Repo:") + 5).trim();
  const gitLink = textAfterRepoWord.substring(
    0,
    textAfterRepoWord.indexOf(" ")
  );

  return gitLink || null;
}

function cloneGitRepo(link, path) {
  if (shell.cd(path).code !== 0) {
    shell.mkdir(path);
    shell.cd(path);
  }
  shell.cd(path);
  shell.exec("git clone " + link);
}

function checkAndGetPath(initPath, weekFolder, challengeFolder) {
  if (shell.cd(initPath).code === 0) {
    if (shell.cd(initPath + weekFolder).code !== 0) {
      shell.mkdir(initPath + weekFolder);
    }
    if (shell.cd(initPath + weekFolder + "/" + challengeFolder).code !== 0) {
      shell.mkdir(initPath + weekFolder + "/" + challengeFolder);
    }
  }
  return initPath + weekFolder + "/" + challengeFolder;
}
