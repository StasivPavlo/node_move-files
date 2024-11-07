'use strict';

const fs = require('fs');
const path = require('path');

// eslint-disable-next-line no-shadow
function moveFile(currentPath, newPath) {
  if (!fs.existsSync(currentPath)) {
    throw new Error(`Source file '${currentPath}' does not exist.`);
  }

  const fileData = fs.readFileSync(currentPath, 'utf-8');
  let targetPath;

  if (newPath.endsWith('/')) {
    targetPath = newPath + path.basename(currentPath);
  } else if (newPath.includes('/')) {
    targetPath = newPath;
  } else if (fs.existsSync(newPath + '/')) {
    targetPath = newPath + '/' + path.basename(currentPath);
  } else {
    fs.renameSync(currentPath, newPath);

    return;
  }

  // Write file data to the determined target path
  fs.writeFileSync(targetPath, fileData);
  fs.unlinkSync(currentPath); // Remove the original file after moving
}

const [currentPath, newPath] = process.argv.slice(2);

if (!fs.existsSync(path.dirname(newPath)) && newPath.includes('/')) {
  throw new Error(`The directory '${path.dirname(newPath)}' does not exist.`);
}

moveFile(currentPath, newPath);
