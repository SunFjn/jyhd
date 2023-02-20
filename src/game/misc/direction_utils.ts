namespace game.misc {
    import Point = Laya.Point
    type CallBackPoint = (pos:Point)=>void;
    export class DirectionUtils {
       private static _flags: Array<boolean> = [];
       //检查两点是否在一条水平线上
        public static checkTwoPointHorizontal(startPos:Point,desPos:Point):boolean{
            return startPos.y == desPos.y;
        }

        //获得一个直角点
        public static getRightAnglePoint(startPos:Point,desPos:Point):Point{
                let pos = new Point(desPos.x,desPos.y);
                //console.log("startPos = ",startPos,"\n desPos = ",desPos,"\n pos = ",pos);
                if (startPos.x <= desPos.x) {
                    pos.x = desPos.x - 300 
                } else {
                    pos.x = desPos.x + 300
                }
                //console.log("getRightAnglePoint = ",pos);
            return pos;
        }

        //获得两点之间连线和水平线的夹角
        public static getAngle(startPos:Point,desPos:Point):number{
            let disX = desPos.x - startPos.x;
            let disY = desPos.y - startPos.y;
            let disZ = Math.sqrt(Math.pow(disX,2) + Math.pow(disY,2));
            let radians = Math.asin(Math.abs(disY)/disZ);
            let angle = radians * 180 / Math.PI;
            return angle;
        }

        //两点之间与水平线的夹角超过一定角度,增加一个点用于转向
        public static directionCorrect(startPos:Point,desPos:Point,maxAngle:number,func:CallBackPoint){
            //let angle = DirectionUtils.getAngle(startPos,desPos);
            //console.log("directionCorrect startPos = ",startPos,"\n desPos = ",desPos);
            if (!DirectionUtils.checkTwoPointHorizontal(startPos,desPos)) {
                let pos = DirectionUtils.getRightAnglePoint(startPos,desPos);
                if (func) {
                    func(pos);
                }
            }
        }
    }
}