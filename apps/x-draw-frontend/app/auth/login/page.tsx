'use client';

import React, { FormEvent } from 'react';
import Link from 'next/link';
import { PenTool } from 'lucide-react';
import axios from 'axios';

const SignIn = () => {
    const BACKEND_URL = 'http://localhost:4000/auth/login';
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('inside handle submit');

        const form = e.currentTarget;
        console.log('form is ', form);
        const fd = new FormData(form);
        console.log('fd is ', fd);

        const data = Object.fromEntries(fd.entries());
        console.log('data is ', data);
        // console.log(e);
        try {
            const response = await axios.post(BACKEND_URL, data);
            console.log('response is ', response);
            const token = response.data.token;
            console.log('login token ', token);
            localStorage.setItem('x-draw-token', token);
        } catch (error) {
            console.log('error is ', error);
        }
    }
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                        <PenTool className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-gray-400 text-sm mt-2">Enter your details to access your drawings</p>
            </div>

            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">Forgot password?</a>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;