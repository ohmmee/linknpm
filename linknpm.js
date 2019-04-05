#!/usr/bin/env node

// pardon me for the messed up callbacks, will work with Promises on later version

const exec = require("child_process").exec;
const fs = require("fs");
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

fs.readFile("./package.json", { encoding: "utf-8" }, (err, data) => {
  if (process.argv[2]) {
    exec(`npm link ${process.argv[2]}`, (err, stdout, stderr) => {
      if (!err) {
        let toModify;
        if (typeof data == "undefined") {
          toModify = { linknpm: true };
        } else {
          toModify = JSON.parse(data);
        }
        toModify["dependencies"] = toModify["dependencies"] || {};
        toModify["dependencies"][process.argv[2]] = "**TODO**";
        const modifiedFile = JSON.stringify(toModify, null, 2);
        fs.writeFile("./package.json", modifiedFile, err => {
          console.log(stdout);
          console.log(`${process.argv[2]} is linked locally`);
        });
      }
    });
  } else {
    exec("npm ls -g --depth 0", (err, stdout, stderr) => {
      const packages = JSON.parse(data.toString()).dependencies;
      Object.keys(packages).forEach(val => {
        packages[val] = packages[val].replace(/\^/, "");
      });
      console.log(packages);

      // if (err) {
      //   console.error(`exec error: ${err}`);
      //   return;
      // }
      const raw = stdout.split("\n");
      const installedPackages = {};
      raw.forEach(entry => {
        const pkgName = entry.split("@")[0].split(" ")[1];
        const version = entry.split("@")[1];
        if (pkgName) {
          installedPackages[pkgName] = version;
        }
      });
      // console.log(installedPackages);

      let index = 0;

      function MainThread(package) {
        index++;
        // ** if same package.json requirement, link this package
        if (packages[package] === installedPackages[package]) {
          exec(`npm link ${package}`, (err, stdout, stderr) => {
            // console.log(stdout);
            console.log(`${package}^${packages[package]} is linked locally`);
            packagesArray[index]
              ? MainThread(packagesArray[index])
              : process.exit();
          });
        }
        // ** if no entries in installedPackages, then also npm link; that'll install same version globally and link
        else if (!installedPackages[package]) {
          exec(
            `npm link ${package}@${packages[package]}`,
            (err, stdout, stderr) => {
              console.log(
                `${package}^${
                  packages[package]
                } is downloaded and linked locally`
              );
              packagesArray[index]
                ? MainThread(packagesArray[index])
                : process.exit();
            }
          );
        }
        // ** if conflict between package.json and global package, ask for input
        else if (packages[package] !== installedPackages[package]) {
          const packagejson = packages[package].split("."),
            installed = installedPackages[package].split(".");
          const difference =
            installed[0] >= packagejson[0] &&
            installed[1] >= packagejson[1] &&
            installed[2] >= packagejson[2]
              ? ">"
              : "<";

          console.log(
            "-----------------CONFLICT---------------------------------------"
          );
          console.log(
            `${package}^${
              installedPackages[package]
            }(installed) ${difference} ${package}^${
              packages[package]
            }(package.json)`
          );
          console.log(
            "----------------------------------------------------------------"
          );
          console.log("'u' to update the installed global package");
          console.log("'l' to force link what's installed");
          console.log(
            "----------------------------------------------------------------"
          );

          process.stdin.on("keypress", (str, key) => {
            if (key.ctrl && key.name === "c") {
              process.exit();
            } else {
              if (str === "u") {
                exec(`npm i -g ${package}`, (err, stdout, stderr) => {
                  exec(`npm link ${package}`, (err, stdout, stderr) => {
                    console.log(
                      `${package}^${
                        packages[package]
                      } is updated and linked locally`
                    );
                    packagesArray[index]
                      ? MainThread(packagesArray[index])
                      : process.exit();
                  });
                });
              } else if (str === "l") {
                exec(`npm link ${package}`, (err, stdout, stderr) => {
                  console.log(
                    `${package}^${
                      packages[package]
                    } is linked forcefully (Warning!!)`
                  );
                  packagesArray[index]
                    ? MainThread(packagesArray[index])
                    : process.exit();
                });
              }
            }
          });
        }
      }

      const packagesArray = Object.keys(packages);

      packagesArray[index] && MainThread(packagesArray[index]);
    });
  }
});
