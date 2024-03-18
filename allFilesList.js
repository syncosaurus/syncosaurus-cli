import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const rootPath = './';

const listFiles = (dir, fileList = []) => {
  const files = readdirSync(dir);

  files.forEach((file) => {
    if (statSync(path.join(dir, file)).isDirectory()) {
      fileList = listFiles(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  });

  return fileList;
};

const findFile = (fileName) => {
  const allFiles = listFiles(rootPath);

  const searchResult = allFiles.find(file => file.endsWith(fileName));

  if (searchResult) {
    return `${rootPath}${searchResult}`;
  } else {
    return null;
  }
};

console.log(findFile('mutators.js'));
