/**
 * The site's canonical origin.
 *
 * Everything that has to name the site absolutely — canonical tags, Open Graph
 * URLs, the sitemap, the RSS feed, and the Markdown surfaces — reads this. It
 * used to be written out by hand in a dozen files, which is how the site went
 * on declaring a retired domain canonical long after it stopped being used.
 *
 * `www` is deliberate: the apex redirects to it, so naming the apex would put a
 * redirect hop in front of every canonical URL a crawler follows.
 */
export const SITE_URL = "https://www.lucasdickey.com";
