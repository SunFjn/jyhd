/** 精灵扭曲的次元空间右下面板*/


namespace modules.dailyDungeon {
    import PetRBViewUI = ui.PetRBViewUI;
    import BroadcastCopyMonsterWare = Protocols.BroadcastCopyMonsterWare;
    import BroadcastCopyMonsterWareFields = Protocols.BroadcastCopyMonsterWareFields;
    import CopyMonsterWareFields = Protocols.CopyMonsterWareFields;
    import SceneModel = modules.scene.SceneModel;
    import EnterSceneFields = Protocols.EnterSceneFields;
    import CopyTimes = Protocols.CopyTimes;
    import CopyTimesFields = Protocols.CopyTimesFields;
    import DungeonModel = modules.dungeon.DungeonModel;
    import Layer = ui.Layer;
    import sceneFields = Configuration.sceneFields;
    import shilianFields = Configuration.shilianFields;

    export class PetRBPanel extends PetRBViewUI {

        constructor() {
            super();
        }

        protected initialize(): void {
            super.initialize();

            this.centerX = 0;
            this.bottom = 240;
            this.layer = Layer.MAIN_UI_LAYER;
            this.closeByOthers = false;

        }

        protected addListeners(): void {
            super.addListeners();

            this.addAutoListener(GlobalData.dispatcher, CommonEventType.DUNGEON_BROADCAST_COPY_MONSTER_WARE, this, this.wareUpdate);
        }

        protected onOpened(): void {
            super.onOpened();

            // this.wareUpdate();
            let mapId: number = SceneModel.instance.enterScene[EnterSceneFields.mapId];
            let copyTimes: CopyTimes = DungeonModel.instance.timesTable[mapId];
            let sceneName = modules.config.SceneCfg.instance.getCfgById(mapId)[sceneFields.name];
            let diffcultLevelName = modules.config.ShilianCfg.instance.getCfgByLv(copyTimes[CopyTimesFields.diffcultLevel])[shilianFields.levelName];
            this.nameTxt.text = `${sceneName}(${diffcultLevelName})`;
            // if (mapId === SCENE_ID.scene_xianqi_copy) {
            //     this.nameTxt.text = `神之墟(${diffcultLevel})`;
            // } else if (mapId === SCENE_ID.scene_pet_copy) {
            //     this.nameTxt.text = `扭曲的次元空间(${diffcultLevel})`;
            // }
            // else if (mapId === SCENE_ID.scene_shenbing_copy) {
            //     this.nameTxt.text = `洛兰深处(${diffcultLevel})`;
            // }
            // else if (mapId === SCENE_ID.scene_wing_copy) {
            //     this.nameTxt.text = `苍穹落幕(${diffcultLevel})`;
            // }
            // else if (mapId === SCENE_ID.scene_fashion_copy) {
            //     this.nameTxt.text = `永恒之森(${diffcultLevel})`;
            // }
            // else if (mapId === SCENE_ID.scene_tianzhu_copy) {
            //     this.nameTxt.text = `旧忆·诅咒(${diffcultLevel})`;
            // }
            // else if (mapId === SCENE_ID.scene_xilian_copy) {
            //     this.nameTxt.text = `洗炼副本(${diffcultLevel})`;
            // }
            // else if (mapId === SCENE_ID.scene_guanghuan_copy) {
            //     this.nameTxt.text = `光环副本(${diffcultLevel})`;
            // }
            this.wareNumTxt.text = "";
        }

        private wareUpdate(): void {
            let ware: BroadcastCopyMonsterWare = DungeonModel.instance.broadcastCopyMonsterWare;
            if (!ware) return;
            let curWare: number = ware[BroadcastCopyMonsterWareFields.monsterWare][CopyMonsterWareFields.curWare];
            let totalWare: number = ware[BroadcastCopyMonsterWareFields.monsterWare][CopyMonsterWareFields.totalWare];
            this.wareNumTxt.text = (totalWare - curWare + 1) + "/" + totalWare;
        }
    }
}