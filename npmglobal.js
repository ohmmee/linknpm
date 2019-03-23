#!/usr/bin/env node

const exec = require("child_process").exec;
const fs = require("fs");

fs.readFile("./package.json", (err, data) => {
  const dependencies = JSON.parse(data.toString()).dependencies;
  console.log(dependencies);

  exec("npm ls -g --depth 0", (err, stdout, stderr) => {
    // if (err) {
    //   console.error(`exec error: ${err}`);
    //   return;
    // }
    const raw = stdout.split("\n");
    const installedPackages = {};
    raw.forEach(entry => {
      const pkgName = entry.split("@")[0].split(" ")[1];
      const version = entry.split("@")[1];
      if (pkgName != undefined) {
        installedPackages[pkgName] = version;
      }
    });
    // console.log(installedPackages);

    Object.keys(dependencies).forEach(each => {
      // ** if same package.json requirement, link all
      if (dependencies[each].slice(1) === installedPackages[each]) {
        exec(`npm link ${each}`, (err, stdout, stderr) => {
          // console.log(stdout);
          console.log(`${(each, dependencies[each])} is linked locally`);
        });
      }
      // **TODO** if no entries in installedPackages, then also npm link that'll install globally and link

      // **TODO** if conflict between package.json and global package, ask for input
      // u to update the global and npm link => npm i -g <package name> && npm link <package-name>
      // l to force link the older version that's already installed, give warning sign
    });
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);
  });
});
