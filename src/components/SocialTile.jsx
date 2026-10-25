export default function SocialTile({alt, graphic, link}) {
    return (
        <article className="SocialTile">
            <a href={link}><img src={graphic} alt={alt} width="20px" height="20px"></img></a>
        </article>
    )
}