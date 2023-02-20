export class PathFilter {
    private readonly _excludePaths: Array<string>;//过滤的文件名或者扩展名
    private readonly _excludeNames: Array<string>;//过滤的文件
    private readonly _excludeDirs: Array<string>;//过滤的文件夹
    private readonly _excludeCompressPaths: Array<string>;//过滤压缩的文件名或者扩展名
    private readonly _excludeCompressNames: Array<string>;//过滤压缩的文件夹
    private readonly _excludeCompressDirs: Array<string>;//过滤压缩的文件夹

    constructor(excludeNames: Array<string>, excludePaths: Array<string>, excludeDirs: Array<string>,
                excludeCompressNames: Array<string>, excludeCompressPaths: Array<string>, excludeCompressDirs: Array<string>) {
        this._excludeNames = excludeNames || [];
        this._excludePaths = excludePaths || [];
        this._excludeDirs = excludeDirs || [];
        this._excludeCompressNames = excludeCompressNames || [];
        this._excludeCompressPaths = excludeCompressPaths || [];
        this._excludeCompressDirs = excludeCompressDirs || [];
    }

    public isExclude(filepath: string): boolean {
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

    public isExcludeCompress(filepath: string): boolean {
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