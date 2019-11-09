# Simpsons: Hit & Run API

> ***This code is in a pre-pre-pre-alpha experimental state.***

This is a library to facilitate automating the abandonware game Simpsons: Hit &
Run with JavaScript. It uses [frida](https://frida.re) to access internal state,
and exposes JavaScript classes that can be used to query and control the game.

The intention is to allow easy scriptable access to state, in a similar way to
how [pysc2](https://github.com/deepmind/pysc2) enabled deepmind to learn how to
play Starcraft II. Eventually I'd like to be able to automate finding glitches,
crashes, strategies, routes and so on for speedrunning.

> *This is a solo hobby project, and I'm a long way off from that point.*

Want to see it in action? Here is an early demo video using the debugging
console.

[![Video](doc/video.png)](https://www.youtube.com/watch?v=cpmvSQ2l3Nc)

Want to see an example script? Here is a simple script that just finds objects
and tries to break them!

[examples/breakEverything.js](examples/breakEverything.js)

```javascript
    // Move in current direction.
    step();

    // Did we find the object?
    if (prevDist <= 1) {
        console.log(`object discovered at ${myPos}`);

        // Try to break it lol
        slam(); kick(5);

        return true;
    }
```

If you let this script run long enough (e.g. overnight), it will literally try
to kick every object on the map!

# Installation

You need [frida](https://frida.re/) intalled, if you already have python it
couldn't be easier, something like:

```
pip install frida-tools
```

The full frida install documentation is
[here](https://www.frida.re/docs/installation/) if you need it.

> Note: You must be using python for Windows, not WSL python.

# Building

> You can use a pre-built version if you just want to write a JavaScript script
> and dont want to make any changes to sharapi.

This project mostly uses TypeScript, a language that transpiles to JavaScript
but adds strong typing. I find this useful for avoiding bugs during development,
but the output can be used with JavaScript or TypeScript, whichever you prefer.

You need `typescript` and `rollup` to build the script, or you can just use a
prebuilt version. `tsc` is the typescript compiler, `rollup` takes all of the
individual files, figures out the module dependencies and produces a single
file to give to frida.

I use `WSL`, and just type `make` to build the final output files with GNU make,
because I'm more familiar with Makefiles. In future I'll figure out how to use
`tsconfig.json`.

# Usage

Run the game `Simpsons.exe`, you can use the launcher if you like, and type this:

```bash
python.exe inject.py Simpsons.exe
```

If you don't get any error messages, then frida was started and was injected
into the game. To interact with it, open chrome and go to `chrome://inspect`
and click the `Open dedicated DevTools for Node` link.

You should now have a JavaScript console connected.

Try it out!

Type this:

```javascript
CoinManager.SpawnInstantCoins(0, 0, 0, 10)
```

Some coins should fly towards you.

Get into a car, and type this:

```javascript
var v = (new Character()).GetVehicle()
var p = v.GetPosition()

// p is [x, y, z] co-ordinates of the car.
p.y += 10

v.SetPosition(p)
```

Your car should jump 100 ft in the air.

## Scripts

If yout want to run a script, try one of the examples in the
[examples](/examples) directory.

```
python.exe Simpsons.exe examples/breakEverything.js
```

# Notes

I'm using the binary with md5 `9009afe5ab6c2daf8605d8b613951902`.


