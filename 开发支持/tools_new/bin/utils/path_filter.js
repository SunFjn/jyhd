"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathFilter = void 0;
class PathFilter {
    constructor(excludeNames, excludePaths, excludeDirs, excludeCompressNames, excludeCompressPaths, excludeCompressDirs) {
        this._excludeNames = excludeNames || [];
        this._excludePaths = excludePaths || [];
        this._excludeDirs = excludeDirs || [];
        this._excludeCompressNames = excludeCompressNames || [];
        this._excludeCompressPaths = excludeCompressPaths || [];
        this._excludeCompressDirs = excludeCompressDirs || [];
    }
    isExclude(filepath) {
        for (let path of this._excludeDirs) {
            if (filepath.startsWith(path)) {
                return true;
            }
        }
        for (let path of this._excludePaths) {
            if (path == filepath) {
                return true;
            }
        }
        for (let name of this._excludeNames) {
            if (filepath.endsWith(name)) {
                return true;
            }
        }
        return false;
    }
    isExcludeCompress(filepath) {
        for (let path of this._excludeCompressDirs) {
            if (filepath.startsWith(path)) {
                return true;
            }
        }
        for (let path of this._excludeCompressPaths) {
            if (path == filepath) {
                return true;
            }
        }
        for (let name of this._excludeCompressNames) {
            if (filepath.endsWith(name)) {
                return true;
            }
        }
        return false;
    }
}
exports.PathFilter = PathFilter;
//# sourceMappingURL=path_filter.js.map