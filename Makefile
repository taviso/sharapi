TSFLAGS=--target ES5 --module es6 --lib es6,dom
RUFLAGS=--format system --context global

.PHONY: clean
.DELETE_ON_ERROR:

TSFILES=src/Base.ts src/FeApp.ts src/FeText.ts src/usercall.ts  \
    src/CharacterSheetManager.ts src/CharacterManager.ts        \
    src/CoinManager.ts src/Radmath.ts src/Vehicle.ts            \
    src/RoadSegment.ts src/IntersectManager.ts                  \
    src/CommandLineOptions.ts src/Character.ts                  \
    src/RenderManager.ts src/InputManager.ts src/Symbols.ts     \
    src/InstDynaPhysDSG.ts src/Sim.ts src/Debug.ts src/Names.ts \
    src/Avatar.ts

all: scriptfile.out.js

%.js: %.ts
	tsc $(TSFLAGS) $<

clean:
	rm -f *.out.js sharapi.js src/frida.js $(TSFILES:.ts=.js)

src/frida.js: src/frida.d.ts
	touch $@

sharapi.js: src/import.js src/frida.js $(TSFILES:.ts=.js)
	rollup $(RUFLAGS) $< --file $@

scriptfile.out.js: src/System.js sharapi.js src/main.js
	cat $^ > $@
