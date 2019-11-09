//
// This example script will serach for nearby objects then walk towards them.
//

var avatar = AvatarManager.getAvatar(true);
var intersect = new IntersectManager();
var blacklist = new Array();
var input = InputManager.GetController().GetMappable(2);
let myPos = new Vector(avatar.GetCharacter().rPosition);

console.log(`character is at ${myPos}`);

// Don't try to locate myself
blacklist.push(avatar.GetCharacter().getName());

// Begin search loop!
setTimeout(beginSearch, 0);

function beginSearch() {
    var object = pickTarget();

    // Make sure it doesn't get freed.
    object.AddRef();

    // Make sure we're on foot.
    avatar.putOnGround();

    // Start looking for the object.
    approachObject(object);

    // Make sure we don't pick it again.
    blacklist.push(object.getName());

    // Reduce reference count.
    object.Release();

    // Cleanup.
    global.gc();

    // Schedule repeat
    setTimeout(beginSearch, 500);
}

// Search for nearby objects.
function pickTarget(radius = 10) {
    let elements = intersect.FindDynaPhysElems(myPos, radius).toArray();

    // Log how many objects are around.
    console.log("search radius", radius, "found", elements.length, "objects");

    // Filter blacklisted objects.
    elements = elements.filter((a) => !blacklist.includes(a.getName()));

    // Increase radius if no match.
    if (elements.length == 0) {
        return pickTarget(radius + 1);
    }

    // Pick the first acceptable object.
    return elements.shift();
}

function foundObject(object)
{
    console.log(`object discovered at ${myPos}`);

    // Try to break it lol
    slam(); kick(5);

    return true;
}

function approachObject(object)
{
    // rPosition lets us make a live-updating object, rather than a snapshot.
    let objectPos = new Vector(object.rPosition);

    // Find size of the obect, as it's position is the centre point.
    let objectSize = object.GetBoundingSphere().radius;

    // Find the objects name for loging.
    let name = object.getName();

    console.log(`Approaching object ${name}, radius=${objectSize}`);

    for (let steps = 0; steps < 50;) {
        let prevDist = myPos.distanceTo(objectPos, true);

        console.log(`At ${myPos}, ${name} distance is ${prevDist}`);

        // Did we find the object?
        if (prevDist <= 1) {
            return foundObject(object);
        }

        // Move in current direction.
        step();

        // Check if we're getting closer.
        if ((prevDist - myPos.distanceTo(objectPos, true) < 0.075)) {
            // Guess not, try a new heading...
            rotate();

            // Try to shake ourselves loose if we're stuck...
            if (++steps % 10 == 0) {
                jump();
            }
        }
    }

    // Can't reach it :( Maybe this is a really big object and
    // we can't reach the center?
    if (myPos.distanceTo(objectPos, true) <= objectSize) {
        console.log(`This is as close we can get to large object`)
        return foundObject(object);
    }

    console.log(`unable to reach ${name}, giving up :-(`)

    // Choose another object.
    return false;
}

function kick(count = 1) {
    while (count-- > 0) {
        input.SimulateKeyPress(Mappable.id.Character.Attack);
        Thread.sleep(0.5);
    }
}

function slam() {
    input.SimulateKeyPress(Mappable.id.Character.Jump);
    Thread.sleep(0.3);
    input.SimulateKeyPress(Mappable.id.Character.Jump);
    input.SimulateKeyPress(Mappable.id.Character.Attack);
}

function jump() {
    toggleWalk();
    input.SimulateKeyPress(Mappable.id.Character.Jump);
    while (input.IsButtonDown(Mappable.id.Character.MoveUp))
        toggleWalk();
}

// one step moves us about 1 unit.
function step() {
    input.SimulateKeyPress(Mappable.id.Character.MoveUp);
}

function rotate() {
    input.SimulateKeyPress(Mappable.id.Character.feMouseLeft, 0.02);
}

function toggleWalk() {
    input.ToggleKeyDown(Mappable.id.Character.MoveUp);
}
