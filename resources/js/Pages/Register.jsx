import React from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { InertiaLink } from '@inertiajs/inertia-react';
import '../../css/Login.css';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Name"
                />
                {errors.name && <span>{errors.name}</span>}
                <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Email"
                />
                {errors.email && <span>{errors.email}</span>}
                <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Password"
                />
                {errors.password && <span>{errors.password}</span>}
                <input
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder="Confirm Password"
                />
                <button type="submit" disabled={processing}>
                    {processing ? 'Creating account...' : 'Register'}
                </button>
            </form>
            <p className="auth-switch">
                Already have an account? <InertiaLink href="/login">Login</InertiaLink>
            </p>
        </div>
    );
}
