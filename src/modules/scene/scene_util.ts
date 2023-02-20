/*
 * @Author: yuyongyuan 1784394982@qq.com
 * @Date: 2022-11-21 17:23:24
 * @LastEditors: yuyongyuan 1784394982@qq.com
 * @LastEditTime: 2022-11-25 13:35:00
 * @FilePath: \hengban_game\src\modules\scene\scene_util.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
namespace modules.scene {

    export class SceneUtil {

        constructor() {
        }

        public static get isCommonScene(): boolean {
            let mapId: number = SceneModel.instance.enterScene[Protocols.EnterSceneFields.mapId];
            let cfg: Configuration.scene = config.SceneCfg.instance.getCfgById(mapId);
            let type: int = cfg[Configuration.sceneFields.type];
            return type === SceneTypeEx.common;
        }

        //当前所处场景
        public static get currScene(): SceneTypeEx {
            let mapId: number = SceneModel.instance.enterScene[Protocols.EnterSceneFields.mapId];
            let cfg: Configuration.scene = config.SceneCfg.instance.getCfgById(mapId);
            let type: int = cfg[Configuration.sceneFields.type];
            return type;
        }
        // 是否只有主角
        public static get singleScene(): boolean {
            return [
                SceneTypeEx.common,
                SceneTypeEx.dahuangCopy,
                SceneTypeEx.runeCopy,
                SceneTypeEx.xianqiCopy,
                SceneTypeEx.petCopy,
                SceneTypeEx.shenbingCopy,
                SceneTypeEx.wingCopy,
                SceneTypeEx.fashionCopy,
                SceneTypeEx.tianzhuCopy,
                SceneTypeEx.xilianCopy,
                SceneTypeEx.copperCopy,
                SceneTypeEx.zqCopy,
            ].indexOf(SceneUtil.currScene) > -1
        }
        // 仙府-家园场景
        public static get isXianfu(): boolean {
            return [
                SceneTypeEx.homestead,
            ].indexOf(SceneUtil.currScene) > -1
        }
        // 仙府-家园区域
        public static get xianfuPanelType(): number {
            return modules.xianfu.XianfuModel.instance.panelType
        }
    }
}