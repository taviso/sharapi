#include <windows.h>
#include <stdio.h>
#include <cstdio>
#define _USE_MATH_DEFINES
#include <cmath>

#include "Recast.h"
#include "RecastDebugDraw.h"
#include "InputGeom.h"
#include "Sample_SoloMesh.h"

int main(int argc, char **argv)
{
    InputGeom* geom = new InputGeom;
    Sample* sample = new Sample_SoloMesh();
    int pathLen;
    float *path;
    float endpos[3];
    float startpos[3];

    BuildContext ctx;

    ctx.resetLog();

    if (!geom->load(&ctx, "map/level01.obj")) {
        puts("failed to open geom");
        return 1;
    }

    sample->setContext(&ctx);
    sample->handleMeshChanged(geom);
    sample->handleBuild();

    fprintf(stdout, "ready\n");
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);

    while (true) {

        if (fscanf(stdin, "start %f %f %f%*[^\n]", &startpos[0], &startpos[1], &startpos[2]) != 3) {
            fprintf(stderr, "failed to parse input\n");
            return 1;
        }

        fgetc(stdin);

        if (fscanf(stdin, "end %f %f %f%*[^\n]", &endpos[0], &endpos[1], &endpos[2]) != 3) {
            fprintf(stderr, "failed to parse input\n");
            return 1;
        }

        fgetc(stdin);

        // z is inverted from the co-ords used by Recast
        endpos[2]   *= -1;
        startpos[2] *= -1;

        sample->handleClick(NULL, startpos, true);
        sample->handleClick(NULL, endpos, false);

        path = sample->m_tool->getPath(&pathLen);

        for (int i = 0; i < pathLen; i++) {
            fprintf(stdout, "[ %.3f, %.3f, %.3f ]\n", path[i*3+0], path[i*3+1], -path[i*3+2]);
        }

        fprintf(stdout, "end\n");
        fflush(stdout);
    }

    delete sample;
    delete geom;

    return 0;
}
