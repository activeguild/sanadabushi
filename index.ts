import fs from "fs";
import postcss from "postcss";
import {  } from 'tailwindcss/lib/cli';

var css = fs.readFileSync("./dist/output.css");
var root = postcss.parse(css); // `input.css`をパースしてASTを返す

let outputStr = "";

root.nodes.map((node) => {
  if (node.type === "rule" && node.selector.startsWith(".")) {
    for (const childNode of node.nodes) {
      if (childNode.type === "decl") {
        outputStr = `${outputStr}\n${childNode.prop}: ${childNode.value};`;
      }
    }
  }
});

console.log("outputStr :>> ", outputStr);
