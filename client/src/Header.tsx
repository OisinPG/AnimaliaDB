// Client-side links (as opposed to server-side <a>)
import { Link } from "react-router-dom";
// Connection status of database
import Status from './Status.tsx';
// @ts-ignore
import './Header.css'

// What is used for the logo of the header
interface HeaderProps {
    logoText?: string;
}

// Header React Component
export default function Header({ logoText = 'ANIMALS' }: HeaderProps) {
    return (
        <header className="navbar">
            {/* Logo of the header */}
            <div className="navbar-logo">
                <Link to="/">{logoText}</Link>
            </div>
            {/* Different pages we're leading to */}
            <nav className="navbar-links">
                <ul>
                    <li><Link to="/directory">DB</Link></li>
                    <li><Link to="/random">RANDOM</Link></li>
                    <li><Link to="/about">ABOUT</Link></li>
                    <li><Status /></li>
                </ul>
            </nav>
        </header>
    );
}