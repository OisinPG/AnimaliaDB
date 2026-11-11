import { useState, useEffect } from 'react';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import './Status.css';

declare const process: { env: { REACT_APP_API_URL?: string } };

export default function Status() {
    const [online, setOnline] = useState<boolean>(false);

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
                const response = await fetch(`${apiUrl}/health`);
                setOnline(response.ok);
            } catch {
                setOnline(false);
            }
        };

        void loadStatus();

        const intervalId = window.setInterval(() => {
            void loadStatus();
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <div className={`database-status ${online ? 'is-online' : 'is-offline'}`} role="status">
            <span className="database-status-dot" aria-hidden="true" />
            <span>{online ? 'Database Online' : 'Database Offline'}</span>
        </div>
    );
}