//
// This example script attempt to complete the current mission.
//

var objective = Mission.getObjective();
var avatar = AvatarManager.getAvatar(true);
var input = InputManager.GetController().GetMappable(2);
var myPos = new Vector(avatar.GetCharacter().rPosition);

console.log(`current mission is ${objective.GetObjectiveType()}`);

console.log(`i'm at ${myPos.toString()}`);
console.log(`target is at ${objective.getPosition().toString()}`);

function BeginPathFinding() {
    Navigate.pathFind(myPos, objective.getPosition()).then(function (path) {
        // Enable sprinting.
        input.UpdateButtonState(Mappable.id.Character.Sprint, 1.0);

        for (let i = 0; i < path.length; i++) {
            let nextStep = new Vector(path[i][0], path[i][1], path[i][2]);

            // As we get closer to target, dont allow too much difference.
            let maxDistance = path.length - i < 10 ? 1 : 2.5;

            if (StepTowardsPosition(nextStep, maxDistance) == false) {
                console.log(`Blocked from ${nextStep.toString()}, recalculate path...`)
                setTimeout(BeginPathFinding, 10);
                return;
            }
        }

        // Disable sprinting.
        input.UpdateButtonState(Mappable.id.Character.Sprint, 0);

        // Step towards final destination.
        StepTowardsPosition(objective.GetPosition(), 0.5);
    });
}

//setTimeout(BeginPathFinding, 0);

function avoidObstacle() {
    // Try avoiding obstacle.
    Jump();
    Jump();

    if (Math.random() < 0.5) {
        MoveLeft(3);
    } else {
        MoveRight(3);
    }
}

function StepTowardsPosition(target, maxDistance = 2.5, maxSteps = 10) {
    let supercam = SuperCamManager.getSuperCam();
    let avatar = AvatarManager.getAvatar(true);
    let myPos = new Vector(avatar.GetCharacter().rPosition);

    while (myPos.distanceTo(target, true) > maxDistance) {
        let camTarget = supercam.GetTarget();
        let camPosition = supercam.GetPosition();

        // Look at the target
        if (!camTarget.equals(target, 0.1)) {
            supercam.SetCameraValues(0, camPosition, target);
        }

        // Step forward
        MoveUp();

        // I dunno, maybe try to jump on ledges!
        if (target.y - myPos.y > 1) {
            Jump();
        }

        // Make sure we don't get stuck and loop forever.
        if (maxSteps-- <= 0) {
            let obstacle = Navigate.isPathBlocked(target);
            if (obstacle) {
                console.log(`I think there's a ${obstacle.getName()} in the way!`);
                avoidObstacle();
            }
            return false;
        }
    }

    return true;
}

function MoveUp() {
    input.SimulateKeyPress(Mappable.id.Character.MoveUp);
}
function MoveLeft(count=1) {
    while (count--)
        input.SimulateKeyPress(Mappable.id.Character.MoveLeft);
}
function MoveRight(count=1) {
    while (count--)
        input.SimulateKeyPress(Mappable.id.Character.MoveRight);
}
function Jump() {
    input.UpdateButtonState(Mappable.id.Character.MoveUp, 1.0);
    input.SimulateKeyPress(Mappable.id.Character.Jump);
    input.UpdateButtonState(Mappable.id.Character.MoveUp, 0.0);
}
