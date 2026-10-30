import '../Styles/Header.css';
import SocialBar from './SocialBar';


/**
 * Returns a header component for use across the site
 * @returns A header component for the site
 */
export default function Header() {
    return (
        <header>
            <h1>GenStore</h1>
            {<SocialBar />}
        </header>
    );
}