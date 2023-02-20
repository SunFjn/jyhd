namespace game.misc {
    import Transform3D = Laya.Transform3D;
    import Quaternion = Laya.Quaternion;
    import Vector3 = Laya.Vector3;
    const ProjectionRadian = (35 * Math.PI / 180) * 0.5;
    const ProjectionQuaternion = new Laya.Quaternion(Math.sin(ProjectionRadian), 0, 0, Math.cos(ProjectionRadian));

    const ProjectionModelRadian = (15 * Math.PI / 180) * 0.5;
    const ProjectionModelQuaternion = new Laya.Quaternion(Math.sin(ProjectionModelRadian), 0, 0, Math.cos(ProjectionModelRadian));

    export class RoleUtils {
        public static projectionRotateY(transform: Transform3D, value: number): void {
            let quaternion = transform.localRotation;
            ProjectionQuaternion.rotateY(value * Math.PI / 180, quaternion);
            transform.localRotation = quaternion;
        }

        public static projectionModelRotateY(transform: Transform3D, value: number): void {
            let quaternion = transform.localRotation;
            ProjectionModelQuaternion.rotateY(value * Math.PI / 180, quaternion);
            transform.localRotation = quaternion;
        }

        public static projectionYawPitchRoll(value: number): Vector3 {
            let quaternion = new Quaternion();
            ProjectionQuaternion.rotateY(value * Math.PI / 180, quaternion);
            let v = new Vector3();
            quaternion.getYawPitchRoll(v);
            return v;
        }
    }
}