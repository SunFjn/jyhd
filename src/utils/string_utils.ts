namespace utils {
    export class StringUtils {
        private static wordsTree: Table<WordNode>;
        private static ignoreRegExp: RegExp;
        private static invalidRegExp: RegExp;
        private static spaceRegExp: RegExp;

        public static init(wordsTree: Table<WordNode>): void {
            // console.log("StringUtils Init...",wordsTree);
            StringUtils.wordsTree = wordsTree;
            StringUtils.ignoreRegExp = /^[^\u4e00-\u9fa5]+$/;  //中文

            const chinese = "\u4e00-\u9fa5\uf900-\ufa2d";
            const chineseSymbol =
                "\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u221a\u2234\u2520\u251b\u3231\u2501\u252f\u2295\u2261\u0020\u56e7\u2016\u25e5\u2606\u2642\u2513\u2199\u2192\u203b\u222e\u2193\u25e3\u22a5\u250f\u3001\u255d\u2533\u0069\u2569\u2190\ufe31\u5350\u3058\u2557\u2553\u32a3\u2517\u221d\u00b7\u2505\u25cb\u2507\u25cf\u00b0\u256c\u254b\ufe4f\u2605\u3128\u2191\u2537\u2235\u255a\u2554\u00a4\u2116\u2299\u2121\u2198\u2570\u2261\u3046\u2640\u256e\u2528\u25e2\ufe33\u2583\u25c6\u25ce\u25e4\u2594\u265b\u2550\u00a7\u300e\u0398\uff01";
            const words = "\x20-\x7e";    //打印字符
            //"&'/:;<>\`
            const symbol = "\x22\x26\x27\x2f\x3a\x3b\x3c\x3e\x5c\x60";
            const invalidRegExp = new RegExp(`[^${chinese}${chineseSymbol}${words}]|[${symbol}]`, "g");
            StringUtils.invalidRegExp = invalidRegExp;

            StringUtils.spaceRegExp = /\s+/;
        }

        public static containSpace(str: string): boolean {
            return StringUtils.spaceRegExp.test(str);
        }

        private static filterWords(words: string, start: number): number {
            let lastIndex = -1;
            let ignoreRegExp = StringUtils.ignoreRegExp;
            let tree = StringUtils.wordsTree;
            for (let i = start, length = words.length; i < length; ++i) {
                let c = words[i].toLocaleLowerCase();  //小写字符
                let node = tree[c];
                if (node == null) {
                    if (ignoreRegExp.test(c)) {  //中文检测 字符
                        continue;
                    }
                    return lastIndex;
                }

                tree = node.children;
                if (tree == null) {
                    return node.leaf ? ++i : lastIndex;
                }

                if (node.leaf) {
                    lastIndex = i + 1;
                }
            }

            return lastIndex;
        }

        public static isValidWords(words: string): boolean {
            StringUtils.invalidRegExp.lastIndex = 0;
            if (StringUtils.invalidRegExp.test(words)) {
                return false;
            }

            for (let i = 0, length = words.length; i < length;) {
                let j = StringUtils.filterWords(words, i);
                if (j != -1) {
                    return false;
                } else {
                    ++i;
                }
            }
            // if (/\d{4,}/.test(words)) {
            //     return false;
            // }
            return true;
        }

        public static replaceFilterWords(words: string, value: string): string {
            StringUtils.invalidRegExp.lastIndex = 0;
            words = words.replace(StringUtils.invalidRegExp, "");

            let result: Array<string> = [];
            for (let i = 0, length = words.length; i < length;) {
                let j = StringUtils.filterWords(words, i);
                if (j != -1) {
                    result.push(words.substring(i, j));
                    i = j;
                } else {
                    ++i;
                }
            }

            for (let s of result) {
                words = words.replace(s, value);
            }
            words = words.replace(/\d{4,}/g, "**");
            if (Main.instance.isWXiOSPay) {
                words = words.replace(/(充值|商城|商店|充钱|充了|充钱)/g, "**");
            }
            return words;
        }

        public static endsWith(source: string, searchString: string): boolean {
            return source.indexOf(searchString, source.length - searchString.length) != -1;
        }
    }
}
