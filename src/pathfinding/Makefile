CC=cl.exe
RC=rc.exe
MSBUILD=msbuild.exe
CMAKE=cmake.exe
RFLAGS=/nologo
CFLAGS=/nologo /Zi /Od /MD /FS
LFLAGS=/nologo /machine:x86
VFLAGS=-no_logo
MFLAGS=/p:Configuration=Release /nologo /m /v:q
CPPFLAGS=/I../../recastnavigation/Recast/Include /I../../recastnavigation/DebugUtils/Include/ /I../../recastnavigation/Detour/Include /I../../recastnavigation/DetourTileCache/Include /DWIN32 /DNDEBUG
CXXFLAGS=/nologo /Zi /Od /EHsc /MD /FS
LDLIBS=../../build-recast.lib/DebugUtils/Release/DebugUtils ../../build-recast.lib/Detour/Release/Detour ../../build-recast.lib/DetourTileCache/Release/DetourTileCache ../../build-recast.lib/Recast/Release/Recast 
LDFLAGS=/MD
LINKFLAGS=/ignore:4099 /subsystem:console
VSDEVCMD=cmd.exe /c vsdevcmd.bat

# Commands for arch specific compiler.
ifeq ($(OS),Windows_NT)
    CC64=$(VSDEVCMD) $(VFLAGS) -arch=amd64 ^& cl
    CC32=$(VSDEVCMD) $(VFLAGS) -arch=x86 ^& cl
else
    CC64=$(VSDEVCMD) $(VFLAGS) -arch=amd64 "&" cl
    CC32=$(VSDEVCMD) $(VFLAGS) -arch=x86 "&" cl
endif

.PHONY: clean distclean

all: navmesh.exe

%.res: %.rc
	$(RC) $(RFLAGS) $<

%.obj: %.cc
	$(CC) $(CPPFLAGS) $(CXXFLAGS) /c /Fo:$@ $<

%.obj: %.c
	$(CC) $(CFLAGS) /c /Fo:$@ $<

%.exe: %.obj
	$(CC) $(CFLAGS) $(LDFLAGS) /Fe:$@ $^ /link $(LINKFLAGS) $(LDLIBS:=.lib)

%.dll: %.obj
	$(CC) $(CFLAGS) $(LDFLAGS) /LD /Fe:$@ $^ /link $(LINKFLAGS)

%64.obj: %.c
	$(CC) $(CFLAGS) /c /Fd:$(@:.obj=.pdb) /Fo:$@ $<

%32.obj: %.c
	$(CC) $(CFLAGS) /c /Fd:$(@:.obj=.pdb) /Fo:$@ $<

%64.dll: CC=$(CC64)
%64.dll: %64.obj version.res
	$(CC) $(CFLAGS) $(LDFLAGS) /LD /Fd:$(@:.dll=.pdb) /Fe:$@ $^ /link $(LINKFLAGS)

%32.dll: CC=$(CC32)
%32.dll: %32.obj version.res
	$(CC) $(CFLAGS) $(LDFLAGS) /LD /Fd:$(@:.dll=.pdb) /Fe:$@ $^ /link $(LINKFLAGS)

navmesh.exe: ChunkyTriMesh.obj  \
             ConvexVolumeTool.obj NavMeshTesterTool.obj Sample_SoloMesh.obj \
             main.obj imguiRenderGL.obj imgui.obj \
             InputGeom.obj Sample.obj \
             MeshLoaderObj.obj SampleInterfaces.obj
	$(CC) $(CFLAGS) $(LDFLAGS) /Fe:$@ $^ /link $(LINKFLAGS) $(LDLIBS:=.lib)

clean:
	rm -f *.exp *.exe *.obj *.pdb *.ilk *.xml *.res *.ipdb *.iobj *.dll *.tmp
