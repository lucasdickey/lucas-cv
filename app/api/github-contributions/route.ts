import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: ContributionWeek[];
        };
      };
    };
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'lucasdickey';

  // Check for GitHub token
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn('GITHUB_TOKEN not set, returning mock data');
    return NextResponse.json({
      error: 'GITHUB_TOKEN not configured',
      useMockData: true
    }, { status: 200 });
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data: GitHubResponse = await response.json();

    if (!data.data || !data.data.user) {
      throw new Error('Invalid response from GitHub API');
    }

    const { totalContributions, weeks } = data.data.user.contributionsCollection.contributionCalendar;

    // Transform the data to include contribution levels
    const transformedWeeks = weeks.map(week => ({
      days: week.contributionDays.map(day => {
        const count = day.contributionCount;
        let level: 0 | 1 | 2 | 3 | 4 = 0;

        if (count === 0) level = 0;
        else if (count < 3) level = 1;
        else if (count < 6) level = 2;
        else if (count < 10) level = 3;
        else level = 4;

        return {
          date: day.date,
          count,
          level,
        };
      }),
    }));

    return NextResponse.json({
      totalContributions,
      weeks: transformedWeeks,
      useMockData: false,
    });

  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch GitHub contributions',
        useMockData: true
      },
      { status: 200 } // Return 200 so frontend can fallback to mock data
    );
  }
}
