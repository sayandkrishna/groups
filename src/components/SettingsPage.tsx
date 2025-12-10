import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, User, Smile, Key, ExternalLink } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { doc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';

import { auth, db } from '../firebase';
import { THEME, getAllAvatars } from '../theme';
import { User as UserType } from '../types';
import BrutalButton from './BrutalButton';
import { getUserApiKey, setUserApiKey, removeUserApiKey, hasUserApiKey } from '../services/ai';

interface SettingsPageProps {
    user: UserType;
    onBack: () => void;
}

const SettingsPage = ({ user, onBack }: SettingsPageProps) => {
    const [codename, setCodename] = useState(user.handle || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || '😺');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // API Key state
    const [apiKey, setApiKey] = useState('');
    const [hasCustomKey, setHasCustomKey] = useState(false);
    const [apiKeySuccess, setApiKeySuccess] = useState('');
    const [apiKeyError, setApiKeyError] = useState('');

    const avatars = getAllAvatars();

    // Load API key status on mount
    useEffect(() => {
        setHasCustomKey(hasUserApiKey());
        const userKey = getUserApiKey();
        if (userKey) {
            // Show masked version
            setApiKey(userKey.slice(0, 8) + '...' + userKey.slice(-4));
        }
    }, []);

    const handleAvatarChange = () => {
        const currentIndex = avatars.indexOf(selectedAvatar);
        const nextIndex = (currentIndex + 1) % avatars.length;
        setSelectedAvatar(avatars[nextIndex]);
    };

    const handleSaveChanges = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (codename.trim().length < 3) {
            setError('Codename must be at least 3 characters');
            return;
        }

        if (codename.trim().length > 12) {
            setError('Codename must be 12 characters or less');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(codename.trim())) {
            setError('Only letters, numbers, and underscores allowed');
            return;
        }

        setIsSubmitting(true);

        try {
            // Check if codename changed and if it's already taken
            if (codename.toLowerCase() !== user.handle?.toLowerCase()) {
                const handleQuery = query(
                    collection(db, 'users'),
                    where('handle', '==', codename.toLowerCase())
                );
                const handleSnap = await getDocs(handleQuery);

                if (!handleSnap.empty) {
                    setError('This codename is already taken');
                    setIsSubmitting(false);
                    return;
                }
            }

            // Update user profile
            await updateDoc(doc(db, 'users', user.uid), {
                handle: codename.toLowerCase(),
                avatar: selectedAvatar
            });

            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err: any) {
            // Ignore network errors from ad blockers blocking Firestore cleanup
            if (err?.code !== 'auth/network-request-failed') {
                console.error('Logout failed:', err);
            }
        }
    };

    const handleSaveApiKey = () => {
        setApiKeyError('');
        setApiKeySuccess('');

        if (!apiKey.trim()) {
            setApiKeyError('Please enter an API key');
            return;
        }

        // Basic validation - Gemini API keys start with "AIza"
        if (!apiKey.startsWith('AIza')) {
            setApiKeyError('Invalid API key format. Gemini API keys start with "AIza"');
            return;
        }

        try {
            setUserApiKey(apiKey.trim());
            setHasCustomKey(true);
            setApiKeySuccess('API key saved successfully!');
            // Mask the key after saving
            setApiKey(apiKey.slice(0, 8) + '...' + apiKey.slice(-4));
            setTimeout(() => setApiKeySuccess(''), 3000);
        } catch (err: any) {
            setApiKeyError('Failed to save API key');
        }
    };

    const handleRemoveApiKey = () => {
        removeUserApiKey();
        setHasCustomKey(false);
        setApiKey('');
        setApiKeySuccess('API key removed. Using server key.');
        setTimeout(() => setApiKeySuccess(''), 3000);
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`h-screen ${THEME.bg} flex flex-col w-full max-w-lg mx-auto`}
        >
            {/* Header */}
            <div className="p-4 pt-6 border-b-2 border-black bg-white">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className={`p-2 ${THEME.border} ${THEME.shadow} ${THEME.shadowActive} bg-white hover:bg-gray-100 transition-colors`}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black font-neo">SETTINGS</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Profile Section */}
                <div className={`bg-white ${THEME.border} ${THEME.shadow} p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                        <User size={20} />
                        <h2 className="font-bold text-lg uppercase">Profile</h2>
                    </div>

                    <form onSubmit={handleSaveChanges} className="space-y-4">
                        {/* Avatar Selection */}
                        <div>
                            <label className="font-bold text-xs uppercase mb-2 block">Avatar</label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={handleAvatarChange}
                                    className={`text-6xl p-4 ${THEME.border} ${THEME.shadow} ${THEME.shadowActive} bg-white hover:bg-yellow-100 transition-colors`}
                                >
                                    {selectedAvatar}
                                </button>
                                <div className="flex-1">
                                    <p className="text-sm font-mono text-gray-600">
                                        Tap to change your avatar
                                    </p>
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {avatars.map((avatar, idx) => (
                                            <span
                                                key={idx}
                                                className={`text-2xl opacity-${avatar === selectedAvatar ? '100' : '30'}`}
                                            >
                                                {avatar}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Codename Input */}
                        <div>
                            <label className="font-bold text-xs uppercase mb-2 block">Codename</label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 font-bold text-gray-400">@</span>
                                <input
                                    type="text"
                                    value={codename}
                                    onChange={(e) => setCodename(e.target.value.toLowerCase())}
                                    className={`w-full p-4 pl-8 font-bold outline-none ${THEME.border} focus:bg-pink-100 transition-colors`}
                                    maxLength={12}
                                />
                            </div>
                            <p className="text-xs font-mono text-gray-500 mt-1">
                                3-12 characters, letters/numbers/underscores only
                            </p>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className={`p-3 ${THEME.border} bg-red-100 text-red-700 font-mono text-sm font-bold`}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className={`p-3 ${THEME.border} bg-green-100 text-green-700 font-mono text-sm font-bold`}>
                                {success}
                            </div>
                        )}

                        {/* Save Button */}
                        <BrutalButton
                            type="submit"
                            color={THEME.primary}
                            className="text-white w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </BrutalButton>
                    </form>
                </div>

                {/* API Key Section */}
                <div className={`bg-white ${THEME.border} ${THEME.shadow} p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Key size={20} />
                        <h2 className="font-bold text-lg uppercase">AI API Key</h2>
                        <span className="text-xs font-mono px-2 py-1 bg-yellow-100 border border-black rounded">Optional</span>
                    </div>

                    <div className="space-y-4">
                        {/* Status */}
                        <div className={`p-3 ${THEME.border} ${hasCustomKey ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <p className="text-xs font-mono font-bold uppercase">
                                Status: {hasCustomKey ? '✓ Using your API key' : '○ Using server key'}
                            </p>
                        </div>

                        {/* API Key Input */}
                        <div>
                            <label className="font-bold text-xs uppercase mb-2 block">Your Gemini API Key</label>
                            <input
                                type="text"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIza..."
                                className={`w-full p-4 font-mono text-sm outline-none ${THEME.border} focus:bg-blue-50 transition-colors`}
                            />
                            <p className="text-xs font-mono text-gray-500 mt-1">
                                Stored locally in your browser
                            </p>
                        </div>

                        {/* Error/Success Messages */}
                        {apiKeyError && (
                            <div className={`p-3 ${THEME.border} bg-red-100 text-red-700 font-mono text-sm font-bold`}>
                                {apiKeyError}
                            </div>
                        )}
                        {apiKeySuccess && (
                            <div className={`p-3 ${THEME.border} bg-green-100 text-green-700 font-mono text-sm font-bold`}>
                                {apiKeySuccess}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <BrutalButton
                                onClick={handleSaveApiKey}
                                color={THEME.secondary}
                                className="flex-1"
                            >
                                Save Key
                            </BrutalButton>
                            {hasCustomKey && (
                                <BrutalButton
                                    onClick={handleRemoveApiKey}
                                    color="bg-gray-300"
                                    className="flex-1"
                                >
                                    Remove
                                </BrutalButton>
                            )}
                        </div>

                        {/* Help Link */}
                        <a
                            href="https://aistudio.google.com/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-3 ${THEME.border} bg-blue-50 hover:bg-blue-100 transition-colors text-sm font-bold`}
                        >
                            <ExternalLink size={16} />
                            Get your free API key
                        </a>

                        {/* Info */}
                        <div className="text-xs font-mono text-gray-600 space-y-1">
                            <p>💡 <strong>Why provide your own key?</strong></p>
                            <p>• Reduces server costs</p>
                            <p>• Your own rate limits</p>
                            <p>• Optional - works without it</p>
                        </div>
                    </div>
                </div>

                {/* Account Section */}
                <div className={`bg-white ${THEME.border} ${THEME.shadow} p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Smile size={20} />
                        <h2 className="font-bold text-lg uppercase">Account</h2>
                    </div>

                    <div className="space-y-3">
                        <div className="pb-3 border-b-2 border-gray-200">
                            <p className="text-xs font-mono text-gray-500 uppercase">Email</p>
                            <p className="font-bold mt-1">{user.email}</p>
                        </div>
                        <div className="pb-3 border-b-2 border-gray-200">
                            <p className="text-xs font-mono text-gray-500 uppercase">User ID</p>
                            <p className="font-mono text-sm mt-1">{user.uid.slice(0, 12)}...</p>
                        </div>
                        <div>
                            <p className="text-xs font-mono text-gray-500 uppercase">Aura Points</p>
                            <p className="font-black text-2xl mt-1 font-neo">{user.aura || 0} PTS</p>
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className={`bg-white ${THEME.border} ${THEME.shadow} p-6`}>
                    <BrutalButton
                        onClick={handleLogout}
                        color="bg-red-500"
                        className="text-white w-full flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} />
                        Logout
                    </BrutalButton>
                </div>

                {/* Footer Spacing */}
                <div className="h-8"></div>
            </div>
        </motion.div>
    );
};

export default SettingsPage;
