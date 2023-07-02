var path = require("path");
var GulpSSH = require("gulp-ssh");

const dotenvPath = path.join(__dirname, ".", ".env");
require("dotenv").config({ path: dotenvPath });

const config = {
  host: process.env.SSH_HOST,
  username: process.env.SSH_USER,
  password: process.env.SSH_PW,
  port: process.env.SSH_PORT || 22,
  remotePath: process.env.REMOTE_PATH,
};

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config,
});

function defaultTask(cb) {
  console.error("Please choose gulp task to run - there is no default one");
  cb();
}

function deploy() {
  return gulpSSH
    .shell([
      `cd ${config.remotePath}`,
      `git pull`,
      `npm i`,
      `npm run build`,
      `NODE_ENV=production pm2 start dist/main.js`, // start in background
      "sudo kill -9 `sudo lsof -t -i:3000`",
      "sleep 5"
    ])
    .on("ssh2Data", (data) => console.dir(data.toString()));
}

exports.default = defaultTask;
exports.deploy = deploy;
