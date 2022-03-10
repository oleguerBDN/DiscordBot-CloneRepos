const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

fs.readdir(".", (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    const directoryPath = path.resolve(__dirname, file);
    if (fs.statSync(directoryPath).isDirectory()) {
      process.chdir(directoryPath);
      console.log(file);
      try {
        const branch = execSync("git branch --show-current", {
          encoding: "ascii",
        }).trim();
        console.log(`Pulling branch ${branch}`);
        if (branch !== "main" && branch !== "master") {
          console.log(" (NOT THE MAIN BRANCH!!!)");
        }
        const stdout = execSync("git restore . && git pull", {
          encoding: "ascii",
        });
        console.log(stdout);
        console.log(
          "Last commit: ",
          execSync("git log -1 --format=%cd", { encoding: "ascii" })
        );
        console.log("************");

        console.log("Npm install running...");
        execSync("npm i");
        console.log("************");

        console.log("Collect coverage...");
        if (file.includes("_Front-")) {
          execSync("npm test -- --watchAll=false --collect-coverage");
        }
        if (file.includes("_Back-")) {
          execSync("npx jest --collect-coverage");
        }
        console.log("Coverage ready :)");
        console.log("************");

        console.log("Running sonar-scaner... ");
        execSync("sonar-scanner.bat");
        console.log("Sonar-scaner done :) ");
        console.log("==============");
      } catch (error) {
        console.error(error.message);
      }
    }
  });
});
