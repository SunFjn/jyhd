/** 战队规则弹窗 */


namespace modules.clan {
    import Event = Laya.Event;
    import LayaEvent = modules.common.LayaEvent;
    import ClanRuleAlertUI = ui.ClanRuleAlertUI;


    export class ClanRuleAlert extends ClanRuleAlertUI {
   

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();
      
        }


        protected addListeners(): void {
            super.addListeners();

        }

        onOpened(): void {
            super.onOpened();

            this.contentTxt.text=`1.加入战队后即可获得特权属性加成，离开战队属性加成消失。
2.特殊光环加成需要战队玩家一起组队才能进行加成，若三名队员都是战队玩家，则效果翻倍。
3.特殊光环刷新后则会立即更改全站对成员的特殊光环，刷新需谨慎。
4.战队光环每日凌晨5点自动刷新一次。
5.战队等级奖励每级只能领取一次，更换战队不可重复领取。
6.队长如果超过3天没上线，战队成员可以对队长发起弹劾。
7.队长处于弹劾状态，24小时内没上线，则弹劾成功，弹劾发起者则成为新队长
8.每次跨服服务器重启时，若战队连续超过一定天数没有玩家登录，将自动解散，如下：
    8.1 3级及一下战队连续15天内没有战队玩家登录。
    8.2 4级和5级战队连续30天内没有战队玩家登录。
    8.3 6级至8级战队连续45天内没有战队玩家登录。
    8.4 9级和10级战队连续60天内没有战队玩家登录。
    8.5 11级至15级战队连续90天内没有战队玩家登录。
    8.6 16级至19级战队连续150天内没有战队玩家登录。
    8.7 20级及以上等级战队不会被自动解散。
`;
        }

     


    }
}