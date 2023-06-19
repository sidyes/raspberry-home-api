const { series } = require("gulp");
var run = require("gulp-run");
var path = require("path");
var Client = require("ssh2-sftp-client");
var GulpSSH = require("gulp-ssh");
var sftp = new Client();

const dotenvPath = path.join(__dirname, ".", ".env");
require("dotenv").config({ path: dotenvPath });

const config = {
  host: process.env.SSH_HOST,
  username: process.env.SSH_USER,
  password: process.env.SSH_PW,
  port: process.env.SSH_PORT || 22,
  remotePath: "./dev/raspberry-home-api/",
};

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config,
});

function defaultTask(cb) {
  console.error("Please choose gulp task to run - there is no default one");
  cb();
}

function build() {
  console.log("1) Build REST API...");
  return run("nest build").exec();
}

function stopAndDeleteOldBuild() {
  console.log("2) Stop current server and delete build...");
  return gulpSSH
    .shell([`killall node`, `rm -r ${config.remotePath}`])
    .on("ssh2Data", (data) => console.dir(data.toString()));
}

function copyBuild() {
  return sftp
    .connect(config)
    .then(() => {
      console.log("3) Copy new build...");
      return sftp.uploadDir(`dist`, `${config.remotePath}`);
    })
    .then((data) => {
      console.log(data);
      return sftp.end();
    })
    .catch((err) => {
      console.log(err, "catch error");
    });
}

function runBuild() {
  console.log("4) Run new build...");
  return gulpSSH
    .shell([`node ${config.remotePath}main`])
    .on("ssh2Data", (data) => console.dir(data.toString()));
}

exports.default = defaultTask;
exports.deploy = series(build, stopAndDeleteOldBuild, copyBuild, runBuild);
