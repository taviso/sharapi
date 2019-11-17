//
// Copyright (c) 2009-2010 Mikko Mononen memon@inside.org
//
// This software is provided 'as-is', without any express or implied
// warranty.  In no event will the authors be held liable for any damages
// arising from the use of this software.
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgment in the product documentation would be
//    appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
//

#define _USE_MATH_DEFINES
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "imgui.h"
#include "NavMeshTesterTool.h"
#include "Sample.h"
#include "Recast.h"
#include "RecastDebugDraw.h"
#include "DetourNavMesh.h"
#include "DetourNavMeshBuilder.h"
#include "DetourDebugDraw.h"
#include "DetourCommon.h"

#ifdef WIN32
#	define snprintf _snprintf
#endif

// Uncomment this to dump all the requests in stdout.
//#define DUMP_REQS

// Returns a random number [0..1]
static float frand()
{
//	return ((float)(rand() & 0xffff)/(float)0xffff);
	return (float)rand()/(float)RAND_MAX;
}

inline bool inRange(const float* v1, const float* v2, const float r, const float h)
{
	const float dx = v2[0] - v1[0];
	const float dy = v2[1] - v1[1];
	const float dz = v2[2] - v1[2];
	return (dx*dx + dz*dz) < r*r && fabsf(dy) < h;
}


static int fixupCorridor(dtPolyRef* path, const int npath, const int maxPath,
						 const dtPolyRef* visited, const int nvisited)
{
	int furthestPath = -1;
	int furthestVisited = -1;
	
	// Find furthest common polygon.
	for (int i = npath-1; i >= 0; --i)
	{
		bool found = false;
		for (int j = nvisited-1; j >= 0; --j)
		{
			if (path[i] == visited[j])
			{
				furthestPath = i;
				furthestVisited = j;
				found = true;
			}
		}
		if (found)
			break;
	}

	// If no intersection found just return current path. 
	if (furthestPath == -1 || furthestVisited == -1)
		return npath;
	
	// Concatenate paths.	

	// Adjust beginning of the buffer to include the visited.
	const int req = nvisited - furthestVisited;
	const int orig = rcMin(furthestPath+1, npath);
	int size = rcMax(0, npath-orig);
	if (req+size > maxPath)
		size = maxPath-req;
	if (size)
		memmove(path+req, path+orig, size*sizeof(dtPolyRef));
	
	// Store visited
	for (int i = 0; i < req; ++i)
		path[i] = visited[(nvisited-1)-i];				
	
	return req+size;
}

// This function checks if the path has a small U-turn, that is,
// a polygon further in the path is adjacent to the first polygon
// in the path. If that happens, a shortcut is taken.
// This can happen if the target (T) location is at tile boundary,
// and we're (S) approaching it parallel to the tile edge.
// The choice at the vertex can be arbitrary, 
//  +---+---+
//  |:::|:::|
//  +-S-+-T-+
//  |:::|   | <-- the step can end up in here, resulting U-turn path.
//  +---+---+
static int fixupShortcuts(dtPolyRef* path, int npath, dtNavMeshQuery* navQuery)
{
	if (npath < 3)
		return npath;

	// Get connected polygons
	static const int maxNeis = 16;
	dtPolyRef neis[maxNeis];
	int nneis = 0;

	const dtMeshTile* tile = 0;
	const dtPoly* poly = 0;
	if (dtStatusFailed(navQuery->getAttachedNavMesh()->getTileAndPolyByRef(path[0], &tile, &poly)))
		return npath;
	
	for (unsigned int k = poly->firstLink; k != DT_NULL_LINK; k = tile->links[k].next)
	{
		const dtLink* link = &tile->links[k];
		if (link->ref != 0)
		{
			if (nneis < maxNeis)
				neis[nneis++] = link->ref;
		}
	}

	// If any of the neighbour polygons is within the next few polygons
	// in the path, short cut to that polygon directly.
	static const int maxLookAhead = 6;
	int cut = 0;
	for (int i = dtMin(maxLookAhead, npath) - 1; i > 1 && cut == 0; i--) {
		for (int j = 0; j < nneis; j++)
		{
			if (path[i] == neis[j]) {
				cut = i;
				break;
			}
		}
	}
	if (cut > 1)
	{
		int offset = cut-1;
		npath -= offset;
		for (int i = 1; i < npath; i++)
			path[i] = path[i+offset];
	}

	return npath;
}

