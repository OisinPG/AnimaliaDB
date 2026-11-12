// So we can use state variables
import { useState, useEffect } from 'react';
// @ts-ignore
import './Status.css';

// for getting REACT_APP_API_URL from .env
declare const process: { env: { REACT_APP_API_URL?: string } };

export default function Status() {
    //State for whether or not you're online
    const [online, setOnline] = useState<boolean>(false);

    //useEffect is so we set the state AFTER the component renders
    useEffect(() => {
        // Do a health check, if it fails we set online to false, true otherwize
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

        //Checks if the DB is still connected every 5 seconds
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