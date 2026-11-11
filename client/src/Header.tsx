import { Link } from "react-router-dom";
import Status from './Status.tsx';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './Header.css'

interface HeaderProps {
    logoText?: string;
}

export default function Header({ logoText = 'ANIMALS' }: HeaderProps) {
    return (
        <header className="navbar">
            <div className="navbar-logo">
                <Link to="/">{logoText}</Link>
            </div>
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