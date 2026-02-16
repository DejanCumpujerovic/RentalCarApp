import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '../Layouts/AppLayout';
import '../../css/Profile.css';

export default function Profile() {
    const { user, flash, errors = {} } = usePage().props;
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const profileForm = useForm({
        name: user?.name ?? '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        const successMsg = flash?.success || '';
        const errorMsg = flash?.error || '';
        const msg = successMsg || errorMsg;
        const type = successMsg ? 'success' : 'error';
        if (msg) {
            setToast({ show: true, message: msg, type });
            const t = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const errObj = errors || profileForm.errors;
        if (!errObj || typeof errObj !== 'object') return;
        const vals = Object.values(errObj);
        const first = vals[0];
        const msg = Array.isArray(first) ? first[0] : first;
        if (msg) {
            setToast({ show: true, message: msg, type: 'error' });
            const t = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
            return () => clearTimeout(t);
        }
    }, [errors, profileForm.errors]);

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put('/profile');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!passwordForm.data.current_password && !passwordForm.data.password) return;
        Inertia.put('/profile', {
            name: profileForm.data.name,
            current_password: passwordForm.data.current_password,
            password: passwordForm.data.password,
            password_confirmation: passwordForm.data.password_confirmation,
        }, {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AppLayout>
            <div className="profile-content">
                <h1 className="profile-title">My Profile</h1>
                <p className="profile-subtitle">Manage your account</p>

                {toast.show && (
                    <div className={`toast toast--${toast.type}`} role="alert">
                        {toast.message}
                    </div>
                )}

                <div className="profile-cards-row">
                <div className="profile-card">
                    <h2 className="profile-section-title">Profile information</h2>
                    <form onSubmit={handleProfileSubmit} className="profile-form">
                        <label className="profile-label">
                            <span>Name</span>
                            <input
                                type="text"
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                className="profile-input"
                                required
                                maxLength={255}
                            />
                        </label>
                        <label className="profile-label">
                            <span>Email</span>
                            <input
                                type="email"
                                value={user?.email ?? ''}
                                disabled
                                className="profile-input profile-input--disabled"
                            />
                            <span className="profile-hint">Email cannot be changed.</span>
                        </label>
                        <button
                            type="submit"
                            className="profile-btn profile-btn--primary"
                            disabled={profileForm.processing}
                        >
                            {profileForm.processing ? 'Saving...' : 'Save changes'}
                        </button>
                    </form>
                </div>

                <div className="profile-card">
                    <h2 className="profile-section-title">Change password</h2>
                    <form onSubmit={handlePasswordSubmit} className="profile-form">
                        <label className="profile-label">
                            <span>Current password</span>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                className="profile-input"
                                autoComplete="current-password"
                            />
                        </label>
                        <label className="profile-label">
                            <span>New password</span>
                            <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                className="profile-input"
                                autoComplete="new-password"
                                minLength={4}
                            />
                        </label>
                        <label className="profile-label">
                            <span>Confirm new password</span>
                            <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                className="profile-input"
                                autoComplete="new-password"
                            />
                        </label>
                        <button
                            type="submit"
                            className="profile-btn profile-btn--primary"
                            disabled={passwordForm.processing || (!passwordForm.data.current_password && !passwordForm.data.password)}
                        >
                            {passwordForm.processing ? 'Updating...' : 'Update password'}
                        </button>
                    </form>
                </div>
                </div>
            </div>
        </AppLayout>
    );
}
