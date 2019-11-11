# Example Scripts

## breakEverything.js

This script takes over the current character and starts walking towards the
nearest brekable object. If it can reach it, it tries to kick it. If you let
it run long enough, it will try to break literally everything.

### Usage

`$ python.exe inject.py examples/breakEverything.js`

### Dependencies

None

### Comments

This script doesn't do any clever pathfinding, it just takes a step forwards
and checks if the distance from the object is getting higher or lower. If it's
getting lower, it randomly selects a different heading.

All of the manipulation is with simulated input, so any state the character gets
into could be replicated by a human.

#### Distance

You can find the euclidean distance between two objects like this:

```javascript
    let distance = object1.distanceTo(object2);`
```

Sometimes you only care about the "overground" distance, ignoring height. For
example, if you want to walk towards the position of an aircraft in the sky, you
don't really care how far up it is.

```javascript
    let overgroundDistance = object1.distanceTo(obect2, true);
```

#### Input

You can simulate user input like this.

```javascript
    var input = InputManager.GetController().GetMappable(2);
    input.SimulateKeyPress(Mappable.id.Character.Jump);
```

There are some convenience functions for this in the Mappable and InputManager
classes.

You can also just teleport your character wherever you want (see
`Character.RelocateAndReset`), but simulating input is useful if you need to be
certain that any state you get into can be replicated by a human.

#### Finding Objects

The easiest way to find nearby objects is with the IntersectionManager.

```javascript
    var intersect = new IntersectManager();
    let objects = intersect.FindDynaPhysElems(myPos, radius).toArray();

    objects.forEach((a) => console.log(a.getName()));
```

This will find all dynamic physics elements within a sphere of `radius`, with
center at `Vector` `myPos`.

### Trivia

The game is mostly not re-entrant, which means calling internal routines with
frida will inevitably crash. I used frida `Interceptors` to add locks,
hopefully it works, but I probably missed some.


# helloWorld.js

This script just demonstrates altering the game UI.

## Usage

`python.exe inject.py examples/helloWorld.js`

## Dependencies

None.

## Comments

The API is pretty complex, but also quite powerful, you can probably make
or query whatever it is you want.


