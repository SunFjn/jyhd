//外部定义接口

// 支付，roleId:角色ID,roleName:角色名,roleLevel:角色等级,roleCareer:角色职业,productId:商品ID,money:价格,
declare function ask_pay(roleId: number, roleName: string, roleLevel: number, roleCareer: number, productId: number, price: number): void;

// 后台创建角色
declare function player_create(roleId: number, roleName: string, roleLevel: number): void;

// 后台登录
declare function player_login(roleId: number, roleName: string, roleLevel: number): void;

// 后台角色升级
declare function player_level_up(roleId: number, roleName: string, roleLevel: number): void;

// 后台记录埋点，step:步数，roleId:角色ID
declare function record_step(step: number, roleId: number): void;

// 向后台请求服务器列表
declare function req_server_list(): void;

// 调用加载页的显示进度条
declare function showProgressInterface(curIndex: number, maxCount: number, value: number, str: string): void;

// 假的总加载进度条，time = -1代表加载条重新开始，-2表示加载已完成
declare function updateTotalProgress(time: number): void;

// iOS微信是不能支付处理函数
declare function wxiOSPayHandler(): void;

/** 向后台发送报错*/
declare function reqRecordError(error: string): void;

// 后台分享
declare function player_share(roleId: number, callBack: Function): void;

// 后台实名认证
declare function player_realname(callBack: Function): void;

// 后台关注
declare function player_follow(roleId: number, callBack: Function): void;

// 后台绑定手机
declare function player_bindphone(callBack: Function): void;

declare function firstEnterGameScene(): void;

declare module GameGlobal{
    // 小游戏验证区服是否是爆满
    // let haveRoleServers:any[];
    function judgeHaveRoleServers(server_num:number):boolean;
}

declare function SDKNet(url: string, any: Object, call?: Function, that?: any): void;

declare const DEBUG: boolean;

declare interface NameGenerator {
    familyNames: string[],
    symbols: string[],
    commonPrefix: string[],
    manPrefix: string[],
    manSuffix: string[],
    womanPrefix: string[],
    womanSuffix: string[]
}

declare const nameGenerator: NameGenerator;