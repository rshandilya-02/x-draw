import React from 'react';
import Link from 'next/link';
import { PenTool } from 'lucide-react';

const SignUp = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
            {/* Brand Header */}
            <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                        <PenTool className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Create an account</h2>
                <p className="text-gray-400 text-sm mt-2">Start collaborating in seconds</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                <form className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-emerald-400 hover:text-emerald-300 font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;