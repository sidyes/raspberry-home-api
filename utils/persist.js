const fs = require("fs");

fs.readFile("codes.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const splitByLine = data.split(/\r?\n/);

  const sequence = [];

  splitByLine.forEach((val) => {
    const removeTab = val.replace("\t", "");

    const pair = removeTab.split(" ");
    const sequenceObj = {
      timing: pair[0],
      level: pair[1],
    };
    sequence.push(sequenceObj);
  });
  
  fs.writeFile('codes', JSON.stringify(sequence), err => {
    if (err) {
      console.error(err);
    }
  });
});


// create hash for command file
require('crypto').createHash('md5').update("XX").digest('hex') // replace XX by the name of the device