import { env } from '$env/dynamic/private';

export interface GitHubStats {
	repos: number;
	commits: number;
	stars: number;
	followers: number;
	contributions: number;
	pullRequests: number;
	issues: number;
}

export interface ContributionDay {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
	days: ContributionDay[];
}

export interface GitHubData {
	stats: GitHubStats;
	contributionGraph: ContributionWeek[];
	updatedAt: string;
}

interface GraphQLContributionDay {
	contributionCount: number;
	contributionLevel: string;
	date: string;
}

interface GraphQLResponse {
	data: {
		user: {
			repositories: {
				totalCount: number;
				nodes: Array<{ stargazerCount: number }>;
			};
			followers: { totalCount: number };
			pullRequests: { totalCount: number };
			issues: { totalCount: number };
			contributionsCollection: {
				totalCommitContributions: number;
				contributionCalendar: {
					totalContributions: number;
					weeks: Array<{
						contributionDays: GraphQLContributionDay[];
					}>;
				};
			};
		};
	};
}

const QUERY = `
query($username: String!) {
  user(login: $username) {
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: { field: STARGAZERS, direction: DESC }) {
      totalCount
      nodes {
        stargazerCount
      }
    }
    followers {
      totalCount
    }
    pullRequests(states: [OPEN, CLOSED, MERGED]) {
      totalCount
    }
    issues(states: [OPEN, CLOSED]) {
      totalCount
    }
    contributionsCollection {
      totalCommitContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            contributionLevel
            date
          }
        }
      }
    }
  }
}`;

function mapLevel(level: string): 0 | 1 | 2 | 3 | 4 {
	switch (level) {
		case 'FIRST_QUARTILE':
			return 1;
		case 'SECOND_QUARTILE':
			return 2;
		case 'THIRD_QUARTILE':
			return 3;
		case 'FOURTH_QUARTILE':
			return 4;
		default:
			return 0;
	}
}

export async function getGitHubData(username: string): Promise<GitHubData | null> {
	const GITHUB_TOKEN = env.GITHUB_TOKEN;
	if (!GITHUB_TOKEN) {
		console.warn('GITHUB_TOKEN not set — skipping GitHub activity section');
		return null;
	}

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `bearer ${GITHUB_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: QUERY, variables: { username } })
		});

		if (!response.ok) {
			console.error(`GitHub API error: ${response.status}`);
			return null;
		}

		const json = (await response.json()) as GraphQLResponse;
		const user = json.data.user;

		const totalStars = user.repositories.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0);

		const calendar = user.contributionsCollection.contributionCalendar;

		const contributionGraph: ContributionWeek[] = calendar.weeks.map((week) => ({
			days: week.contributionDays.map((day) => ({
				date: day.date,
				count: day.contributionCount,
				level: mapLevel(day.contributionLevel)
			}))
		}));

		return {
			stats: {
				repos: user.repositories.totalCount,
				commits: user.contributionsCollection.totalCommitContributions,
				stars: totalStars,
				followers: user.followers.totalCount,
				contributions: calendar.totalContributions,
				pullRequests: user.pullRequests.totalCount,
				issues: user.issues.totalCount
			},
			contributionGraph,
			updatedAt: new Date().toISOString()
		};
	} catch (error) {
		console.error('Failed to fetch GitHub data:', error);
		return null;
	}
}
