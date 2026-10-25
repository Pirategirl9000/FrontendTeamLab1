/**
 * Returns an article that contains a social media link embedded in an image
 * @param {Object} prop An object containing properties for rendering tiles 
 * @param {String} prop.alt Alternate text for screen readers or if the image fails to load
 * @param {String} prop.graphic The image to display for the tile
 * @param {String} prop.link A link that clicking on the tile will take you to
 * @returns 
 */
export default function SocialTile({alt, graphic, link}) {
    return (
        <article className="SocialTile">
            <a href={link}><img src={graphic} alt={alt} width="20px" height="20px"></img></a>
        </article>
    )
}