#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const projectName = process.argv[2];

if (!projectName) {
  console.log("Please provide project name");
  process.exit(1);
}

const basePath = path.join(process.cwd(), projectName);

const folders = [
  "src/controllers",
  "src/models",
  "src/routes",
  "src/middlewares",
  "src/services",
  "src/config",
  "src/utils"
];

folders.forEach(folder => {
  fs.mkdirSync(path.join(basePath, folder), { recursive: true });
});

fs.writeFileSync(
  path.join(basePath, "src/app.js"),
`const express = require("express");
const app = express();

app.use(express.json());

module.exports = app;
`
);

fs.writeFileSync(
  path.join(basePath, "src/server.js"),
`const app = require("./app");

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
`
);

console.log("Project created successfully!");