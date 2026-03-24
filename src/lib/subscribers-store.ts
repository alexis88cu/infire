// Subscriber storage via GitHub API (same pattern as blog.json)
// Reads/writes src/lib/subscribers.json in the GitHub repo

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  industry: string;
  newsletter: boolean;
  createdAt: string;
}

const GITHUB_REPO = process.env.GITHUB_REPO || 'alexis88cu/infire-site';
const FILE_PATH = 'src/lib/subscribers.json';

async function getGitHubFile(): Promise<{ content: string; sha: string }> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not configured.');

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!res.ok) {
    // File doesn't exist yet
    if (res.status === 404) return { content: '[]', sha: '' };
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha };
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  try {
    const { content } = await getGitHubFile();
    return JSON.parse(content) as Subscriber[];
  } catch {
    return [];
  }
}

export async function addSubscriber(sub: Omit<Subscriber, 'id' | 'createdAt'>): Promise<Subscriber> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not configured.');

  const { content, sha } = await getGitHubFile();
  const subscribers: Subscriber[] = JSON.parse(content);

  // Check if already subscribed
  const existing = subscribers.find(s => s.email.toLowerCase() === sub.email.toLowerCase());
  if (existing) return existing;

  const newSub: Subscriber = {
    ...sub,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  subscribers.unshift(newSub);

  const encoded = Buffer.from(JSON.stringify(subscribers, null, 2)).toString('base64');

  const body: Record<string, string> = {
    message: `Add subscriber: ${sub.email}`,
    content: encoded,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`GitHub commit error: ${JSON.stringify(err)}`);
  }

  return newSub;
}
