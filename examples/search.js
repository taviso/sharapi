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
    var object;
    let elements = intersectManager.FindDynaPhysElems(
        character.GetPosition(),
        radius
    );

    console.log("search radius", radius, "found", elements.currentOccupancy, "objects");

    // There will always be 1 (us), if there's nothing else increase the search radius.
    if (elements.currentOccupancy < 2)
        continue;
    
    object = elements.getIndex(2);

    console.log("found object", object.getName());
    console.log("at", object.GetPosition().toArray());
    break;
}

// avatar.GetHeading().toArray()
// sendinput...
// walk
// check location
// adjust
// etc.
