"use client";

import { useEffect, useState } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionWeek {
  days: ContributionDay[];
}

export default function GitHubContributions({ username = "lucasdickey" }: { username?: string }) {
  const [contributions, setContributions] = useState<ContributionWeek[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`/api/github-contributions?username=${username}`);
        const data = await response.json();

        if (data.useMockData) {
          // Fallback to mock data if GitHub API fails
          console.log('Using mock data for GitHub contributions');
          setUsingMockData(true);
          const mockData = generateMockData();
          setContributions(mockData);
          const total = mockData.reduce((sum, week) =>
            sum + week.days.reduce((daySum, day) => daySum + day.count, 0), 0
          );
          setTotalContributions(total);
        } else {
          // Use real data from GitHub
          setContributions(data.weeks);
          setTotalContributions(data.totalContributions);
          setUsingMockData(false);
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
        // Fallback to mock data on error
        setUsingMockData(true);
        const mockData = generateMockData();
        setContributions(mockData);
        const total = mockData.reduce((sum, week) =>
          sum + week.days.reduce((daySum, day) => daySum + day.count, 0), 0
        );
        setTotalContributions(total);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  // Generate mock data fallback
  const generateMockData = (): ContributionWeek[] => {
    const weeks: ContributionWeek[] = [];
    const today = new Date();

    for (let week = 0; week < 52; week++) {
      const days: ContributionDay[] = [];

      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (51 - week) * 7 - (6 - day));

        const recencyBoost = week > 40 ? 2 : 1;
        const count = Math.floor(Math.random() * 8 * recencyBoost);

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count === 0) level = 0;
        else if (count < 3) level = 1;
        else if (count < 6) level = 2;
        else if (count < 10) level = 3;
        else level = 4;

        days.push({
          date: date.toISOString().split('T')[0],
          count,
          level
        });
      }

      weeks.push({ days });
    }

    return weeks;
  };

  const getLevelColor = (level: number) => {
    // Terminal-themed colors matching the site aesthetic
    const colors = {
      0: '#e8e8d8',  // Light beige (no contributions)
      1: '#d4b896',  // Light tan
      2: '#b89968',  // Medium tan
      3: '#8b6f47',  // Dark tan
      4: '#5d4a2f',  // Darkest brown
    };
    return colors[level as keyof typeof colors];
  };

  if (loading) {
    return (
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">GitHub Contributions</div>
        <div className="text-[#666666] text-sm">Loading contribution data...</div>
      </div>
    );
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[#8b0000] font-bold">
          GitHub Contributions
          {usingMockData && (
            <span className="text-[10px] text-[#666666] ml-2 font-normal">(demo data)</span>
          )}
        </div>
        <div className="text-[#666666] text-sm">
          {totalContributions} contributions in the last year
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: '28px' }}>
            {contributions.map((week, weekIndex) => {
              const firstDay = new Date(week.days[0].date);
              const isFirstWeekOfMonth = firstDay.getDate() <= 7;

              return (
                <div key={weekIndex} className="flex-shrink-0" style={{ width: '11px', marginRight: '2px' }}>
                  {isFirstWeekOfMonth && (
                    <span className="text-[10px] text-[#666666]">
                      {months[firstDay.getMonth()]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contribution grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col mr-2">
              {days.map((day, index) => (
                <div
                  key={day}
                  className="text-[10px] text-[#666666] flex items-center justify-end"
                  style={{ height: '11px', marginBottom: '2px' }}
                >
                  {index % 2 === 1 && day}
                </div>
              ))}
            </div>

            {/* Contribution squares */}
            <div className="flex">
              {contributions.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col" style={{ marginRight: '2px' }}>
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="rounded-sm cursor-pointer hover:ring-1 hover:ring-[#8b0000] transition-all"
                      style={{
                        width: '11px',
                        height: '11px',
                        backgroundColor: getLevelColor(day.level),
                        marginBottom: '2px',
                      }}
                      title={`${day.count} contributions on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end mt-3 text-xs text-[#666666]">
            <span className="mr-2">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="rounded-sm"
                style={{
                  width: '11px',
                  height: '11px',
                  backgroundColor: getLevelColor(level),
                  marginRight: '2px',
                }}
              />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
