// namespace game.misc {
//     export class Statistics {
//         public static user: string;
//         public static entryId: number;
//         public static ip: string;
//         public static port: number;
//
//         public static authRequest(status: number, id: number): void {
//             let request = new XMLHttpRequest();
//             request.open("GET", `http://192.168.2.18:8070/api/index.php?s=node&channel=${this.ip}:${this.port}&server=${this.entryId}&account=${this.user}&status=${status}&role_id=${id}`);
//             request.send();
//         }
//     }
// }