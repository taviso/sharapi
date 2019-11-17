#define _USE_MATH_DEFINES
#include <math.h>
#include <stdio.h>
#include <stdarg.h>
#include <string.h>
#include "SampleInterfaces.h"
#include "Recast.h"
#include "RecastDebugDraw.h"
#include "DetourDebugDraw.h"

#ifdef WIN32
#	define snprintf _snprintf
#endif

////////////////////////////////////////////////////////////////////////////////////////////////////

BuildContext::BuildContext() :
	m_messageCount(0),
	m_textPoolSize(0)
{
	memset(m_messages, 0, sizeof(char*) * MAX_MESSAGES);

	resetTimers();
}

// Virtual functions for custom implementations.
void BuildContext::doResetLog()
{
	m_messageCount = 0;
	m_textPoolSize = 0;
}

void BuildContext::doLog(const rcLogCategory category, const char* msg, const int len)
{
	if (!len) return;
	if (m_messageCount >= MAX_MESSAGES)
		return;
	char* dst = &m_textPool[m_textPoolSize];
	int n = TEXT_POOL_SIZE - m_textPoolSize;
	if (n < 2)
		return;
	char* cat = dst;
	char* text = dst+1;
	const int maxtext = n-1;
	// Store category
	*cat = (char)category;
	// Store message
	const int count = rcMin(len+1, maxtext);
	memcpy(text, msg, count);
	text[count-1] = '\0';
	m_textPoolSize += 1 + count;
	m_messages[m_messageCount++] = dst;
}

void BuildContext::doResetTimers()
{
    return;
}

void BuildContext::doStartTimer(const rcTimerLabel label)
{
	return;
}

void BuildContext::doStopTimer(const rcTimerLabel label)
{
    return;
}

int BuildContext::doGetAccumulatedTime(const rcTimerLabel label) const
{
	return 0;
}

void BuildContext::dumpLog(const char* format, ...)
{
	// Print header.
	va_list ap;
	va_start(ap, format);
	vprintf(format, ap);
	va_end(ap);
	printf("\n");
	
	// Print messages
	const int TAB_STOPS[4] = { 28, 36, 44, 52 };
	for (int i = 0; i < m_messageCount; ++i)
	{
		const char* msg = m_messages[i]+1;
		int n = 0;
		while (*msg)
		{
			if (*msg == '\t')
			{
				int count = 1;
				for (int j = 0; j < 4; ++j)
				{
					if (n < TAB_STOPS[j])
					{
						count = TAB_STOPS[j] - n;
						break;
					}
				}
				while (--count)
				{
					putchar(' ');
					n++;
				}
			}
			else
			{
				putchar(*msg);
				n++;
			}
			msg++;
		}
		putchar('\n');
	}
}

int BuildContext::getLogCount() const
{
	return m_messageCount;
}

const char* BuildContext::getLogText(const int i) const
{
	return m_messages[i]+1;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

class GLCheckerTexture
{
	unsigned int m_texId;
public:
	GLCheckerTexture() : m_texId(0)
	{
	}
	
	~GLCheckerTexture()
	{
	    return;
	}
	void bind()
	{
	    return;
    }
};
GLCheckerTexture g_tex;


void DebugDrawGL::depthMask(bool state)
{
    return;
}

void DebugDrawGL::texture(bool state)
{
	if (state)
	{
	    return;
	}
	else
	{
	    return;
	}
}

void DebugDrawGL::begin(duDebugDrawPrimitives prim, float size)
{
    return;
}

void DebugDrawGL::vertex(const float* pos, unsigned int color)
{
    return;
}

void DebugDrawGL::vertex(const float x, const float y, const float z, unsigned int color)
{
    return;
}

void DebugDrawGL::vertex(const float* pos, unsigned int color, const float* uv)
{
    return;
}

void DebugDrawGL::vertex(const float x, const float y, const float z, unsigned int color, const float u, const float v)
{
    return;
}

void DebugDrawGL::end()
{
    return;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

FileIO::FileIO() :
	m_fp(0),
	m_mode(-1)
{
}

FileIO::~FileIO()
{
	if (m_fp) fclose(m_fp);
}

bool FileIO::openForWrite(const char* path)
{
	if (m_fp) return false;
	m_fp = fopen(path, "wb");
	if (!m_fp) return false;
	m_mode = 1;
	return true;
}

bool FileIO::openForRead(const char* path)
{
	if (m_fp) return false;
	m_fp = fopen(path, "rb");
	if (!m_fp) return false;
	m_mode = 2;
	return true;
}

bool FileIO::isWriting() const
{
	return m_mode == 1;
}

bool FileIO::isReading() const
{
	return m_mode == 2;
}

bool FileIO::write(const void* ptr, const size_t size)
{
	if (!m_fp || m_mode != 1) return false;
	fwrite(ptr, size, 1, m_fp);
	return true;
}

bool FileIO::read(void* ptr, const size_t size)
{
	if (!m_fp || m_mode != 2) return false;
	size_t readLen = fread(ptr, size, 1, m_fp);
	return readLen == 1;
}


