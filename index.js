const { Client, Intents } = require("discord.js");
const config = require("./config.json");
const shell = require("shelljs");
const { program } = require("commander");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const initPath = config.MAIN_FOLDER_PATH;

program.option("-w, --week <week>");
program.option("-ch, --challenge <challenge>");
program.option("-we, --weekend");
program.option("-all, --all");
program.parse(process.argv);
const { week, challenge, weekend, all } = program.opts();

client.once("ready", () => {
  console.log("Bot is running :)");

  if (all) {
    downloadAll();
  }

  const category = client.channels.cache.find(
    (ch) => ch.name === "WEEK-" + week
  );
  const channel = client.channels.cache.find(
    (ch) =>
      ch.name === "challenge-" + (weekend ? "weekend-" + week : challenge) &&
      ch.parentId === category.id
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
  const gitLink =
    textAfterRepoWord.indexOf(" ") > 0
      ? textAfterRepoWord.substring(0, textAfterRepoWord.indexOf(" "))
      : textAfterRepoWord;
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

function downloadAll() {
  const repoUserList = [];
  console.log("STEP 1 - Let's get all links from discord");
  client.channels.cache.forEach((channel) => {
    //WEEK-6 --> 925467758844592279
    //W6 CH2 --> 925467937329008691
    //W6 CH2 FORUM --> 925468057621647420

    //WEEK-7 --> 925468530193879050
    //w7 CH2 --> 925468739628044308
    //w7 CH2 FORUM --> 925468790882439259
    //w7 CH3 --> 925468834901659658
    //w7 CH3 FORUM --> 925468887443718174
    //w7 CH4 --> 925468930489868339
    //w7 CH4 FORUM --> 925468971334008852

    //WEEK-8 --> 925469161637945455
    //W8 CH3 --> 925469405347991602
    //W8 CH3 FORUM --> 925469456015196191
    //W8 CH4 --> 925469495525535784
    //W8 CH4 FORUM --> 925469546670850048

    //FINAL-PROJECT --> 925470051472146442
    //PROFES

    if (
      channel.messages &&
      channel.name !== null &&
      channel.id !== "925468057621647420" &&
      channel.id !== "925467937329008691" &&
      channel.id !== "925468739628044308" &&
      channel.id !== "925468790882439259" &&
      channel.id !== "925468834901659658" &&
      channel.id !== "925468887443718174" &&
      channel.id !== "925468930489868339" &&
      channel.id !== "925468971334008852" &&
      channel.id !== "925469405347991602" &&
      channel.id !== "925469456015196191" &&
      channel.id !== "925469495525535784" &&
      channel.id !== "925469546670850048" &&
      channel.parentId !== "925470051472146442" &&
      channel.name !== "profes"
    ) {
      channel.messages.fetch().then((messages) => {
        messages.forEach((message) => {
          const gitLink = extractGithubLink(message.content);
          if (gitLink) {
            const username = extractUserFromGithubLink(gitLink);
            console.log(gitLink);
            repoUserList.push({ username, gitLink });
          }
        });
      });
    }
  });

  setTimeout(() => {
    console.log("STEP 2 - DOWNLOAD IT ALL! ");
    repoUserList.forEach((repo) =>
      cloneGitRepoAndRemoveGit(
        repo.gitLink,
        config.DOWNLOAD_ALL_FOLDER_PATH + repo.username
      )
    );
  }, 10000);
}

function extractGithubLink(text) {
  const textAfterRepoWord = text
    .substring(text.indexOf("https://github.com/"))
    .trim();
  let gitLink =
    textAfterRepoWord.indexOf(" ") > 0
      ? textAfterRepoWord.substring(0, textAfterRepoWord.indexOf(" "))
      : textAfterRepoWord;
  gitLink =
    textAfterRepoWord.indexOf("\n") > 0
      ? textAfterRepoWord.substring(0, textAfterRepoWord.indexOf("\n"))
      : textAfterRepoWord;
  return gitLink.indexOf("https://github.com/") >= 0 ? gitLink : null;
}

function extractUserFromGithubLink(link) {
  const linkWithoutDomain = link.substring("https://github.com/".length);
  return linkWithoutDomain.substring(0, linkWithoutDomain.indexOf("/"));
}

function cloneGitRepoAndRemoveGit(link, path) {
  if (shell.cd(path).code !== 0) {
    shell.mkdir(path);
    shell.cd(path);
  }
  shell.cd(path);
  shell.exec("git clone " + link);
  shell.rm("-rf", "*/.git");
}
