import "./frida"
import { Symbols } from "./Symbols"
import { InstDynaPhysDSG } from "./InstDynaPhysDSG"
import { Vector } from "./Radmath"
import { IntersectionList } from "./IntersectManager"
import { AvatarManager } from "./Avatar"

// Miscellaneous utility routines

export class Navigate {
    // Use intersect manager to scan for objects around me.
    static isPathBlocked(endPos: Vector): InstDynaPhysDSG | null {
        let i = new IntersectionList();
        return i.intersectScan(AvatarManager.getAvatar().GetCharacter(), endPos);
    }

    // I have no idea how to make this reliable.
    static async pathFind(startPos: Vector, endPos: Vector): Promise<Array<object>> {
        const path: Array<object> = await new Promise(function (resolve) {
            send({
                    cmd: "path",
                    params: {
                        start: startPos.toArray(),
                        end: endPos.toArray()
                    }
                }
            );
            console.log(`Navigate.pathFind: ${startPos.toString()} => ${endPos.toString()}`);
            recv(resolve);
        });
        console.log(`Navigate.pathFind: received ${path.length} components.`);
        return path;
    }
}