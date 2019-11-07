// This example script will serach for nearby objects then walk towards them.

var avatarManager = new AvatarManager();
var avatar;

while (avatar == undefined)  {
    try { avatar = avatarManager.GetAvatarForPlayer(); } catch (e) {
        console.log("No avatar available yet, waiting...");
        Thread.sleep(1);
    }
}

var character = avatar.GetCharacter();
var input = InputManager.GetController().GetMappable(2);
var intersectManager = new IntersectManager();


// First make sure we're on foot.
if (avatar.IsInCar()) {
    console.log("Character is in vehicle, getting out...");
    avatarManager.PutCharacterOnGround(character, character.GetVehicle());
}

console.log("character is at", character.GetPosition().toArray())

// Search for nearby objects
for (let radius = 1; radius < 100; radius++) {
    var objects;
    let elements = intersectManager.FindDynaPhysElems(
        character.GetPosition(),
        radius
    );

    console.log("search radius", radius, "found", elements.currentOccupancy, "objects");

    // There will always be 1 (us), if there's nothing else increase the search radius.
    if (elements.currentOccupancy < 2)
        continue;
    
    // Dump objects found
    objects = elements.toArray();

    objects.forEach((a) => console.log(`Found ${a.getName()} at ${a.GetPosition().toArray()}`));

    if (objects[1].getName() == "homer")
        continue;

    break;
}

let object = objects[1];
let objectLocation = object.GetPosition();
let myLocation = new Vector(character.rPosition);
while (Math.abs(myLocation.x - objectLocation.x) > 1
    || Math.abs(myLocation.z - objectLocation.z) > 1) {
    let prevX = Math.abs(myLocation.x - objectLocation.x);
    let prevZ = Math.abs(myLocation.z - objectLocation.z);

    console.log("at", myLocation.toArray(), "looking for", object.getName());

    step();

    if (prevX < Math.abs(myLocation.x - objectLocation.x)
     || prevZ < Math.abs(myLocation.z - objectLocation.z)) {
        rotate();
    }

    Thread.sleep(0.2);
}

console.log("reached object")

for (var i = 0; i < 10; i++) {
    kick();
    Thread.sleep(0.2);
}

function kick() {
    input.SimulateKeyPress(Mappable.id.Character.Attack);
}

function jump() {
    input.SimulateKeyPress(Mappable.id.Character.Jump);
}
function step() {
    input.SimulateKeyPress(Mappable.id.Character.MoveUp);
}
function rotate() {
    input.SimulateKeyPress(Mappable.id.Character.feMouseLeft, 0.02);
}