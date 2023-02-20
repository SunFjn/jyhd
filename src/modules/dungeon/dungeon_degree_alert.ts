///<reference path="../config/shilian_cfg.ts"/>


/** 副本难度弹框*/


namespace modules.dungeon {
    import DungeonDegreeAlertUI = ui.DungeonDegreeAlertUI;
    import CopyTimes = Protocols.CopyTimes;
    import CopyTimesFields = Protocols.CopyTimesFields;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import ShilianCfg = modules.config.ShilianCfg;
    import shilianFields = Configuration.shilianFields;
    import CommonUtil = modules.common.CommonUtil;

    export class DungeonDegreeAlert extends DungeonDegreeAlertUI {
        //private _strs: Array<string>;

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            //this._strs = ["简单", "普通", "困难", "噩梦", "炼狱", "深渊", "虚空"];

            this.descTxt.color = "#2d2d2d";
            this.descTxt.style.fontFamily = "SimHei";
            this.descTxt.style.fontSize = 24;
            this.descTxt.style.lineHeight = 28;
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            let copyTimes: CopyTimes = value;
            let diffcultLevelName = modules.config.ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.levelName];
            this.curDegreeTxt.text = diffcultLevelName;
            this.curDegreeTxt.color = CommonUtil.getColorByQuality(copyTimes[CopyTimesFields.diffcultLevel]);
            let offset: number = 0;
            if (copyTimes[CopyTimesFields.diffcultLevel] >= 12) {      // 没有下一难度时UI调整
                this.nextStar1.visible = this.nextStar2.visible = this.nextStar3.visible = this.conTxt.visible = false;
                this.nextDegreeTxt.text = "已达最高难度";
                this.nextDegreeTxt.color = CommonUtil.getColorByQuality(1);
                offset = 56;
            } else {
                this.nextStar1.visible = this.nextStar2.visible = this.nextStar3.visible = this.conTxt.visible = true;
                this.nextDegreeTxt.text = diffcultLevelName;
                this.nextDegreeTxt.color = CommonUtil.getColorByQuality(copyTimes[CopyTimesFields.diffcultLevel] + 1);
                offset = 0;
            }
            this.height = this.bg.height = 607 - offset;
            this.bg1.y = 429 - offset;
            this.descTxt.y = 452 - offset;
            this.tipTxt.y = 598 - offset;


            this.conTxt.text = `${diffcultLevelName}难度三星通关且Lv${ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.actorLevel]}以上开启`;

            let star: number = copyTimes[CopyTimesFields.star];
            this.curStar1.skin = star >= 1 ? "common/icon_tongyong_8.png" : "common/icon_tongyong_7.png";
            this.curStar2.skin = star >= 2 ? "common/icon_tongyong_8.png" : "common/icon_tongyong_7.png";
            this.curStar3.skin = star >= 3 ? "common/icon_tongyong_8.png" : "common/icon_tongyong_7.png";

            if (copyTimes[CopyTimesFields.mapId] === SCENE_ID.scene_xianqi_copy) {
                this.descTxt.innerHTML = BlendCfg.instance.getCfgById(10316)[blendFields.stringParam][0];
            } else if (copyTimes[CopyTimesFields.mapId] === SCENE_ID.scene_pet_copy) {
                this.descTxt.innerHTML = BlendCfg.instance.getCfgById(10317)[blendFields.stringParam][0];
            }
            else if (copyTimes[CopyTimesFields.mapId] === SCENE_ID.scene_shenbing_copy) {
                this.descTxt.innerHTML = BlendCfg.instance.getCfgById(10324)[blendFields.stringParam][0];
            }
            else if (copyTimes[CopyTimesFields.mapId] === SCENE_ID.scene_wing_copy) {
                this.descTxt.innerHTML = BlendCfg.instance.getCfgById(10325)[blendFields.stringParam][0];
            }
            else if (copyTimes[CopyTimesFields.mapId] === SCENE_ID.scene_fashion_copy) {
                this.descTxt.innerHTML = BlendCfg.instance.getCfgById(10326)[blendFields.stringParam][0];
            }
            else if (copyTimes[CopyTimesFields.mapId] === SCENE_ID.scene_tianzhu_copy) {
                this.descTxt.innerHTML = BlendCfg.instance.getCfgById(10327)[blendFields.stringParam][0];
            }
            else if (copyTimes[CopyTimesFields.mapId] === SCENE_ID.scene_xilian_copy) {
                this.descTxt.innerHTML = BlendCfg.instance.getCfgById(10328)[blendFields.stringParam][0];
            }
        }
    }
}