import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto";

export function walk(root: string, handler: (filepath: string, stats: fs.Stats) => boolean): void {
    root = path.resolve(root);
    let list = fs.readdirSync(root);
    for (let name of list) {
        let filepath = path.join(root, name);
        let stat = fs.statSync(filepath);
        if (stat != null) {
            if (stat.isFile()) {
                handler(filepath, stat);
            } else if (stat.isDirectory() && handler(filepath, stat)) {
                walk(filepath, handler);
            }
        }
    }
}

export function fileToMD5(filepath: string): string {
    let md5 = crypto.createHash("md5");
    md5.update(fs.readFileSync(filepath));
    return md5.digest("hex");
}

export function splitRoot(filepath: string, root: string): string {
    if (root == "") {
        return filepath;
    }
    filepath = filepath.substr(root.length);
    return filepath[0] == path.sep ? filepath.substr(1) : filepath;
}

const sepRegExp = /\\/g;

export function formatPathSep(filepath: string): string {
    if (path.sep != "/") {
        sepRegExp.lastIndex = 0;
        filepath = filepath.replace(sepRegExp, "/");
    }
    return filepath;
}
