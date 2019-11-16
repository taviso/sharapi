CC=cl.exe
RC=rc.exe
MSBUILD=msbuild.exe
CMAKE=cmake.exe
CMFLAGS=-A Win32 -Wno-dev
RFLAGS=/nologo
CFLAGS=/nologo /Zi /Od /MD /FS
LFLAGS=/nologo /machine:x86
VFLAGS=-no_logo
MFLAGS=/p:Configuration=Release /nologo /m /v:q
CXXFLAGS=/nologo /Zi /Od /EHsc /MD /FS
LDLIBS=
LDFLAGS=/MD
LINKFLAGS=/ignore:4099
VSDEVCMD=cmd.exe /c vsdevcmd.bat
TSFLAGS=--target ES5 --module es6 --lib es6,dom
RUFLAGS=--format system --context global
SDLVER=2.0.10

# Commands for arch specific compiler.
ifeq ($(OS),Windows_NT)
    CC64=$(VSDEVCMD) $(VFLAGS) -arch=amd64 ^& cl
    CC32=$(VSDEVCMD) $(VFLAGS) -arch=x86 ^& cl
else
    CC64=$(VSDEVCMD) $(VFLAGS) -arch=amd64 "&" cl
    CC32=$(VSDEVCMD) $(VFLAGS) -arch=x86 "&" cl
endif

.PHONY: clean distclean
.DELETE_ON_ERROR:

TSFILES=src/Base.ts src/FeApp.ts src/FeText.ts src/usercall.ts  \
    src/CharacterSheetManager.ts src/CharacterManager.ts        \
    src/CoinManager.ts src/Radmath.ts src/Vehicle.ts            \
    src/RoadSegment.ts src/IntersectManager.ts                  \
    src/CommandLineOptions.ts src/Character.ts                  \
    src/RenderManager.ts src/InputManager.ts src/Symbols.ts     \
    src/InstDynaPhysDSG.ts src/Sim.ts src/Debug.ts src/Names.ts \
    src/Avatar.ts src/Events.ts src/Locks.ts                    \
    src/GameplayManager.ts src/ActionButtonManager.ts           \
    src/ActorManager.ts src/Sparkle.ts src/Mission.ts           \
    src/SuperCamCentral.ts src/Util.ts

all: scriptfile.out.js navmesh.exe

release: sharapi.zip

SDL2-devel-$(SDLVER)-VC.zip:
	wget -O $@ https://www.libsdl.org/release/$@

recast.lib: SDL2-devel-$(SDLVER)-VC.zip 
	unzip -oq $<
	$(CMAKE) $(CMFLAGS) -DSDL2_ROOT_DIR=../../SDL2-$(SDLVER) -S recastnavigation -B build-$@
	$(MSBUILD) $(MFLAGS) build-$@/RecastNavigation.sln

navmesh.exe: | recast.lib
	make -C src/pathfinding $@
	cp src/pathfinding/$@ $@

%.js: %.ts
	tsc $(TSFLAGS) $<

clean:
	rm -f *.out.js exports.js sharapi.js src/frida.js src/import.js
	rm -f $(TSFILES:.ts=.js)
	rm -f sharapi.zip  navmesh.exe
	rm -rf build-*.lib SDL2-$(SDLVER)
	make -C src/pathfinding clean

distclean: clean
	rm -f SDL2-devel-$(SDLVER)-VC.zip

exports.js: TSFLAGS+=--module commonjs

src/import.js: exports.js $(TSFILES)
	node $< $(TSFILES) > $@

src/frida.js: src/frida.d.ts
	touch $@

# tsc is sloooooooow to startup, try to bundle prereqs into one command.
sharapi.js: src/import.js src/frida.js src/uidcache.js $(TSFILES)
	tsc $(TSFLAGS) $(filter %.ts,$^)
	rollup $(RUFLAGS) $< --file $@

scriptfile.out.js: src/System.js sharapi.js src/main.js
	cat $^ > $@

sharapi.zip: README.md DEVEL.md examples doc scriptfile.out.js inject.py
	(cd .. && zip -r sharapi/$@ $(patsubst %,sharapi/%,$^))
