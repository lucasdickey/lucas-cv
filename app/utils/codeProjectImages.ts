type CodeEntryLike = {
  title: string;
  sourceUrl?: string;
};

const REPO_SLUG_BY_REPO: Record<string, string> = {
  'lucasdickey/prompt-capture-mcp': 'prompt-capture-mcp',
  'lucas-dickey/a-ok-shop': 'a-ok-shop',
  'lucasdickey/self-replicating-art': 'self-replicating-art',
  'lucasdickey/key-to-sleep': 'key-to-sleep',
  'lucasdickey/run-humans-run': 'run-human-run',
  'lucasdickey/emojis-everywhere': 'emojis-everywhere',
  'Prompt-Yield/VizRepoAssist': 'vizrepoassist',
  'lucasdickey/quick-screenshot-annotator': 'quick-screenshot-annotator',
  'lucasdickey/breathe-free': 'breathe-free',
};

const REPO_SLUG_BY_TITLE: Record<string, string> = {
  'OB3.chat - One Big Beautiful Bill discovery app': 'ob3-chat',
};

const IMAGE_BASES = [
  'https://lucasdickey.com/images/repos',
  'https://lucas.cv/images/repos',
];

export function getCodeProjectImage(entry: CodeEntryLike): string | null {
  let slug: string | undefined;

  if (entry.sourceUrl) {
    try {
      const url = new URL(entry.sourceUrl);
      if (url.hostname === 'github.com') {
        const segments = url.pathname.split('/').filter(Boolean);
        const owner = segments[0];
        const repo = segments[1];
        if (owner && repo) {
          slug = REPO_SLUG_BY_REPO[`${owner}/${repo}`];
        }
      }
    } catch (error) {
      console.warn('Unable to parse repository URL for code project image', error);
    }
  }

  if (!slug) {
    slug = REPO_SLUG_BY_TITLE[entry.title];
  }

  if (!slug) {
    return null;
  }

  return `${IMAGE_BASES[0]}/${slug}.png`;
}
