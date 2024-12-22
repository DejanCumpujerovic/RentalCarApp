import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Logout() {
    const handleLogout = () => {
        Inertia.post('/logout', {}, {
            onSuccess: () => {
                // Redirect back to the home page after logging out
                Inertia.visit('/');
            },
        });
    };

    return <button onClick={handleLogout}>Logout</button>;
}