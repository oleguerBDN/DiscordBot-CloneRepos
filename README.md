# DiscordBot-CloneRepos

This is the code for a discord bot that will clone automatically any git link inserted on a new discord message after a keyword. 
- Added new features to clone specific weeks or challenges. 
- Added feature to clone ALL github links from the server. 

** Designed to work with ISDI Coders server structure while I was working there as assistant teacher. 

## MUST READ BEFORE RUN

Run `node .` and the bot will wait for any new message on the discord server. 

You need on the root of the repository a file named config.json with the following structure: 
```
{
  "BOT_TOKEN": "YOUR_BOT_TOKEN",
  "MAIN_FOLDER_PATH": "C:/Users/OLEGUER-PC/Desktop/students/", 
  "WORD__BEFORE_LINK": "Repo:",
  "DOWNLOAD_ALL_FOLDER_PATH": "C:/Users/OLEGUER-PC/Desktop/all-repos/"
}
```

- BOT_TOKEN --> Can't share on public website my code token, so ask me for it or create a new bot using this repo code

- MAIN_FOLDER_PATH --> Existing folder where the bot will clone the repos

- WORD_BEFORE_LINK --> Keyword before the link on the message, must need a space between keyword and link  

- DOWNLOAD_ALL_FOLDER_PATH --> Folder used when runing with command -all

## Run Arguments - Clone repositories from already existing messages

Added arguments: -w --week  |  -ch --challenge  |  -we --weekend  |  -all --all

Run `node . -w 4 -ch 8` to clone all repositories from already existing messages on week 4 , challenge 8 .

Run `node . -w 2 --weekend` to clone all repositories from already existing messages on week 2, weekend challenge . 

Run `node . -all` to clone any github repository from the discord server. Modify code to block private channels or it won't work (because bot permisions are just for reading public channels). 

Have fun :) 
