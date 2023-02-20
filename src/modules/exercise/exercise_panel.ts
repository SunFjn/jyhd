///<reference path="../config/exercise_cfg.ts"/>
///<reference path="../born/born_model.ts"/>
/// <reference path="../config/blend_cfg.ts" />


namespace modules.exercise {
    import ExerciseViewUI = ui.ExerciseViewUI;
    import ProgressBarCtrl = modules.common.ProgressBarCtrl;
    import CustomList = modules.common.CustomList;
    import BaseItem = modules.bag.BaseItem;
    import ExerciseCfg = modules.config.ExerciseCfg;
    import lilian_riseFields = Configuration.lilian_riseFields;
    import ItemsFields = Configuration.ItemsFields;
    import BornModel = modules.born.BornModel;
    import lilian_dayFields = Configuration.lilian_dayFields;
    import CustomClip = modules.common.CustomClip;
    import Image = Laya.Image;
    import CommonEventType = modules.common.CommonEventType;
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import LayaEvent = modules.common.LayaEvent;
    import lilian_day = Configuration.lilian_day;

    export class ExercisePanel extends ExerciseViewUI {

        // private _ratioBar: ProgressBarCtrl;
        private _activeBar: ProgressBarCtrl;
        private _list: CustomList;
        /**
         * 冒险团等级奖励物品数组
         */
        private _prizeArr: Array<BaseItem>;

        /**
        * 活跃等级奖励物品数组
        */
        private _activeAwardArr: Array<BaseItem>;

        /**
         * 当前觉醒等级对应档次的活跃值
         */
        private _nowGrade: number[]


        private _CNum: number;
        private _currMszLev: number;
        private _lev: number;

        public destroy(destroyChild: boolean = true): void {
            this._list = this.destroyElement(this._list);
            this._prizeArr = this.destroyElement(this._prizeArr);
            // this._ratioBar = this.destroyElement(this._ratioBar);
            this._activeBar = this.destroyElement(this._activeBar);
            super.destroy(destroyChild);
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.centerY = 0;

            this._CNum = 0;

            this._currMszLev = 1;
            this._lev = 101;

            // this._ratioBar = new ProgressBarCtrl(this.ratioBarImg, this.ratioBarImg.width, this.ratioTxt);
            this._activeBar = new ProgressBarCtrl(this.activeBarImg, this.activeBarImg.width, this.active_text);
            this._list = new CustomList();
            this._list.scrollDir = 1;
            this._list.width = 714;
            this._list.height = 376;
            this._list.hCount = 1;
            this._list.itemRender = ExerciseItem;
            this._list.x = 2;
            this._list.y = 770;
            this._list.spaceY = 1;
            this.addChild(this._list);

            this._prizeArr = new Array<BaseItem>();
            for (let i: int = 0, len: int = 2; i < len; i++) {
                this._prizeArr[i] = new BaseItem();
                this._prizeArr[i].scale(0.8, 0.8);
                this._prizeArr[i].nameVisible = false;
                this.addChild(this._prizeArr[i]);
            }
            this._prizeArr[0].pos(510, 110);
            this._prizeArr[1].pos(610, 110);
        }

        protected onOpened(): void {
            super.onOpened();
            this.showActiveLevelAward();

            this.updataView();

            this.DHNameMsz.skin = `exercise/sth_level_${Math.floor(this._lev / 100)}.png`;  //需要阶数

            let _cfg = ExerciseCfg.instance.getZLLCfgByLev(this._lev)

            let temp = _cfg[lilian_riseFields.medal]
            this.medalImage.skin = "exercise/" + temp
            this.medal_name_image.skin = "exercise/badge_" + temp[temp.length - 5] + ".png"
            this._currMszLev = this._lev;              //显示的第几阶
            this.ClevMsz1.value = this._CNum.toString();      //需要重数

            this.creatTaskList();
            CustomList.showListAnim(modules.common.showType.HEIGHT, this._list);
        }

