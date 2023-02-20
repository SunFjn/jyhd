/**单人boss单元项*/
///<reference path="../config/jz_duobao_reward_cfg.ts"/>
///<reference path="../config/jz_duobao_weight_cfg.ts"/>
namespace modules.announcement {
    import jzduobao_reward = Configuration.jzduobao_reward;
    import jzduobao_rewardFields = Configuration.jzduobao_rewardFields;
    import Point = Laya.Point;
    import ItemsFields = Configuration.ItemsFields;
    import CustomClip = modules.common.CustomClip;
    import BaseItem = modules.bag.BaseItem;
    export class AnnouncementHtml extends ui.AnnouncementItemUI {
        private _startPos: Point;
        private _challengeClip: CustomClip;
        private _items: Array<BaseItem>;
        private _date: jzduobao_reward;
        constructor() {
            super();
        }
        public destroy(destroyChild: boolean = true): void {
            super.destroy(destroyChild);
        }
        protected initialize(): void {
            super.initialize();
            this.StatementHTML.color = "#2d2d2d";
            this.StatementHTML.style.fontFamily = "SimHei";
            this.StatementHTML.style.fontSize = 26;
            this.StatementHTML.style.lineHeight = 35;
            // this.StatementHTML.style.align = "left";
            this.StatementHTML.width = 625;
        }
        protected addListeners(): void {
            super.addListeners();
        }
        protected removeListeners(): void {
            super.removeListeners();
        }
        protected onOpened(): void {
            super.onOpened();
        }
        public close(): void {
            super.close();
        }
        protected setData(value: string): void {
            super.setData(value);
            // if (value != null) {
            this.StatementHTML.innerHTML = value ? value : "";
//             this.StatementHTML.innerHTML = `官方玩家Q群：865457890,入群即可领取豪华加群礼包噢！

// 闯天南，行九州，大陆逍遥任我游，轻松仙侠类手游带你娱乐三界九洲！


// 一、新服福利！
// 【福利一】首冲10倍代币券返利
// 活动内容：在游戏中首冲10元，即可获得首冲大礼包，内含10倍返利代币券、炫酷橙品幻武、强力红品幻武、顶级仙石加快你的升级速度。

// 【福利二】0元购
// 活动内容：超值福利礼包，购买后立即获得珍稀资源，并在7天内返还全部的代币券！

// 【福利三】七日登录
// 活动内容：玩家每天登录游戏大量代币券免费送，更有稀有翅膀和超强幻武等你领取。

// 【福利四】古神问道强力BUFF免费送
// 活动内容：达成每阶段的小目标，除了常规奖励外更有强力BUFF加持，成为最巅峰的大圣主。

// 【福利五】百倍返利
// 活动内容：超值投资计划，投资少量代币券，最高可得百倍返利，代币券领到手软！

// 【福利六】开服冲榜
// 活动内容：开服7天争夺排行榜，可获得粉品神装！

// 感谢您对我们游戏的热爱与支持，如有问题或建议，请加Q群联系客服进行反馈，我们会第一时间帮您解决，祝您游戏愉快！
// `;
            this.height = this.StatementHTML.contextHeight;
            // }
        }
    }
}