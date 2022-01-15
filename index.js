const { Client, Intents } = require("discord.js");
const config = require("./config.json");
const shell = require("shelljs");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const initPath = config.MAIN_FOLDER_PATH;

client.once("ready", () => {
  console.log("Ready!");

  const category = client.channels.cache.find((ch) => ch.name === "WEEK-20");
  const channel = client.channels.cache.find(
    (ch) => ch.name === "challenge-7" && ch.parentId === category.id
  );

  if (category && channel) {
    const pathToCopy = checkAndGetPath(initPath, category.name, channel.name);
    channel.messages.fetch().then((messages) => {
      messages.forEach((message) => {
        const gitLink = getGitLink(message.content);
        if (gitLink) {
          cloneGitRepo(gitLink, pathToCopy);
        }
      });
    });
  }
});

client.on("messageCreate", (msg) => {
  let channel = msg.guild.channels.cache.get(msg.channelId);
  let category = msg.guild.channels.cache.get(channel.parentId);
  let message = msg.content;

  const gitLink = getGitLink(message);

  if (gitLink) {
    const pathToCopy = checkAndGetPath(initPath, category.name, channel.name);
    cloneGitRepo(gitLink, pathToCopy);
  }
});

client.login(config.BOT_TOKEN);

function getGitLink(text) {
  const textAfterRepoWord = text
    .substring(
      text.indexOf(config.WORD__BEFORE_LINK) + config.WORD__BEFORE_LINK.length
    )
    .trim();
  const gitLink = textAfterRepoWord.substring(
    0,
    textAfterRepoWord.indexOf(" ")
  );

  return gitLink.indexOf("http") >= 0 ? gitLink : null;
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
