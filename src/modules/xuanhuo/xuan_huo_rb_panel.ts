/** 战队玄火(原九天之巅)右侧面板*/
///<reference path="../notice/tips_notice_manager.ts"/>

namespace modules.xuanhuo {
    import XuanhuoRBViewUI = ui.XuanhuoRBViewUI;
    import BlendCfg = modules.config.BlendCfg;
    import EffectCfg = modules.config.EffectCfg;
    import blendFields = Configuration.blendFields;
    import GetXuanhuoCopyDataReplyFields = Protocols.GetXuanhuoCopyDataReplyFields;
    import GetXuanhuoCopyDataReply = Protocols.GetXuanhuoCopyDataReply;

    // import CustomList = modules.common.CustomList;
    // import HumanShow = Protocols.HumanShow;
    // import SceneModel = modules.scene.SceneModel;
    // import NineCopy = Protocols.NineCopy;
    // import NineCopyFields = Protocols.NineCopyFields;
    // import EnterSceneFields = Protocols.EnterSceneFields;
    // import HumanShowFields = Protocols.HumanShowFields;
    // import ActorShowFields = Protocols.ActorShowFields;
    // import SceneCopyNineCfg = modules.config.SceneCopyNineCfg;
    // import scene_copy_nineFields = Configuration.scene_copy_nineFields;
    // import SystemNoticeManager = modules.notice.SystemNoticeManager;
    // import UpdateScoreFields = Protocols.UpdateScoreFields;
    import updateXuanhuoNumFields = Protocols.updateXuanhuoNumFields;
    import XuanhuoPowerFields = Protocols.XuanhuoPowerFields;
    import CopySceneState = Protocols.CopySceneState;

