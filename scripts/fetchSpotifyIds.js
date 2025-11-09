#!/usr/bin/env node

/**
 * Fetch Spotify IDs for podcasts from a list
 *
 * Usage:
 * 1. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET env vars
 * 2. Run: node scripts/fetchSpotifyIds.js
 *
 * Get credentials from: https://developer.spotify.com/dashboard
 */

const fs = require('fs');
const https = require('https');

// Podcast list from OPML
const podcastList = [
  "Up First from NPR",
  "SHIFT",
  "Bloomberg Tech",
  "Brains On! Science podcast for kids",
  "The MAD Podcast with Matt Turck",
  "Lex Fridman Podcast",
  "The Axe Files with David Axelrod",
  "Hard Fork",
  "Marketplace Morning Report",
  "The Twenty Minute VC (20VC): Venture Capital | Startup Funding | The Pitch",
  "Planet Money Plus",
  "Marketplace",
  "Planet Money",
  "The Al Franken Podcast",
  "Conversations with Tyler",
  "AI Opinion Keynotes (A-OK)",
  "Uncapped with Jack Altman",
  "NVIDIA AI Podcast",
  "The Conversation with Dasha Burns",
  "Mixed Signals from Semafor Media",
  "Post Reports",
  "Practical AI",
  "The Political Scene | The New Yorker",
  "Pod Save America",
  "ThursdAI - The top AI news from the past week",
  "FiveThirtyEight Politics",
  "Political Gabfest",
  "Discover Daily by Perplexity",
  "Wannabe Angels",
  "Short Wave",
  "Economist Podcasts",
  "OpenAI Podcast",
  "Possible",
  "WSJ Tech News Briefing",
  "Training Data",
  "The Vergecast",
  "Throughline",
  "The Daily",
  "BG2Pod with Brad Gerstner and Bill Gurley",
  "AWS Podcast",
  "Latent Space: The AI Engineer Podcast",
  "Bold Names",
  "Generative Now | AI Builders on Creating the Future",
  "Decoder with Nilay Patel",
  "TED Tech",
  "The Prof G Pod with Scott Galloway",
  "WSJ What's News",
  "Prof G Markets",
  "Hidden Brain",
  "Morning Joe",
  "The Bid",
  "Dwarkesh Podcast",
  "The Journal.",
  "Y Combinator Startup Podcast",
  "On with Kara Swisher",
  "No Priors: Artificial Intelligence | Technology | Startups",
  "Founders",
  "Tools and Weapons with Brad Smith",
  "The Hustle Daily Show",
  "The Intelligence from The Economist",
  "Lenny's Podcast: Product | Growth | Career",
  "Lightcone Podcast",
  "The Opinions",
  "Masters of Scale",
  "The Ben & Marc Show",
  "80,000 Hours Podcast",
  "The NPR Politics Podcast",
  "The Ezra Klein Show",
  "DealBook Summit",
  "The Indicator from Planet Money",
  "This Day in AI Podcast",
  "StrictlyVC Download",
  "The Knowledge Project with Shane Parrish",
  "1A Plus",
  "Slate Money",
  "Marketplace Tech",
  "This Week in Tech (Audio)",
  "Cheeky Pint",
  "Making Sense with Sam Harris",
  "Consider This from NPR Plus",
  "The Headlines",
  "Honestly with Bari Weiss",
  "All-In with Chamath, Jason, Sacks & Friedberg",
  "Face the Nation with Margaret Brennan",
  "Sound Strategy with Lucas Dickey: The Most Meta Podcast About Podcasting Ever",
  "This Week in Startups",
  "Brian Lehrer: A Daily Politics Podcast",
  "Impromptu",
  "The David Pakman Show",
  '"Econ 102" with Noah Smith and Erik Torenberg',
  "Amicus With Dahlia Lithwick | Law, justice, and the courts",
  "The Playbook Podcast",
  "Interesting Times with Ross Douthat",
  "Machine Learning Street Talk (MLST)",
  "Consumer VC",
  "Uncanny Valley | WIRED",
  "Waveform: The MKBHD Podcast",
  "Where Should We Begin? with Esther Perel",
  "Today, Explained",
  "a16z Podcast",
  "The Most Interesting Thing in A.I.",
  "Grit",
  "The Pragmatic Engineer",
  "LA Venture",
  "The Neuron: AI Explained",
];

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: Missing Spotify API credentials');
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables');
  console.error('Get credentials from: https://developer.spotify.com/dashboard');
  process.exit(1);
}

