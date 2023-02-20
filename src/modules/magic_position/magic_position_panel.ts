/** 成就面板 */


///<reference path="../config/xianwei_rise_cfg.ts"/>
/// <reference path="../config/blend_cfg.ts" />

namespace modules.magicPosition {
    import MagicPositionViewUI = ui.MagicPositionViewUI;
    import CustomList = modules.common.CustomList;
    import BagItem = modules.bag.BagItem;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import CustomClip = modules.common.CustomClip;
    import XianweiRiseCfg = modules.config.XianweiRiseCfg;
    import xianwei_riseFields = Configuration.xianwei_riseFields;
    import ItemsFields = Configuration.ItemsFields;
    import TweenGroup = utils.tween.TweenGroup;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import xianwei_rise = Configuration.xianwei_rise;
    import Items = Configuration.Items;

    export class MagicPositionPanel extends MagicPositionViewUI {

        private _showPage: number;
        private _list: CustomList;
        private _dailyGet: Array<BagItem>;
        private _upImg: Array<Image>;
        private _upTxt: Array<Text>;
        private _attrName: Array<Text>;
        private _attr: Array<Text>;
        private _scheEffect1: CustomClip; //进度1
        private _waveClip: CustomClip;
        private _btnClip: CustomClip;
        private _showX: number;
        private _tweenGroup: TweenGroup;
        public destroy(destroyChild: boolean = true): void {
            this._tweenGroup = this.destroyElement(this._tweenGroup);
            this._list = this.destroyElement(this._list);
            this._waveClip = this.destroyElement(this._waveClip);
            this._btnClip = this.destroyElement(this._btnClip);
            this._dailyGet = this.destroyElement(this._dailyGet);
            this._upImg = this.destroyElement(this._upImg);
            this._upTxt = this.destroyElement(this._upTxt);
            this._attrName = this.destroyElement(this._attrName);
            this._attr = this.destroyElement(this._attr);
            if (this._scheEffect1) {
                this._scheEffect1.destroy(true);
                this._scheEffect1 = null;
            }
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();
            this.centerY = this.centerX = 0;

            this._list = new CustomList();
            this._list.hCount = 1;
            this._list.spaceY = 8;
            this._list.height = 488;
            this._list.width = 622;
            this._list.pos(49, 642);
            this._list.itemRender = MagicPositionItem;
            this.addChild(this._list);

            this._dailyGet = new Array<BagItem>();
            this._dailyGet[0] = new BagItem();
            this.addChild(this._dailyGet[0]);
            this._dailyGet[0].scale(0.8, 0.8);
            this._dailyGet[1] = new BagItem();
            this.addChild(this._dailyGet[1]);
            this._dailyGet[1].scale(0.8, 0.8);

            this._showX = this._list.x + 36;
            this._upImg = [this.attrAddImg1, this.attrAddImg2, this.attrAddImg3];
            this._upTxt = [this.attrAdd1, this.attrAdd2, this.attrAdd3];
            this._attr = [this.attr1, this.attr2, this.attr3];
            this._attrName = [this.attrName1, this.attrName2, this.attrName3];

            this._waveClip = CommonUtil.creatEff(this.con, `wave`, 7);
            this._waveClip.play();
            this._waveClip.pos(0, 130, true);

            this._btnClip = CommonUtil.creatEff(this.getBtn, `btn_light`, 15);
            this._btnClip.scale(0.65, 0.75);
            this._btnClip.pos(-6, -9);

            this.initEff();

            this._tweenGroup = new TweenGroup();

            this.ylqImg.visible = this.awardName.visible = this.showAward.visible = false;
        }

