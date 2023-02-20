"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPathSep = exports.splitRoot = exports.fileToMD5 = exports.walk = void 0;
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
function walk(root, handler) {
    root = path.resolve(root);
    let list = fs.readdirSync(root);
    for (let name of list) {
        let filepath = path.join(root, name);
        let stat = fs.statSync(filepath);
        if (stat != null) {
            if (stat.isFile()) {
                handler(filepath, stat);
            }
            else if (stat.isDirectory() && handler(filepath, stat)) {
                walk(filepath, handler);
            }
        }
    }
}
exports.walk = walk;
function fileToMD5(filepath) {
    let md5 = crypto.createHash("md5");
    md5.update(fs.readFileSync(filepath));
    return md5.digest("hex");
}
exports.fileToMD5 = fileToMD5;
function splitRoot(filepath, root) {
    if (root == "") {
        return filepath;
    }
    filepath = filepath.substr(root.length);
    return filepath[0] == path.sep ? filepath.substr(1) : filepath;
}
exports.splitRoot = splitRoot;
const sepRegExp = /\\/g;
function formatPathSep(filepath) {
    if (path.sep != "/") {
        sepRegExp.lastIndex = 0;
        filepath = filepath.replace(sepRegExp, "/");
    }
    return filepath;
}
exports.formatPathSep = formatPathSep;
//# sourceMappingURL=file_utils.js.map