static bool getSteerTarget(dtNavMeshQuery* navQuery, const float* startPos, const float* endPos,
						   const float minTargetDist,
						   const dtPolyRef* path, const int pathSize,
						   float* steerPos, unsigned char& steerPosFlag, dtPolyRef& steerPosRef,
						   float* outPoints = 0, int* outPointCount = 0)							 
{
	// Find steer target.
	static const int MAX_STEER_POINTS = 3;
	float steerPath[MAX_STEER_POINTS*3];
	unsigned char steerPathFlags[MAX_STEER_POINTS];
	dtPolyRef steerPathPolys[MAX_STEER_POINTS];
	int nsteerPath = 0;
	navQuery->findStraightPath(startPos, endPos, path, pathSize,
							   steerPath, steerPathFlags, steerPathPolys, &nsteerPath, MAX_STEER_POINTS);
	if (!nsteerPath)
		return false;
		
	if (outPoints && outPointCount)
	{
		*outPointCount = nsteerPath;
		for (int i = 0; i < nsteerPath; ++i)
			dtVcopy(&outPoints[i*3], &steerPath[i*3]);
	}

	
	// Find vertex far enough to steer to.
	int ns = 0;
	while (ns < nsteerPath)
	{
		// Stop at Off-Mesh link or when point is further than slop away.
		if ((steerPathFlags[ns] & DT_STRAIGHTPATH_OFFMESH_CONNECTION) ||
			!inRange(&steerPath[ns*3], startPos, minTargetDist, 1000.0f))
			break;
		ns++;
	}
	// Failed to find good point to steer to.
	if (ns >= nsteerPath)
		return false;
	
	dtVcopy(steerPos, &steerPath[ns*3]);
	steerPos[1] = startPos[1];
	steerPosFlag = steerPathFlags[ns];
	steerPosRef = steerPathPolys[ns];
	
	return true;
}


NavMeshTesterTool::NavMeshTesterTool() :
	m_sample(0),
	m_navMesh(0),
	m_navQuery(0),
	m_pathFindStatus(DT_FAILURE),
	m_toolMode(TOOLMODE_PATHFIND_FOLLOW),
	m_straightPathOptions(0),
	m_startRef(0),
	m_endRef(0),
	m_npolys(0),
	m_nstraightPath(0),
	m_nsmoothPath(0),
	m_nrandPoints(0),
	m_randPointsInCircle(false),
	m_hitResult(false),
	m_distanceToWall(0),
	m_sposSet(false),
	m_eposSet(false),
	m_pathIterNum(0),
	m_pathIterPolyCount(0),
	m_steerPointCount(0)
{
	m_filter.setIncludeFlags(SAMPLE_POLYFLAGS_ALL ^ (SAMPLE_POLYFLAGS_DISABLED | SAMPLE_POLYFLAGS_SWIM | SAMPLE_POLYFLAGS_JUMP));
	m_filter.setExcludeFlags(SAMPLE_POLYFLAGS_SWIM | SAMPLE_POLYFLAGS_JUMP);

    // XXX: AGENT SIZE ADJUSTMENTS
	m_polyPickExt[0] = 2;
	m_polyPickExt[1] = 4;
	m_polyPickExt[2] = 2;
	
	m_neighbourhoodRadius = 2.5f;
	m_randomRadius = 5.0f;
}

float *NavMeshTesterTool::getPath(int *len)
{
    *len = m_nsmoothPath;
    return m_smoothPath;
}

void NavMeshTesterTool::init(Sample* sample)
{
	m_sample = sample;
	m_navMesh = sample->getNavMesh();
	m_navQuery = sample->getNavMeshQuery();
	recalc();

	if (m_navQuery)
	{
		// Change costs.
		m_filter.setAreaCost(SAMPLE_POLYAREA_GROUND, 1.0f);
		m_filter.setAreaCost(SAMPLE_POLYAREA_WATER, 10.0f);
		m_filter.setAreaCost(SAMPLE_POLYAREA_ROAD, 1.0f);
		m_filter.setAreaCost(SAMPLE_POLYAREA_DOOR, 1.0f);
		m_filter.setAreaCost(SAMPLE_POLYAREA_GRASS, 2.0f);
		m_filter.setAreaCost(SAMPLE_POLYAREA_JUMP, 1.5f);
	}
	
	m_neighbourhoodRadius = sample->getAgentRadius() * 20.0f;
	m_randomRadius = sample->getAgentRadius() * 30.0f;
}