/**
 * Get Spotify access token
 */
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const postData = 'grant_type=client_credentials';

    const options = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.access_token);
        } catch (e) {
          reject(new Error(`Failed to parse token response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Search for a podcast on Spotify
 */
async function searchPodcast(podcastName, accessToken) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(podcastName);
    const path = `/v1/search?q=${query}&type=show&limit=1`;

    const options = {
      hostname: 'api.spotify.com',
      path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const shows = parsed.shows?.items || [];
          if (shows.length > 0) {
            const imageUrl = shows[0].images?.[0]?.url || null;
            resolve({
              name: podcastName,
              spotifyId: shows[0].id,
              spotifyName: shows[0].name,
              spotifyUrl: shows[0].external_urls?.spotify,
              imageUrl: imageUrl,
            });
          } else {
            resolve({
              name: podcastName,
              spotifyId: null,
              spotifyName: null,
              spotifyUrl: null,
              imageUrl: null,
            });
          }
        } catch (e) {
          reject(new Error(`Failed to parse search response for ${podcastName}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Fetching Spotify access token...');
    const accessToken = await getAccessToken();
    console.log('✓ Access token obtained\n');

    console.log(`Searching for ${podcastList.length} podcasts...\n`);

    const results = [];
    const failed = [];

    for (let i = 0; i < podcastList.length; i++) {
      const podcastName = podcastList[i];
      try {
        const result = await searchPodcast(podcastName, accessToken);
        results.push(result);

        if (result.spotifyId) {
          console.log(`✓ [${i + 1}/${podcastList.length}] ${podcastName}`);
          console.log(`  ID: ${result.spotifyId}`);
          console.log(`  Spotify: ${result.spotifyName}`);
        } else {
          console.log(`✗ [${i + 1}/${podcastList.length}] ${podcastName} - NOT FOUND`);
          failed.push(podcastName);
        }

        // Rate limiting - Spotify allows ~1000 requests per second
        // But let's be conservative with a small delay
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`✗ [${i + 1}/${podcastList.length}] ${podcastName} - ERROR: ${error.message}`);
        failed.push(podcastName);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\nResults: ${results.filter(r => r.spotifyId).length}/${podcastList.length} found`);
    if (failed.length > 0) {
      console.log(`Failed to find: ${failed.join(', ')}`);
    }

    // Generate JavaScript output
    console.log('\n' + '='.repeat(60));
    console.log('\nGenerated JavaScript array:\n');
    console.log('export const subscribedPodcasts = [');
    results.forEach((result) => {
      const spotifyId = result.spotifyId ? `"${result.spotifyId}"` : '""';
      const imageUrl = result.imageUrl ? `"${result.imageUrl}"` : 'null';
      console.log(`  { name: "${result.name.replace(/"/g, '\\"')}", spotifyId: ${spotifyId}, imageUrl: ${imageUrl} },`);
    });
    console.log('];');

    // Save to file
    const outputPath = './src/data/podcasts.ts';
    const fileContent = `// Auto-generated from scripts/fetchSpotifyIds.js
// Generated: ${new Date().toISOString()}

export const subscribedPodcasts = [
${results.map((result) => {
  const spotifyId = result.spotifyId ? `"${result.spotifyId}"` : '""';
  const imageUrl = result.imageUrl ? `"${result.imageUrl}"` : 'null';
  return `  { name: "${result.name.replace(/"/g, '\\"')}", spotifyId: ${spotifyId}, imageUrl: ${imageUrl} },`;
}).join('\n')}
];
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`\n✓ Saved to ${outputPath}`);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
