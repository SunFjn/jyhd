/**
 * 姻缘面板
 */
namespace modules.marry {
    import MarryRingViewUI = ui.MarryRingViewUI;
    import Sprite = Laya.Sprite;
    import Event = Laya.Event;
    import Texture = Laya.Texture;
    import Layer = ui.Layer;
    import Image = Laya.Image;
    import Text = Laya.Text;
    import LayaEvent = modules.common.LayaEvent;
    import SkillInfo = Protocols.SkillInfo;
    import SkillItem = modules.immortals.SkillItem;
    import FeedSkillType = ui.FeedSkillType;
    import BlendCfg = modules.config.BlendCfg;
    import blend = Configuration.blend;
    import blendFields = Configuration.blendFields;
    import marry_ring = Configuration.marry_ring;
    import marry_ringFields = Configuration.marry_ringFields;
    import SystemNoticeManager = modules.notice.SystemNoticeManager;
    import CustomClip = modules.common.CustomClip;
    import FeedAttrType = ui.FeedAttrType;
    import SkillInfoFields = Protocols.SkillInfoFields;
    import FuncOpenModel = modules.funcOpen.FuncOpenModel;

    export class MarryRingPanel extends MarryRingViewUI {

        constructor() {
            super();
        }
        private _attrNameTxts: Array<Text>;
        private _upAttrTxts: Array<Text>;
        private _arrowImgs: Array<Image>;
        private btnClip: CustomClip;
        private _tween: TweenJS;
        protected initialize(): void {
            super.initialize();
            this.titleTxt.color = "#e26139"

            this._attrNameTxts = [this.nameTxt_1, this.nameTxt_2, this.nameTxt_3, this.nameTxt_4];
            this._upAttrTxts = [this.liftTxt_1, this.liftTxt_2, this.liftTxt_3, this.liftTxt_4];
            this._arrowImgs = [this.upArrImg_1, this.upArrImg_2, this.upArrImg_3, this.upArrImg_4];

            this.btnClip = new CustomClip();
            this.feedBtn.addChild(this.btnClip);
            this.btnClip.skin = "assets/effect/btn_light.atlas";
            this.btnClip.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            this.btnClip.durationFrame = 5;
            this.btnClip.loop = true;
            this.btnClip.pos(-6, -11);
            this.btnClip.scale(0.98, 0.9);
            this.btnClip.visible = false;

            if (!this._tween) {
                this._tween = TweenJS.create(this.itemImg).yoyo(true).repeat(99999999);
                this._tween
                    .to({ y: 180 }, 1200)
                    .to({ y: 200 }, 1000)
                    .start()
            }
        }

        protected addListeners(): void {
            super.addListeners();
            this.addAutoListener(this.tipsBtn, LayaEvent.CLICK, this, this.openTips);
            this.addAutoListener(this.copyBtn, LayaEvent.CLICK, this, this.openCopy);
            this.addAutoListener(this.engravingBtn, LayaEvent.CLICK, this, this.openEngraving);
            this.addAutoListener(this.resonanceBtn, LayaEvent.CLICK, this, this.openResonance);
            this.addAutoListener(this.feedBtn, LayaEvent.CLICK, this, this.sendFeed);
            this.addAutoListener(this.marryGiftBtn, LayaEvent.CLICK, this, this.marryGiftHandler)
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_RING_UPDATE, this, this.loadData);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.MARRY_GIFT_UPDATE, this, this.updateMarryGift);

