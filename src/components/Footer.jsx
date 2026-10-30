import '../Styles/Footer.css';

/**
 * Returns a footer component for use across the site
 * @returns A footer component containing info abou the site
 */
export default function Footer() {
    return (
        <footer>
            <nav className="footerLinks">
                <a href="#support">Support</a>
                <a href="#faq">FAQ</a>
                <a href="#report">Report</a>
                <a href="#become-a-seller">Become a seller</a>
                <a href="#orders">Orders</a>
            </nav>
            <p className="copyright">Gen store 2026</p>
        </footer>
    );
}