    import updateXuanhuoNum = Protocols.updateXuanhuoNum;
    import DungeonCtrl = modules.dungeon.DungeonCtrl;
    export class XuanhuoRBPanel extends XuanhuoRBViewUI {
        constructor() {
            super();
        }
        public destroy(destroyChild: boolean = true): void {

            super.destroy(destroyChild);
        }
        protected initialize(): void {
            super.initialize();
            this.right = 0;
            this.bottom = 400;
            this.closeByOthers = false;
            this.layer = ui.Layer.MAIN_UI_LAYER;

        }
        protected addListeners(): void {
            super.addListeners();
            //期望值 更新玄火数量
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.Xuanhuo_SCORE_UPDATE, this, this.updateScore);
            this.addAutoListener(this.killBtn, Laya.Event.CLICK, this, this.killHandler);
            this.addAutoListener(this.findBtn, Laya.Event.CLICK, this, this.findHandler);
            this.addAutoListener(this.findBtn2, Laya.Event.CLICK, this, this.find2Handler);
            this.addAutoListener(this.allComeOnBtn, Laya.Event.CLICK, this, this.allComeOnBtnHandler);
            this.addAutoListener(this.xuanhuoBtn, Laya.Event.CLICK, this, this.xuanhuoBtnHandler);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.XUANHUO_COPY_VULCAN_UPDATE, this, this.vulcanUpdate);
        }

        private vulcanUpdate() {
            if (XuanHuoModel.instance.vulcanId <= 0) {
                this.findBtn.visible = true
                this.findBtn2.visible = false
                return;
            }
            if (CommonUtil.isSameTeam(XuanHuoModel.instance.vulcanId)) {
                this.findBtn.visible = true
                this.findBtn2.visible = false
            } else {
                this.findBtn.visible = false
                this.findBtn2.visible = true
            }



        }

        /**
         *  
         * 首先去model取回鼓舞结束时间对比
         * 提示语 
         * 去b表取回消耗数量 写死代币券类型
         * 去b表取回持续时间 
         * 去b表取回技能ID  去eff表取回标书
         * @returns 
         */
        //全员鼓舞
        private allComeOnBtnHandler(): void {
            console.log("全员鼓舞全员鼓舞")
            let data: GetXuanhuoCopyDataReply = XuanHuoModel.instance.copyData;
            if (!data) return;

            let params: number[] = BlendCfg.instance.getCfgById(62019)[blendFields.intParam];
            let itemID: number = params[0];
            let needItemCount: number = params[1];
            let skill = BlendCfg.instance.getCfgById(62020)[blendFields.intParam][0]
            let desc: string = EffectCfg.instance.getCfgById(skill)[2]
            let time: number = BlendCfg.instance.getCfgById(62020)[blendFields.intParam][1];
            let content: string = `${needItemCount}`;
            let content1: string = `${desc}`;
            let content2: string = `鼓舞持续${CommonUtil.getTimeTypeAndTime(time)}!`;
            WindowManager.instance.openDialog(WindowEnum.XUANHUO_GWTips_PANEL, { content, content1, content2, needItemCount, itemID });
            return;


        }


        protected onOpened(): void {
            super.onOpened();
            this.updateScore();
            this.updateTime();
            // 请求次数
            DungeonCtrl.instance.getBossTimes();
            // 请求BOSS信息
            DungeonCtrl.instance.getBoss();
            this.vulcanUpdate();
        }

        // 更新玄火数量
        private updateScore(): void {
            if (!XuanHuoModel.instance.score) return;
            // let lv: number = SceneModel.instance.enterScene[EnterSceneFields.level];
            // this.scoreTxt.text = `${NineModel.instance.score[UpdateScoreFields.score]}/${SceneCopyNineCfg.instance.getCfgByLevel(lv)[scene_copy_nineFields.totalScore]}`;


            let killNum: number = XuanHuoModel.instance.score[updateXuanhuoNumFields.score]
            let retainNum: number = 0
            let retainMax: number = XuanHuoModel.instance.retainMax
            retainNum = killNum - retainMax < 0 ? killNum : retainMax;
            killNum = killNum - retainMax < 0 ? 0 : killNum - retainMax;

            this.killTxt.text = `${killNum}`;
            this.retainTxt.text = `${retainNum}/${retainMax}`;


            let data: GetXuanhuoCopyDataReply = XuanHuoModel.instance.copyData;
            if (!data) return;
            if (data[GetXuanhuoCopyDataReplyFields.inspireBuffTime] < GlobalData.serverTime) {
                this.allComeOnTxt.text = "未激活"
                this.allComeOnTxt.color = "#d1043d"
            }
            else {
                this.allComeOnTxt.text = "已激活"
                this.allComeOnTxt.color = "#2cd103"
            }

            this.deathBuffTxt.text = `当前${XuanHuoModel.instance.getPowerLevel()}层`;


        }

        // 显示当前玄火信息(等级和buff)
        private xuanhuoBtnHandler(): void {
            WindowManager.instance.open(WindowEnum.XUANHUO_LEVEL_BUFF_ALERT);
        }

        // 自动杀敌
        private killHandler(): void {
            // NineCtrl.instance.reqSearchObj(SearchType.monster);
            PlayerModel.instance.selectTarget(SelectTargetType.Monster, -1);
            // modules.notice.SystemNoticeManager.instance.addNotice( `<span style="color:#f3081a">${666}</span>${7777}！`, false);

        }

        // 自动索敌
        private findHandler(): void {
            // NineCtrl.instance.reqSearchObj(SearchType.actor);
            PlayerModel.instance.selectTarget(SelectTargetType.Player, -1);
        }
        // 自动索敌 火神
        private find2Handler(): void {
            // NineCtrl.instance.reqSearchObj(SearchType.actor);
            XuanHuoModel.instance._isDummy = false;
            XuanHuoModel.instance.selectTargetPos = [0, 0]
            XuanHuoCtrl.instance.getreqSearchObj(-1)
       

        }

        /**
       *更新时间
       */
        public updateTime() {
            Laya.timer.loop(1000, this, this.loopHandler);
        }
        private loopHandler(): void {
            let states: CopySceneState = DungeonModel.instance.getCopySceneStateByType(32);
            if (states) {
                let stateNum = states[3];
                this.timeText.text = `${modules.common.CommonUtil.timeStampToHHMMSS(stateNum)}`;
            }
        }
        public close(): void {
            super.close();
            Laya.timer.clear(this, this.loopHandler);
        }
    }
}