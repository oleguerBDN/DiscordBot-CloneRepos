# DiscordBot-CloneRepos

This is the code for a discord bot that will clone automatically any git link inserted on a new discord message after a keyword. 

## MUST READ BEFORE RUN

Run `node .` and the bot will wait for any new message on the discord server. 

You need on the root of the repository a file named config.json with the following structure: 
```
{
  "BOT_TOKEN": "YOUR_BOT_TOKEN",
  "MAIN_FOLDER_PATH": "C:/Users/MY-PC/Desktop/folder/", 
  "WORD__BEFORE_LINK": "Repo:"  
}
```

- MAIN_FOLDER_PATH --> Existing folder where the bot will clone the repos

- WORD_BEFORE_LINK --> Keyword before the link on the message, must need a space between keyword and link  

## Run Arguments - Clone repositories from already existing messages

Added arguments: -w --week  |  -ch --challenge  |  -we --weekend

Run `node . -w 4 -ch 8` to clone all repositories from already existing messages on week 4 , challenge 8 .

Run `node . -w 2 --weekend` to clone all repositories from already existing messages on week 2, weekend challenge . 

