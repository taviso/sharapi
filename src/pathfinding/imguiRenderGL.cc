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
#include <cmath>
#include <cstdio>
#include "imgui.h"

// Some math headers don't have PI defined.
static const float PI = 3.14159265f;

void imguifree(void* ptr, void* userptr);
void* imguimalloc(size_t size, void* userptr);

#define STBTT_malloc(x,y)    imguimalloc(x,y)
#define STBTT_free(x,y)      imguifree(x,y)
#define STB_TRUETYPE_IMPLEMENTATION
#include "stb_truetype.h"

void imguifree(void* ptr, void* /*userptr*/)
{
	free(ptr);
}

void* imguimalloc(size_t size, void* /*userptr*/)
{
	return malloc(size);
}

static const unsigned TEMP_COORD_COUNT = 100;
static float g_tempCoords[TEMP_COORD_COUNT*2];
static float g_tempNormals[TEMP_COORD_COUNT*2];

static const int CIRCLE_VERTS = 8*4;
static float g_circleVerts[CIRCLE_VERTS*2];

static stbtt_bakedchar g_cdata[96]; // ASCII 32..126 is 95 glyphs
static unsigned g_ftex = 0;

inline unsigned int RGBA(unsigned char r, unsigned char g, unsigned char b, unsigned char a)
{
	return (r) | (g << 8) | (b << 16) | (a << 24);
}

static void drawPolygon(const float* coords, unsigned numCoords, float r, unsigned int col)
{
    return;
}

static void drawRect(float x, float y, float w, float h, float fth, unsigned int col)
{
	float verts[4*2] =
	{
		x+0.5f, y+0.5f,
		x+w-0.5f, y+0.5f,
		x+w-0.5f, y+h-0.5f,
		x+0.5f, y+h-0.5f,
	};
	drawPolygon(verts, 4, fth, col);
}

/*
static void drawEllipse(float x, float y, float w, float h, float fth, unsigned int col)
{
	float verts[CIRCLE_VERTS*2];
	const float* cverts = g_circleVerts;
	float* v = verts;
	
	for (int i = 0; i < CIRCLE_VERTS; ++i)
	{
		*v++ = x + cverts[i*2]*w;
		*v++ = y + cverts[i*2+1]*h;
	}
	
	drawPolygon(verts, CIRCLE_VERTS, fth, col);
}
*/

static void drawRoundedRect(float x, float y, float w, float h, float r, float fth, unsigned int col)
{
	const unsigned n = CIRCLE_VERTS/4;
	float verts[(n+1)*4*2];
	const float* cverts = g_circleVerts;
	float* v = verts;
	
	for (unsigned i = 0; i <= n; ++i)
	{
		*v++ = x+w-r + cverts[i*2]*r;
		*v++ = y+h-r + cverts[i*2+1]*r;
	}
	
	for (unsigned i = n; i <= n*2; ++i)
	{
		*v++ = x+r + cverts[i*2]*r;
		*v++ = y+h-r + cverts[i*2+1]*r;
	}
	
	for (unsigned i = n*2; i <= n*3; ++i)
	{
		*v++ = x+r + cverts[i*2]*r;
		*v++ = y+r + cverts[i*2+1]*r;
	}
	
	for (unsigned i = n*3; i < n*4; ++i)
	{
		*v++ = x+w-r + cverts[i*2]*r;
		*v++ = y+r + cverts[i*2+1]*r;
	}
	*v++ = x+w-r + cverts[0]*r;
	*v++ = y+r + cverts[1]*r;
	
	drawPolygon(verts, (n+1)*4, fth, col);
}


static void drawLine(float x0, float y0, float x1, float y1, float r, float fth, unsigned int col)
{
	float dx = x1-x0;
	float dy = y1-y0;
	float d = sqrtf(dx*dx+dy*dy);
	if (d > 0.0001f)
	{
		d = 1.0f/d;
		dx *= d;
		dy *= d;
	}
	float nx = dy;
	float ny = -dx;
	float verts[4*2];
	r -= fth;
	r *= 0.5f;
	if (r < 0.01f) r = 0.01f;
	dx *= r;
	dy *= r;
	nx *= r;
	ny *= r;
	
	verts[0] = x0-dx-nx;
	verts[1] = y0-dy-ny;
	
	verts[2] = x0-dx+nx;
	verts[3] = y0-dy+ny;
	
	verts[4] = x1+dx+nx;
	verts[5] = y1+dy+ny;
	
	verts[6] = x1+dx-nx;
	verts[7] = y1+dy-ny;
	
	drawPolygon(verts, 4, fth, col);
}


bool imguiRenderGLInit(const char* fontpath)
{
	return true;
}

void imguiRenderGLDestroy()
{
}

static void getBakedQuad(stbtt_bakedchar *chardata, int pw, int ph, int char_index,
						 float *xpos, float *ypos, stbtt_aligned_quad *q)
{
	stbtt_bakedchar *b = chardata + char_index;
	int round_x = STBTT_ifloor(*xpos + b->xoff);
	int round_y = STBTT_ifloor(*ypos - b->yoff);
	
	q->x0 = (float)round_x;
	q->y0 = (float)round_y;
	q->x1 = (float)round_x + b->x1 - b->x0;
	q->y1 = (float)round_y - b->y1 + b->y0;
	
	q->s0 = b->x0 / (float)pw;
	q->t0 = b->y0 / (float)pw;
	q->s1 = b->x1 / (float)ph;
	q->t1 = b->y1 / (float)ph;
	
	*xpos += b->xadvance;
}

static const float g_tabStops[4] = {150, 210, 270, 330};

static float getTextLength(stbtt_bakedchar *chardata, const char* text)
{
	float xpos = 0;
	float len = 0;
	while (*text)
	{
		int c = (unsigned char)*text;
		if (c == '\t')
		{
			for (int i = 0; i < 4; ++i)
			{
				if (xpos < g_tabStops[i])
				{
					xpos = g_tabStops[i];
					break;
				}
			}
		}
		else if (c >= 32 && c < 128)
		{
			stbtt_bakedchar *b = chardata + c-32;
			int round_x = STBTT_ifloor((xpos + b->xoff) + 0.5);
			len = round_x + b->x1 - b->x0 + 0.5f;
			xpos += b->xadvance;
		}
		++text;
	}
	return len;
}

static void drawText(float x, float y, const char *text, int align, unsigned int col)
{
}


void imguiRenderGLDraw()
{
}