void NavMeshTesterTool::handleMenu()
{
    return;
}

void NavMeshTesterTool::handleClick(const float* /*s*/, const float* p, bool shift)
{
	if (shift)
	{
		m_sposSet = true;
		dtVcopy(m_spos, p);
	}
	else
	{
		m_eposSet = true;
		dtVcopy(m_epos, p);
	}
	recalc();
}

void NavMeshTesterTool::handleStep()
{
}

void NavMeshTesterTool::handleToggle()
{
    return;
}

void NavMeshTesterTool::handleUpdate(const float /*dt*/)
{
    return;
}

void NavMeshTesterTool::reset()
{
	m_startRef = 0;
	m_endRef = 0;
	m_npolys = 0;
	m_nstraightPath = 0;
	m_nsmoothPath = 0;
	memset(m_hitPos, 0, sizeof(m_hitPos));
	memset(m_hitNormal, 0, sizeof(m_hitNormal));
	m_distanceToWall = 0;
}


void NavMeshTesterTool::recalc()
{
    //printf("NavMeshTesterTool::recalc\n");
	if (!m_navMesh)
		return;
	
	if (m_sposSet)
		m_navQuery->findNearestPoly(m_spos, m_polyPickExt, &m_filter, &m_startRef, 0);
	else
		m_startRef = 0;
	
	if (m_eposSet)
		m_navQuery->findNearestPoly(m_epos, m_polyPickExt, &m_filter, &m_endRef, 0);
	else
		m_endRef = 0;
	
	m_pathFindStatus = DT_FAILURE;
	
	//printf("NavMeshTesterTool:: spos: %f %f %f\n", m_spos[0], m_spos[1], m_spos[2]);
	//printf("NavMeshTesterTool:: epos: %f %f %f\n", m_epos[0], m_epos[1], m_epos[2]);
	if (true)
	{
		m_pathIterNum = 0;
        //printf("NavMeshTesterTool:: testing conditions %d %d %d %d\n", !!m_sposSet, !!m_eposSet, !!m_startRef, !!m_endRef);
		if (m_sposSet && m_eposSet && m_startRef && m_endRef)
		{
#ifdef DUMP_REQS
			printf("pi  %f %f %f  %f %f %f  0x%x 0x%x\n",
				   m_spos[0],m_spos[1],m_spos[2], m_epos[0],m_epos[1],m_epos[2],
				   m_filter.getIncludeFlags(), m_filter.getExcludeFlags()); 
#endif

            //printf("NavMeshTesterTool:: about to findPath\n");
			m_navQuery->findPath(m_startRef, m_endRef, m_spos, m_epos, &m_filter, m_polys, &m_npolys, MAX_POLYS);

            //printf("NavMeshTesterTool:: findPath: %d\n", m_npolys);
			m_nsmoothPath = 0;

			if (m_npolys)
			{
				// Iterate over the path to find smooth path on the detail mesh surface.
				dtPolyRef polys[MAX_POLYS];
				memcpy(polys, m_polys, sizeof(dtPolyRef)*m_npolys); 
				int npolys = m_npolys;
				
				float iterPos[3], targetPos[3];
				m_navQuery->closestPointOnPoly(m_startRef, m_spos, iterPos, 0);
	            //printf("NavMeshTesterTool:: closest point on nearest poly: %f %f %f\n", iterPos[0], iterPos[1], iterPos[2]);
				m_navQuery->closestPointOnPoly(polys[npolys-1], m_epos, targetPos, 0);
				
				static const float STEP_SIZE = 0.5f;
				static const float SLOP = 0.01f;
				
				m_nsmoothPath = 0;
				
				dtVcopy(&m_smoothPath[m_nsmoothPath*3], iterPos);
				m_nsmoothPath++;
				
				// Move towards target a small advancement at a time until target reached or
				// when ran out of memory to store the path.
				while (npolys && m_nsmoothPath < MAX_SMOOTH)
				{
					// Find location to steer towards.
					float steerPos[3];
					unsigned char steerPosFlag;
					dtPolyRef steerPosRef;
					
					if (!getSteerTarget(m_navQuery, iterPos, targetPos, SLOP,
										polys, npolys, steerPos, steerPosFlag, steerPosRef))
						break;
					
					bool endOfPath = (steerPosFlag & DT_STRAIGHTPATH_END) ? true : false;
					bool offMeshConnection = (steerPosFlag & DT_STRAIGHTPATH_OFFMESH_CONNECTION) ? true : false;
					
					// Find movement delta.
					float delta[3], len;
					dtVsub(delta, steerPos, iterPos);
					len = dtMathSqrtf(dtVdot(delta, delta));
					// If the steer target is end of path or off-mesh link, do not move past the location.
					if ((endOfPath || offMeshConnection) && len < STEP_SIZE)
						len = 1;
					else
						len = STEP_SIZE / len;
					float moveTgt[3];
					dtVmad(moveTgt, iterPos, delta, len);
					
					// Move
					float result[3];
					dtPolyRef visited[16];
					int nvisited = 0;

                    //printf("NavMeshTesterTool:: moveTgt %f, %f, %f\n", moveTgt[0], moveTgt[1], moveTgt[2]);
					m_navQuery->moveAlongSurface(polys[0], iterPos, moveTgt, &m_filter,
												 result, visited, &nvisited, 16);

					npolys = fixupCorridor(polys, npolys, MAX_POLYS, visited, nvisited);
					npolys = fixupShortcuts(polys, npolys, m_navQuery);

					float h = 0;
					m_navQuery->getPolyHeight(polys[0], result, &h);
					result[1] = h;
					dtVcopy(iterPos, result);

					// Handle end of path and off-mesh links when close enough.
					if (endOfPath && inRange(iterPos, steerPos, SLOP, 1.0f))
					{
						// Reached end of path.
						dtVcopy(iterPos, targetPos);
						if (m_nsmoothPath < MAX_SMOOTH)
						{
							dtVcopy(&m_smoothPath[m_nsmoothPath*3], iterPos);
							m_nsmoothPath++;
						}
						break;
					}
					else if (offMeshConnection && inRange(iterPos, steerPos, SLOP, 1.0f))
					{
						// Reached off-mesh connection.
						float startPos[3], endPos[3];
						
						// Advance the path up to and over the off-mesh connection.
						dtPolyRef prevRef = 0, polyRef = polys[0];
						int npos = 0;
						while (npos < npolys && polyRef != steerPosRef)
						{
							prevRef = polyRef;
							polyRef = polys[npos];
							npos++;
						}
						for (int i = npos; i < npolys; ++i)
							polys[i-npos] = polys[i];
						npolys -= npos;
						
						// Handle the connection.
						dtStatus status = m_navMesh->getOffMeshConnectionPolyEndPoints(prevRef, polyRef, startPos, endPos);
						if (dtStatusSucceed(status))
						{
							if (m_nsmoothPath < MAX_SMOOTH)
							{
								dtVcopy(&m_smoothPath[m_nsmoothPath*3], startPos);
								m_nsmoothPath++;
								// Hack to make the dotted path not visible during off-mesh connection.
								if (m_nsmoothPath & 1)
								{
									dtVcopy(&m_smoothPath[m_nsmoothPath*3], startPos);
									m_nsmoothPath++;
								}
							}
							// Move position at the other side of the off-mesh link.
							dtVcopy(iterPos, endPos);
							float eh = 0.0f;
							m_navQuery->getPolyHeight(polys[0], iterPos, &eh);
							iterPos[1] = eh;
						}
					}
					
					// Store results.
					if (m_nsmoothPath < MAX_SMOOTH)
					{
						dtVcopy(&m_smoothPath[m_nsmoothPath*3], iterPos);
						m_nsmoothPath++;
					}
				}
			}

		}
		else
		{
			m_npolys = 0;
			m_nsmoothPath = 0;
		}
	}
}

static void getPolyCenter(dtNavMesh* navMesh, dtPolyRef ref, float* center)
{
    return;
}

void NavMeshTesterTool::handleRender()
{
    return;
}

void NavMeshTesterTool::handleRenderOverlay(double* proj, double* model, int* view)
{
    return;
}

void NavMeshTesterTool::drawAgent(const float* pos, float r, float h, float c, const unsigned int col)
{
    return;
}
