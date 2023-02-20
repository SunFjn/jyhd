/** 错误码配置*/


namespace modules.config {
    import erorr_code = Configuration.erorr_code;

    export class ErrorCodeCfg {
        private static _instance: ErrorCodeCfg;
        public static get instance(): ErrorCodeCfg {
            return this._instance = this._instance || new ErrorCodeCfg();
        }

        private _table: Table<erorr_code>;
        private _preTable: Table<erorr_code>;

        constructor() {
            this._preTable = {};
            this._preTable[9] = [9, "账号在别处登录"];
            this._preTable[10] = [10, "服务器关闭"];
            this._preTable[11] = [11, "不能广播"];
            this._preTable[12] = [12, "未知错误"];
            this._preTable[13] = [13, "状态错误"];
            this._preTable[14] = [14, "账号含有非法字符"];
            this._preTable[15] = [15, "角色名含有非法字符"];
            this._preTable[10001] = [10001, "无效参数"];
            this._preTable[10002] = [10002, "认证失败"];
            this._preTable[10003] = [10003, "角色不在线"];
            this._preTable[10004] = [10004, "找不到对应的服务器"];
            this._preTable[10005] = [10005, "无效会话"];
            this._preTable[10006] = [10006, "通知下线"];
            this._preTable[10007] = [10007, "账号已封"];
            this._preTable[10008] = [10008, "角色已封"];
            this._preTable[10009] = [10009, "IP已封"];
            this._preTable[10010] = [10010, "强制下线"];
            this._preTable[10011] = [10011, "验证超时"];
            this._preTable[11001] = [11001, "未创建角色"];
            this._preTable[11002] = [11002, "角色名已存在"];
            this._preTable[11003] = [11003, "创建角色失败"];
            this._preTable[11004] = [11004, "角色名长度限制"];
            this._preTable[11005] = [11005, "角色ID已存在"];
            this._preTable[11006] = [11006, "无效职业"];
            this._preTable[11007] = [11007, "数据库异常"];
            this._preTable[11008] = [11008, "不能重复登录"];
            this._preTable[11009] = [11009, "不能重复进入场景"];
            this._preTable[10012] = [10012, "温馨提示该区服开服过久,为保证游戏体验,请前往最新区服!"];
            this._table = GlobalData.getConfig("erorr_code");
        }

        // 根据错误码ID取出错误码配置
        public getErrorCfgById(id: number): erorr_code {
            if (!this._table) {
                this._table = GlobalData.getConfig("erorr_code");
                if (!this._table) {
                    return this._preTable[id];
                }
            }
            return this._table[id.toString()];
        }
    }
}