        public close(): void {
            super.close();
            this._activeAwardArr = this.destroyElement(this._activeAwardArr);
            common.ItemRenderNoticeManager.instance.stop();
        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LILIAN_UPDATA, this, this.updataView);
            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LILIAN_UPGRADE, this, this.openAlert);

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.LILIAN_UPDATA_TASK_LIST, this, this.creatTaskList);
        }

        private openAlert(): void {
            WindowManager.instance.openDialog(WindowEnum.EXERCISE_ALERT,
                [this._prizeArr[0].itemData, this._prizeArr[1].itemData]);

            this._lev = ExerciseModel.instance.getOtherValue(4);                 //等级
            let _cfg = ExerciseCfg.instance.getZLLCfgByLev(this._lev)

            let temp = _cfg[lilian_riseFields.medal]
            this.medalImage.skin = "exercise/" + temp
            this.medal_name_image.skin = "exercise/badge_" + temp[temp.length - 5] + ".png"

            if (this._lev == 0) this._lev = 101;
            this._CNum = this._lev % 100;

            this.DHNameMsz.skin = `exercise/sth_level_${Math.floor(this._lev / 100)}.png`;  //需要阶数
            this._currMszLev = this._lev;                                                //显示的第几阶
            let _chong = this._CNum;
            if (_chong == 10) _chong = 0;
            this.ClevMsz1.value = _chong.toString();                                 //需要重数

        }

        private updataView(): void {
            this._lev = ExerciseModel.instance.getOtherValue(4);                 //等级
            if (this._lev == 0) this._lev = 101;
            this._CNum = this._lev % 100;                                                    //重数
            let _cfg = ExerciseCfg.instance.getZLLCfgByLev(this._lev);                     //当前配置
            let _nextCfg = ExerciseCfg.instance.getNextCfgByCurrLev(this._lev);            //下一等级配置
            this.ratioTxt.text = ExerciseModel.instance.getOtherValue(5) + "/" + _cfg[lilian_riseFields.maxExp]
            this.atkValueMsz.value = _cfg[lilian_riseFields.fighting].toString();
            if (this._CNum == 10) this._CNum = 0;
            let _CSum = ExerciseCfg.instance.getChongByJie(Math.floor(this._lev / 100));       //总重数

            // this.DHEffect.text = `活跃值抵御：高重数活跃值玩家受到低重数的伤害减免${BlendCfg.instance.getCfgById(42002)[blendFields.intParam][0] * 100}%`;

            this.contentTxt_1.text = _cfg[lilian_riseFields.attack].toString();
            this.contentTxt_2.text = _cfg[lilian_riseFields.hp].toString();
            if (!_nextCfg) {
                this.liftTxt_1.destroy();
                this.liftTxt_2.destroy();
                this.nextAwardTitle.text = "已满重";
                this.hpAttrUpImg.visible = false;
                this.atkAttrUpImg.visible = false;
            } else {
                this.liftTxt_1.text = (_nextCfg[lilian_riseFields.attack] - _cfg[lilian_riseFields.attack]).toString();
                this.liftTxt_2.text = (_nextCfg[lilian_riseFields.hp] - _cfg[lilian_riseFields.hp]).toString();
                this.hpAttrUpImg.visible = true;
                this.atkAttrUpImg.visible = true;
            }

            this._prizeArr[0].dataSource = [_cfg[lilian_riseFields.reward][0][ItemsFields.itemId],
            _cfg[lilian_riseFields.reward][0][ItemsFields.count], 0, null];
            this._prizeArr[1].dataSource = [_cfg[lilian_riseFields.reward][1][ItemsFields.itemId],
            _cfg[lilian_riseFields.reward][1][ItemsFields.count], 0, null];

            let _eraLev = Math.floor(BornModel.instance.lv / 100);   //觉醒转等级

            let dayCfg = ExerciseCfg.instance.getLLDayCfgByEraLevAndLev(_eraLev, ExerciseModel.instance.getOtherValue(2));
            let _maxDayCfg = ExerciseCfg.instance.getLLDayCfgByEraLev(_eraLev);          //当前转最大档次配置
            if (!_maxDayCfg) _maxDayCfg = ExerciseCfg.instance.getMaxLLDayCfg();
            let currRatio = ExerciseModel.instance.getOtherValue(1);
            if (currRatio > _maxDayCfg[lilian_dayFields.maxExp]) {
                currRatio = _maxDayCfg[lilian_dayFields.maxExp];
            }

            this._activeBar.maxValue = 300;
            this._activeBar.value = ExerciseModel.instance.getOtherValue(1);
            if (this._activeBar.value > this._activeBar.maxValue) this._activeBar.value = this._activeBar.maxValue;
            this.active_value.text = this._activeBar.value + "";
            // this.mask.y = this._activeBar.value / 300 * this.mask.height;
            this.active_bar.height = this._activeBar.value / 300 * 74;
            this._activeBar.moleculeTxt = ExerciseModel.instance.getOtherValue(1);
            this.active_text.text = `${currRatio}/${300}`;

            // this._ratioBar.maxValue = _cfg[lilian_riseFields.maxExp];
            // this._ratioBar.value = ExerciseModel.instance.getOtherValue(5);
            // if (this._ratioBar.value > this._ratioBar.maxValue) this._ratioBar.value = this._ratioBar.maxValue;
            // this._ratioBar.moleculeTxt = ExerciseModel.instance.getOtherValue(5);540

            let nowValue=ExerciseModel.instance.getOtherValue(5);
            let maxValue=_cfg[lilian_riseFields.maxExp];
            if (nowValue > maxValue) nowValue = maxValue;
            this.ratioBarMask.width=nowValue/maxValue*540;

            this.fitAwardPos();


            // this._prizeArr[2].dataSource = [dayCfg[lilian_dayFields.reward][0][ItemsFields.itemId],
            // dayCfg[lilian_dayFields.reward][0][ItemsFields.count], 0, null];
            // this._prizeArr[3].dataSource = [dayCfg[lilian_dayFields.reward][1][ItemsFields.itemId],
            // dayCfg[lilian_dayFields.reward][1][ItemsFields.count], 0, null];

            if (ExerciseModel.instance.getOtherValue(3) == 2 &&
                ExerciseModel.instance.getOtherValue(2) == _maxDayCfg[lilian_dayFields.grade]) { //已经领取并且最高档次
                // this.ylqImg.visible = true;
                // this.wdcImg.visible = false;

                // this.DHDayTxt.text = "今日累计活跃值已达上限";
                // this.DHratioTxt.visible = false;
            } else {
                // this.DHDayTxt.text = "今日累计活跃值:";
                // this.DHratioTxt.visible = true;
                if (currRatio < dayCfg[lilian_dayFields.maxExp]) {
                    // this.ylqImg.visible = false;
                    // this.wdcImg.visible = true;
                } else {
                    // this.ylqImg.visible = false;
                    // this.wdcImg.visible = false;
                }
            }
            this.greyAward()
        }



        private showBall(img: Image, showFront: boolean): void {
            img.skin = showFront ? "exercise/zs_lilian_1.png" : "exercise/zs_lilian_2.png";
        }

        private creatTaskList(): void {
            let taskIndex: number = common.ItemRenderNoticeManager.instance.index;
            if (taskIndex == null) {
                this._list.datas = ExerciseModel.instance.tasks;
                return;
            }
            let itemRender: ItemRender = this._list.items[taskIndex];
            common.ItemRenderNoticeManager.instance.addNotice(itemRender, CommonEventType.LILIAN_UPDATA_TASK_LIST);
        }
        /**
         * 自动适配日活跃奖励展示
         * @param max 
         */
        private fitAwardPos() {
            let max = 300
            let _eraLev = Math.floor(BornModel.instance.lv / 100);   //觉醒转等级
            let dayCfg: Table<lilian_day> = ExerciseCfg.instance.getLLDayCfgByLevel(_eraLev);

            let gradeTexts: Laya.Text[] = this.active_parent._childs as Laya.Text[]
            let awardNodes: Laya.Text[] = this.allAwards._childs as Laya.Text[]
            let allWidth = this.active_parent.width

            for (let index = 1; index < 5; index++) {
                let awardValue = dayCfg[index][lilian_dayFields.maxExp];
                gradeTexts[index - 1].x = allWidth * (awardValue / max) - 50;
                awardNodes[index - 1].x = allWidth * (awardValue / max) - 75;
                gradeTexts[index - 1].text = awardValue + "";
            }
        }

        /**
         * 展示活跃奖励
         */
        private showActiveLevelAward() {
            this._activeAwardArr = []
            this._nowGrade = []
            let _eraLev = Math.floor(BornModel.instance.lv / 100);   //觉醒转等级
            let dayCfg: Table<lilian_day> = ExerciseCfg.instance.getLLDayCfgByLevel(_eraLev);
            for (let index = 1; index < 5; index++) {
                this.showOneLevelAward(dayCfg, index)
            }
        }
        /**
         * 显示一档活跃奖励
         * @param cfgs 
         * @param level 
         * @returns 
         */
        private showOneLevelAward(cfgs: Table<lilian_day>, level: number): BaseItem[] {
            let tempBases: BaseItem[] = [];
            let base1 = new BaseItem();
            // let base2 = new BaseItem();
            let dayCfg = cfgs[level]
            base1.dataSource = [dayCfg[lilian_dayFields.nullBox],
            0, 0, null];

            this._nowGrade.push(dayCfg[lilian_dayFields.maxExp])

            this.allAwards._childs[level - 1]._childs[0].addChild(base1)
            base1.scale(0.6, 0.6)
            base1.pos(-16, -10)



            // base2.dataSource = [dayCfg[lilian_dayFields.reward][1][ItemsFields.itemId],
            // dayCfg[lilian_dayFields.reward][1][ItemsFields.count], 0, null];

            // this.allAwards._childs[level - 1]._childs[1].addChild(base2)
            // base2.scale(0.45, 0.45)
            // base2.pos(0, 0)

            tempBases.push(base1)
            // tempBases.push(base2)

            this._activeAwardArr.push(base1)
            // this._activeAwardArr.push(base2)

            return tempBases
        }
        /**
         * 置灰已领取的奖励
         */
        private greyAward() {
            if (this._activeAwardArr && this._activeAwardArr.length > 0) {
                this._activeAwardArr.forEach((element, index) => {
                    if (ExerciseModel.instance.getOtherValue(1) >= this._nowGrade[index]) {
                        element.grayFilter = true;
                        element.setClip(false)
                    }
                });
            }
        }
    }
}
