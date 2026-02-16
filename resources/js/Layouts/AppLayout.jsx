import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import '../../css/Layout.css';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    const handleLogout = () => {
        Inertia.post('/logout');
    };

    return (
        <div className="app-layout">
            <div className="app-layout-top-bar">
                <div className="app-layout-header">
                    {auth?.user ? (
                        <>
                            <span className="app-layout-user">
                                User: <span className="app-layout-user-name">{auth.user.name}</span>
                            </span>
                            <InertiaLink href="/" className="app-layout-btn">Home</InertiaLink>
                            <InertiaLink href="/my-rentals" className="app-layout-btn app-layout-btn--primary">
                                My Reservations
                            </InertiaLink>
                            <InertiaLink href="/profile" className="app-layout-btn">Profile</InertiaLink>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="app-layout-btn app-layout-btn--logout"
                                aria-label="Logout"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <InertiaLink href="/" className="app-layout-btn">Home</InertiaLink>
                            <a href="/login" className="app-layout-btn app-layout-btn--primary">Login</a>
                        </>
                    )}
                </div>
            </div>
            <div className="app-layout-body">
                {children}
            </div>
        </div>
    );
}
