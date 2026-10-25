import SocialTile from './SocialTile';

/**
 * Returns a section containing social tiles that can be used to access the site's social media accounts
 * @returns Returns a section containing all the social tiles used by the site
 */
export default function SocialBar() {
    return (
        <section className="socialBar">
            <SocialTile alt="Facebook" graphic="facebooklogo.png" link="https://www.facebook.com"></SocialTile>
            <SocialTile alt="Bluesky" graphic="blueskylogo.png" link="https://bsky.social/about"></SocialTile>
            <SocialTile alt="Reddit" graphic="redditlogo.png" link="https://www.reddit.com"></SocialTile>
            <SocialTile alt="Twitter" graphic="twitterlogo.png" link="https://x.com"></SocialTile>
        </section>
    )
}