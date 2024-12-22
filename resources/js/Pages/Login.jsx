import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import '../../css/Login.css';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
      email: '',
      password: '',
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login', {
        onFinish: () => console.log('Form submitted'),
    });
    };

  return (
      <div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
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
              <button type="submit" disabled={processing}>
                    {processing ? 'Logging in...' : 'Login'}
              </button>
          </form>
      </div>
  );
}