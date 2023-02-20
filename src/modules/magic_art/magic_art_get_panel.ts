/** 技能获得弹窗 */


namespace modules.magicArt {
    import MagicArtGetViewUI = ui.MagicArtGetViewUI;
    import skill = Configuration.skill;
    import skillFields = Configuration.skillFields;
    import skillTrain = Configuration.skillTrain;
    import skillTrainFields = Configuration.skillTrainFields;
    import Image = laya.ui.Image;
    import Point = laya.maths.Point;

    export class MagicArtGetPanel extends MagicArtGetViewUI {
        constructor() {
            super();
            this.destin = new Point(200, 60);
        }

        private skillId: number;
        private destin: Point;

        public setOpenParam(value: any): void {
            super.setOpenParam(value);
            this.skillId = value as number;
            this.centerX = 0;
            this.centerY = 0;
            this.showInfo();
            Laya.timer.loop(1000, this, this.close);

        }

        protected initialize(): void {
            super.initialize();
        }

        public showInfo(): void {
            let type = Math.floor(this.skillId / 1000);
            let skillInfo: skill = MagicArtModel.instance.getCfgById(this.skillId * 10000 + 1);
            if (type == 1) {
                this.knowledgeShow.visible = true;
                this.scienceShow.visible = false;
                this.topTitleImg.skin = 'magic_art/msz_xianshu_1.png';
                this.knowledgeIconImg.skin = `assets/icon/skill/${skillInfo[skillFields.icon]}.png`;
                this.knowledgeName.text = skillInfo[skillFields.name];

            } else if (type == 2 || type == 4) {
                this.knowledgeShow.visible = false;
                this.scienceShow.visible = true;
                this.topTitleImg.skin = 'magic_art/msz_xianshu_2.png';
                this.scienceIconImg.skin = `assets/icon/skill/${skillInfo[skillFields.icon]}.png`;
                this.scienceName.text = skillInfo[skillFields.name];
                let skillTrainInfo: skillTrain = MagicArtModel.instance.getScienceCfgById(this.skillId * 10000 + 1);
                this.scienceDescribe.text = skillTrainInfo[skillTrainFields.short_des];
            }
            // this.itemEffect();
        }

        public close(): void {
            super.close();
            Laya.timer.clear(this, this.close);
            this.itemEffect();
        }

        private itemEffect(): void {
            let type = Math.floor(this.skillId / 1000);

            let img = new Image();
            let skillInfo: skill = MagicArtModel.instance.getCfgById(this.skillId * 10000 + 1);
            img.skin = `assets/icon/skill/${skillInfo[skillFields.icon]}.png`;
            img.anchorX = img.anchorY = 0.5;
            let heightP = this.height;
            let destinX1 = CommonConfig.viewWidth / 2;
            let destinY1 = CommonConfig.viewHeight / 2;
            if (type == 1) {
                destinX1 = CommonConfig.viewWidth / 2;
            } else {
                destinX1 = CommonConfig.viewWidth / 2 - 177;
                destinY1 = CommonConfig.viewHeight / 2;
            }

            img.pos(destinX1, destinY1);
            LayerManager.instance.addToNoticeLayer(img);
            let viewWidth = CommonConfig.viewWidth;
            let viewHeight = CommonConfig.viewHeight;
            let destinX = CommonConfig.viewWidth / 2 - this.destin.x;
            let destinY = CommonConfig.viewHeight - this.destin.y;
            TweenJS.create(img).to({ scaleX: 1.5, scaleY: 1.5 }, 400).onComplete((): void => {
                TweenJS.create(img).to({ scaleX: 1.1, scaleY: 1.1 }, 400).onComplete((): void => {
                    TweenJS.create(img).to({
                        x: destinX,
                        y: destinY,
                        scaleX: 0.2,
                        scaleY: 0.2
                    }, 600).onComplete((): void => {
                        img.destroy(true);
                    }).start()
                }).start()
            }).start()
        }
    }
}