# Simpsons: Hit & Run API

## About The Project

> ***This code is in a pre-pre-pre-alpha experimental state.***

This is a library to automate the abandonware game Simpsons: Hit &
Run with JavaScript. It uses [frida](https://frida.re) to access internal state,
and exposes JavaScript classes that can be used to query and control the game.

The intention is to allow easy scriptable access to state, in a similar way to
how [pysc2](https://github.com/deepmind/pysc2) enabled deepmind to learn how to
play Starcraft II. Eventually I'd like to be able to automate finding glitches,
crashes, strategies, routes and so on for
[speedrunning](https://en.wikipedia.org/wiki/Speedrun).

> *This is a solo hobby project, I'm a long way off from that point.*

Want to see it in action? Here is an early demo video using the debugging
console.

[![Video](doc/video.png)](https://youtu.be/PHa1F3tT130)

Want to see an example script? Here is a simple script that just finds objects
and tries to break them!

[examples/breakEverything.js](examples/breakEverything.js)

```javascript
    // Move in current direction.
    step();

    // Did we find the object?
    if (myPos.distanceTo(object) <= 1) {
        console.log(`object discovered at ${myPos}`);

        // Try to break it lol
        slam(); kick(5);

        return true;
    }
```

If you let this script run long enough (e.g. overnight), it will literally try
to kick every object on the map!

> Update: [here](https://youtu.be/buetZ-5ceno) is another video.

Like this idea and want to help? Let me know!

### Built With

* [TypeScript](https://www.typescriptlang.org/)
  * [Rollup](https://rollupjs.org/guide/en/)
  * [Frida](https://frida.re/docs/javascript-api/)

The [next](#getting-started-for-sharapi-authors) section is relevant if you plan on making changes to the core SharApi library. Skip [here](#getting-started-for-script-authors) if you only plan on authoring scripts/testing them in-game.

## Getting Started For SharApi Authors

This section covers how to set up a development environment for the SharApi library. The SharApi development environment is supported on Windows, Linux, and WSL distributions.

### Prerequisites

* [Node.js/NPM](https://nodejs.org/en/download/package-manager)

### Installation

  1. Clone the repo

  ```sh
  git clone https://github.com/taviso/sharapi.git
  ```

  1. Install NPM Packages

  ```sh
  npm install --save-dev
  ```

### Usage

  ```sh
  # Build the project to dist/scriptfile.out.js.
  npm run build

  # Clean the project output.
  npm run clean
  ```

### Testing

  Copy `inject.py` and `scriptfile.out.js` to your Windows machine for in-game testing. Follow the [next](#getting-started-for-script-authors) section, replacing the release version of `inject.py` and `scriptfile.out.js` with the versions from your dev environment.

## Getting Started For Script Authors

### Script Development Prerequisites

* [Python for Windows](https://www.python.org/downloads/windows/)
* SharApi library (`inject.py` and `scriptfile.out.js`)
* The Simpsons: Hit & Run binary (`MD5:9009afe5ab6c2daf8605d8b613951902`)

### Script Development Setup

You need [frida](https://frida.re/) installed, if you already have python it
couldn't be easier, something like:

```bash
pip install frida-tools
```

The full frida install documentation is
[here](https://www.frida.re/docs/installation/) if you need it.

> Note: You must be using python for Windows, not WSL python.

### Script Usage

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

### Scripts

If yout want to run a script, try one of the examples in the
[examples](/examples) directory.

```bash
python.exe ./inject.py Simpsons.exe examples/breakEverything.js
```