        private initEff() {
            this._scheEffect1 = new CustomClip();
            this.conBox1.addChildAt(this._scheEffect1, 0);
            this._scheEffect1.skin = "assets/effect/wave.atlas";
            this._scheEffect1.frameUrls = ["wave/0.png", "wave/1.png", "wave/2.png", "wave/3.png", "wave/4.png",
                "wave/5.png", "wave/6.png", "wave/7.png"];
            this._scheEffect1.durationFrame = 5;
            this._scheEffect1.play();
            this._scheEffect1.loop = true;
            this._scheEffect1.pos(-10, 122, true);
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(this.getBtn, common.LayaEvent.CLICK, this, this.getBtnHandler);
            this.addAutoListener(this.rightBtn, common.LayaEvent.CLICK, this, this.rightBtnHandler);
            this.addAutoListener(this.leftBtn, common.LayaEvent.CLICK, this, this.leftBtnHandler);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_POSITION_UPDATE, this, this.updateAllInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_POSITION_TASK_UPDATE, this, this.updateListInfo);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MAGIC_POSITION_GET_AWARD, this, this.showGetEffect);
        }

        protected onOpened(): void {
            super.onOpened();
            this.MPAttr.text = `成就压制：高品阶成就玩家对低品阶造成伤害增加${BlendCfg.instance.getCfgById(42001)[blendFields.intParam][0] * 100}%`;
            this.MPAttr.visible = false;
            this._showPage = MagicPositionModel.Instance.position;
            this._waveClip.play();
            this.stateInfo();
            this.updateListInfo();
            this.turnPageHandler();
            this._scheEffect1.play();
            this._list.scrollToIndex(0);

            CustomList.showListAnim(modules.common.showType.ALPHA, this._list);
        }

        public close(): void {
            this._tweenGroup.removeAll();
            common.ItemRenderNoticeManager.instance.stop();
            super.close();
        }

        // 更新所有信息
        private updateAllInfo(): void {
            this.stateInfo();
            if (MagicPositionModel.Instance.isLevelUp) {
                this._showPage = MagicPositionModel.Instance.position;
            }
            this.turnPageHandler();
        }

        private updateListInfo(): void {
            let taskIndex: number = common.ItemRenderNoticeManager.instance.index;
            if (taskIndex == null) {
                let pos = this._list.scrollPos;
                this._list.datas = MagicPositionModel.Instance.tasks;
                this._list.scrollPos = pos;
                return;
            }
            let itemRender: ItemRender = this._list.items[taskIndex];
            common.ItemRenderNoticeManager.instance.addNotice(itemRender, CommonEventType.MAGIC_POSITION_TASK_UPDATE);
        }

        private stateInfo(): void {
            //设置战力值
            let cfg: xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(MagicPositionModel.Instance.position);//获取对应页面的信息
            this.powerNum.value = cfg[xianwei_riseFields.fighting].toString();
        }

        // 点击按钮相应
        private turnPageHandler(): void {

            let maxNum: number = XianweiRiseCfg.instance.maxLv;
            let cfg: xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(this._showPage);//获取对应页面的信息
            this.turnBtnShow();
            this.stageImg.skin = `${MagicPositionUtil.getSkinByLv(this._showPage)}`;
            let icon: string = cfg[xianwei_riseFields.resName];
            this.positionName.skin = `assets/icon/ui/position_name/${icon}.png`;
            let attr1 = cfg[xianwei_riseFields.attack];
            let attr2 = cfg[xianwei_riseFields.hp];
            let attr3 = cfg[xianwei_riseFields.defense];
            let attrNum: Array<number> = [attr1, attr2, attr3];
            let needNum = 0;//需要的仙力值
            if (this._showPage >= maxNum) { //最后一个不显示-控制显示的阶段
                this.setUpAttr(false, attrNum);
                this.ylqImg.visible = this.awardName.visible = this.showAward.visible = false;
                let forwardCfg = XianweiRiseCfg.instance.getXianweiRiseByLevel(this._showPage, -1);
                needNum = forwardCfg[xianwei_riseFields.maxExp];
            } else { //其他均显示
                let nextCfg: Configuration.xianwei_rise = XianweiRiseCfg.instance.getXianweiRiseByLevel(this._showPage, 1);
                if (nextCfg) {
                    let attrAdd: Array<number> = [nextCfg[xianwei_riseFields.attack] - attr1, nextCfg[xianwei_riseFields.hp] - attr2, nextCfg[xianwei_riseFields.defense] - attr3];
                    this.setUpAttr(true, attrNum, attrAdd);
                    let rewardCfg: xianwei_rise = XianweiRiseCfg.instance.getNextAwardCfgByLv(this._showPage);
                    if (rewardCfg) {
                        this.awardName.text = `${rewardCfg[xianwei_riseFields.name]}奖励`;
                        this.awardName.visible = this.showAward.visible = true;
                        let reward: Items = rewardCfg[xianwei_riseFields.reward][0];
                        let data: Protocols.Item = [reward[ItemsFields.itemId], reward[ItemsFields.count], 0, null];
                        this.showAward.dataSource = data;
                        this.ylqImg.visible = Math.floor(this._showPage / 100) < Math.floor(MagicPositionModel.Instance.position / 100);
                    } else {
                        this.ylqImg.visible = this.awardName.visible = this.showAward.visible = false;
                    }
                }
                needNum = cfg[xianwei_riseFields.maxExp];
            }

            let haveNum = MagicPositionModel.Instance.haveNum;
            if (this._showPage < MagicPositionModel.Instance.position) {   //只会在一种情况中发生，就是往回按
                this._waveClip.y = 1;
            } else {
                let t: number = 1 - haveNum / needNum;
                if (t < 0) t = 0;
                else if (t > 1) t = 1;
                this._waveClip.y = t * 120;
            }
            this.numShow.text = `${haveNum}/${needNum}`;
            this._scheEffect1.y = 122 - 126 * (haveNum / needNum);
            if (this._scheEffect1.y <= -4) {
                this._scheEffect1.y = -4;
            }

            let data1: Protocols.Item = [cfg[xianwei_riseFields.wages][0][ItemsFields.itemId], cfg[xianwei_riseFields.wages][0][ItemsFields.count], 0, null];
            this._dailyGet[0].dataSource = data1;
            let data2: Protocols.Item = [cfg[xianwei_riseFields.wages][1][ItemsFields.itemId], cfg[xianwei_riseFields.wages][1][ItemsFields.count], 0, null];
            this._dailyGet[1].dataSource = data2;
            this.setGetAwardShow();
            this.checkRedPoint();
        }

        private checkRedPoint(): void {
            this.right_dot.visible = false;
            this.left_dot.visible = false;
            if (MagicPositionModel.Instance.minPos != -1) { //最小不为-1，则有可领取的
                if (this._showPage < MagicPositionModel.Instance.maxPos) { //比最大小
                    this.right_dot.visible = true;
                }
                if (this._showPage > MagicPositionModel.Instance.minPos) { //比最小大
                    this.left_dot.visible = true;
                }
            }
        }

        private turnBtnShow(): void {
            if (this._showPage == XianweiRiseCfg.instance.minLv) {  //先排除为第一个和最后一个的情况
                this.leftBtn.visible = false;
                this.rightBtn.disabled = false;
            } else if (this._showPage == XianweiRiseCfg.instance.maxLv) {
                this.rightBtn.disabled = this.rightBtn.visible = false;
                this.leftBtn.visible = true;
            } else if (this._showPage == XianweiRiseCfg.instance.getSideId(MagicPositionModel.Instance.position, 1)) {//控制只显示下一等级的内容
                this.rightBtn.visible = this.rightBtn.disabled = true;
                this.leftBtn.visible = true;
            } else {//排除所有特殊情况
                this.rightBtn.disabled = false;
                this.rightBtn.visible = this.leftBtn.visible = true;
            }
        }

        private showGetEffect(): void {

            for (let i: int = 0; i < 5; i++) {
                let img: Image = new Image("magic_position/icon_xianshi_1.png");
                this.addChild(img);
                img.anchorX = img.anchorY = 0.5;
                img.scale(0.8, 0.8);
                let posY = this.globalToLocal(MagicPositionModel.Instance.showPoint, true).y;
                img.pos(this._showX + i * 35, posY, true);
                let endX: number = 364;
                let endY: number = 360;
                TweenJS.create(img, this._tweenGroup).to({
                    x: endX,
                    y: endY,
                    alpha: 0.5
                }, 400 + Math.random() * 400).onComplete((): void => {
                    if (img)
                        img.destroy(true);
                }).onStop(() => {
                    if (img)
                        img.destroy(true);
                }).start();
            }

        }

        //设置显示属性（是否最后一个）
        private setUpAttr(isshow: boolean, attrNum: Array<number>, showNum?: Array<number>): void {
            if (isshow) {
                this.rightBtn.visible = true;
                for (let i = 0; i < this._upImg.length; i++) {
                    this._upImg[i].visible = this._upTxt[i].visible = true;
                    this._upTxt[i].text = showNum[i].toString();
                    this._attrName[i].x = 50;
                    this._attr[i].x = 110;
                    this._attr[i].text = attrNum[i].toString();
                }
            } else {
                this.rightBtn.visible = false;
                for (let i = 0; i < this._upImg.length; i++) {
                    this._upImg[i].visible = this._upTxt[i].visible = false;
                    this._attrName[i].x = 120;
                    this._attr[i].x = 180;
                    this._attr[i].text = attrNum[i].toString();
                }
            }
        }

        //设置每日俸禄显示
        private setGetAwardShow(): void {
            if (MagicPositionModel.Instance.checkHasDaily(this._showPage)) {
                this.getBtn.visible = true;
                this._btnClip.play();
                this.hasGet.visible = false;
                this._dailyGet[0].pos(377, 512);
                this._dailyGet[1].pos(463, 512);
            } else {
                this.getBtn.visible = false;
                this._btnClip.stop();
                if (this._showPage <= MagicPositionModel.Instance.position) {
                    this.hasGet.visible = true;
                    this._dailyGet[0].pos(377, 512);
                    this._dailyGet[1].pos(463, 512);
                } else {
                    this.hasGet.visible = false;
                    this._dailyGet[0].pos(443, 512);
                    this._dailyGet[1].pos(529, 512);
                }
            }
        }

        private leftBtnHandler(): void {
            this._showPage = XianweiRiseCfg.instance.getSideId(this._showPage, -1);
            this.turnPageHandler();
        }

        private rightBtnHandler(): void {
            this._showPage = XianweiRiseCfg.instance.getSideId(this._showPage, 1);
            this.turnPageHandler();
        }

        private getBtnHandler(): void {
            MagicPositionCtrl.Instance.getDailyAward(this._showPage);
        }
    }
}