            this.copyBtn[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
            this.resonanceBtn[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
            this.engravingBtn[GlobalSecondEffectBtnTag.BTN_KEY] = GlobalSecondEffectBtnTag.BTN_VALUE;
        }

        private updateMarryGift() {
            this.marryGiftBtn.visible = MarryModel.instance.getMarryGiftVisible();
            console.log("this.marryGiftBtn.DDD",  MarryModel.instance.getMarryGiftVisible());
            
        }

        private openTips() {
            CommonUtil.alertHelp(70004);
        }
        private marryGiftHandler() {
            WindowManager.instance.open(WindowEnum.MARRY_GIFT_ALERT);
        }
        private openCopy() {
            WindowManager.instance.open(WindowEnum.MARRY_Copy_Alert);
        }
        private openEngraving() {
            modules.notice.SystemNoticeManager.instance.addNotice("需要装备永恒缘戒或至尊缘戒后才可开启刻印", true);
            return;
            WindowManager.instance.open(WindowEnum.MARRY_Engraving_Alert);
        }
        private openResonance() {
            modules.notice.SystemNoticeManager.instance.addNotice("需要装备永恒缘戒或至尊缘戒后才可开启共鸣", true);
            return;
            WindowManager.instance.open(WindowEnum.MARRY_Resonance_Alert);
        }


        protected removeListeners(): void {
            super.removeListeners();

        }

        protected onOpened(): void {
            super.onOpened();
            this.loadData();




        }
        private sendFeed() {

            if (Number(this.numTxt.text) <= 0) {
                SystemNoticeManager.instance.addNotice("材料不足!", true);
                WindowManager.instance.open(WindowEnum.LACK_PROP_ALERT, [this._FeedId, 0, true]);
            } else if (this._FeedId == 0) {
                SystemNoticeManager.instance.addNotice("已满级无法继续培养!", true);
            } else {
                MarryCtrl.instance.FeedMarryRing()
            }



        }
        private _FeedId: number = 0
        //加载数据
        public loadData(): void {
            let lv = MarryModel.instance.getRingLevel()
            let ringCfg = MarryRingCfg.instance.getLevelCfg(lv)
            let ringNextCfg = MarryRingCfg.instance.getLevelCfg(lv + 1)
            if (ringNextCfg) {
                let icon = CommonUtil.getIconById(ringNextCfg[marry_ringFields.items][0], true);
                this.icons.skin = icon
                this._FeedId = ringNextCfg[marry_ringFields.items][0]
                this.numTxt.text = MarryModel.instance.getItemCountById(ringNextCfg[marry_ringFields.items][0]).toString();
            } else {
                //已满级
                this.feedBtn.visible = !!ringNextCfg;
            }
            this.numTxt.color = this.numTxt.text != "0" ? "#a43a11" : "#ff0300"
            if (this.numTxt.text != "0") {
                this.feedRP.visible = true
                this.btnClip.visible = true;
                this.btnClip.play();
            } else {
                this.feedRP.visible = false
                this.btnClip.visible = false;
                this.btnClip.stop();
            }

            let widthMax = 415;// 当前进度条宽度
            //17040002#1#10
            this.setAttr(ringCfg, ringNextCfg)
            let exp = MarryModel.instance.getRingExp()
            this.levelTxt.text = `Lv.${lv}`;
            this.progressTxt.text = `${exp}/${ringCfg[marry_ringFields.exp]}`;
            this.progressBar.width = (exp / ringCfg[marry_ringFields.exp]) * widthMax;

            // 设置技能
            let arr: number[] = MarryRingCfg.instance.getAllSkill();
            for (let i: int = 0, len = arr.length; i < len; i++) {
                if (this.skillBox._childs.length > i) {
                    let lv = MarryModel.instance.getSkillLevel(arr[i])
                    let id = CommonUtil.getSkillIdByPureIdAndLv(arr[i], lv > 0 ? lv : 1);
                    let _item: SkillInfo = [id, lv, MarryModel.instance.getUpLevelStart(FeedSkillType.yiJie, lv, id)];
                    this.skillBox._childs[i].skillId = id;
                    this.skillBox._childs[i].skillInfo = _item;
                    (this.skillBox._childs[i] as SkillItem).type = FeedSkillType.yiJie;
                    (this.skillBox._childs[i] as SkillItem).stopUpgradeCallBack = ()=>{
                        let skillItem = this.filterOneSkillItem()
                        if (skillItem) {
                            skillItem.clickHandler();
                        }
                    };
                }
            }


            // 设置技能
            let cfg: blend = BlendCfg.instance.getCfgById(70010);
            let skill: number[] = cfg[blendFields.intParam];
            for (let i: int = 0, len = skill.length; i < len; i++) {
                let index = i + 4
                console.log('研发测试_chy:this.skillBox._childs.length > index', this.skillBox._childs.length, index);
                if (this.skillBox._childs.length > index) {
                    let lv = MarryModel.instance.getSkillLevel(skill[i])
                    let id = CommonUtil.getSkillIdByPureIdAndLv(skill[i], lv > 0 ? lv : 1);
                    console.log('研发测试_chy:MarryModel.instance.getUpLevelStart(FeedSkillType.yiJieEx, lv, id)', MarryModel.instance.getUpLevelStart(FeedSkillType.yiJieEx, lv, id));
                    let _item: SkillInfo = [id, lv, MarryModel.instance.getUpLevelStart(FeedSkillType.yiJieEx, lv, id)];
                    console.log('研发测试_chy:item ring ', _item, cfg);
                    this.skillBox._childs[index].skillId = id;
                    this.skillBox._childs[index].skillInfo = _item;
                    (this.skillBox._childs[index] as SkillItem).type = FeedSkillType.yiJieEx;
                }
            }

            this.copyRP.visible = MarryModel.instance.getCopyRP();

            this.powerNum.value = MarryModel.instance.getfighting(FeedAttrType.yiJie).toString()

            let icon = MarryModel.instance.ringId
            if (icon == 0) icon = 16250002
            this.itemImg.skin = CommonUtil.getIconById(icon, true);
            this.nameTxt.text = CommonUtil.getNameByItemId(icon);

            // 设置缘分大作战是否开启
            this.marryGiftBtn.visible = MarryModel.instance.getMarryGiftVisible();
        }

        // 筛选能够升级Skill
        private filterOneSkillItem():SkillItem{
            for (let i: int = 0, len = this.skillBox._childs.length; i < len; i++) {
                let skillItem:SkillItem = this.skillBox._childs[i];
                if (skillItem.skillInfo && skillItem.skillInfo[SkillInfoFields.point] > 0) {
                    return skillItem;
                }
            }
            return null;
        }

        //设置属性加成列表
        private setAttr(cfg: marry_ring, nextCfg: marry_ring): void {

            let t: number = common.AttrUtil.setAttrTxts(
                cfg,
                nextCfg,
                this._attrNameTxts,
                null,
                this._arrowImgs,
                this._upAttrTxts,
                marry_ringFields.attrs
            );
        }

        //设置面板打开信息
        public setOpenParam(value: any): void {
            super.setOpenParam(value);

        }

        public close(): void {
            super.close();
        }


    }
}