import { readdirSync, statSync } from "node:fs";
import path from "node:path";

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

export const findFile = (clientPath, fileName) => {
  const allFiles = listFiles(clientPath);

  const searchResult = allFiles.find(file => file.endsWith(fileName));

  if (searchResult) {
    return `./${searchResult}`;
  } else {
    return null;
  }
};


