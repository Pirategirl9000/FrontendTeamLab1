import SocialTile from './SocialTile';

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