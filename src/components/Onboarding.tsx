import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { THEME } from '../theme';
import BrutalButton from './BrutalButton';

interface OnboardingProps {
    onAuthenticated: () => void;
}

const Onboarding = ({ onAuthenticated }: OnboardingProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'choice' | 'signup' | 'login'>('choice');

    const handleGoogleSignIn = async () => {
        setIsSigningIn(true);
        setError('');

        try {
            await signInWithPopup(auth, googleProvider);
            onAuthenticated();
        } catch (err: any) {
            console.error('Google sign-in error:', err);
            setError(err.message || 'Failed to sign in with Google');
            setIsSigningIn(false);
        }
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsSigningIn(true);
        setError('');

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            onAuthenticated();
        } catch (err: any) {
            console.error('Email signup error:', err);
            setError(err.message || 'Failed to create account');
            setIsSigningIn(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setIsSigningIn(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onAuthenticated();
        } catch (err: any) {
            console.error('Email login error:', err);
            setError(err.message || 'Failed to sign in');
            setIsSigningIn(false);
        }
    };

    // Choice screen
    if (mode === 'choice') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#CCFF00] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`bg-white p-8 max-w-sm w-full ${THEME.border} ${THEME.shadow} text-center`}
                >
                    <h1 className="text-5xl font-black mb-2 lowercase font-neo tracking-tight">groups</h1>
                    <p className="font-mono text-sm mb-6 border-b-2 border-black pb-4">
                        Quantify the vibe. Score your friends.
                    </p>

                    <div className="space-y-3">
                        <BrutalButton
                            onClick={handleGoogleSignIn}
                            color="bg-white"
                            className="w-full"
                            disabled={isSigningIn}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                        </BrutalButton>

                        <BrutalButton
                            onClick={() => setMode('signup')}
                            color={THEME.primary}
                            className="w-full text-white"
                        >
                            Sign Up with Email
                        </BrutalButton>

                        <BrutalButton
                            onClick={() => setMode('login')}
                            color="bg-white"
                            className="w-full"
                        >
                            Login with Email
                        </BrutalButton>
                    </div>

                    {error && (
                        <p className="mt-4 text-xs text-red-600 font-mono">{error}</p>
                    )}
                </motion.div>
            </div>
        );
    }

    // Email signup/login screen
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#CCFF00] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`bg-white p-8 max-w-sm w-full ${THEME.border} ${THEME.shadow} text-center`}
            >
                <h1 className="text-4xl font-black mb-2 italic">
                    {mode === 'signup' ? 'SIGN UP' : 'LOGIN'}
                </h1>
                <p className="font-mono text-sm mb-6 border-b-2 border-black pb-4">
                    {mode === 'signup' ? 'Create your account' : 'Welcome back!'}
                </p>

                <form onSubmit={mode === 'signup' ? handleEmailSignup : handleEmailLogin} className="flex flex-col gap-4">
                    <div className="text-left">
                        <label className="font-bold text-xs uppercase ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full p-4 font-bold outline-none ${THEME.border} focus:bg-pink-100 transition-colors`}
                            required
                        />
                    </div>

                    <div className="text-left">
                        <label className="font-bold text-xs uppercase ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full p-4 font-bold outline-none ${THEME.border} focus:bg-pink-100 transition-colors`}
                            required
                            minLength={6}
                        />
                    </div>

                    <BrutalButton
                        type="submit"
                        color={THEME.primary}
                        className="text-white w-full"
                        disabled={isSigningIn}
                    >
                        {isSigningIn ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
                    </BrutalButton>

                    <button
                        type="button"
                        onClick={() => setMode('choice')}
                        className="text-sm font-bold underline"
                    >
                        ← Back to options
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-xs text-red-600 font-mono">{error}</p>
                )}
            </motion.div>
        </div>
    );
};

export default Onboarding;
