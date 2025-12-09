import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../theme';
import BrutalButton from './BrutalButton';

interface CodenamePageProps {
    onSetCodename: (handle: string) => void;
    email?: string;
}

const CodenamePage = ({ onSetCodename, email }: CodenamePageProps) => {
    const [handle, setHandle] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (handle.trim().length < 3) {
            setError('Codename must be at least 3 characters');
            return;
        }

        if (handle.trim().length > 12) {
            setError('Codename must be 12 characters or less');
            return;
        }

        // Only allow alphanumeric and underscores
        if (!/^[a-zA-Z0-9_]+$/.test(handle.trim())) {
            setError('Only letters, numbers, and underscores allowed');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await onSetCodename(handle.trim());
        } catch (err: any) {
            setError(err.message || 'Failed to set codename');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#00F0FF] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`bg-white p-8 max-w-sm w-full ${THEME.border} ${THEME.shadow} text-center`}
            >
                <h1 className="text-3xl font-black mb-2 italic">CHOOSE YOUR<br />CODENAME</h1>
                <p className="font-mono text-sm mb-6 border-b-2 border-black pb-4">
                    This is how others will find you.
                </p>

                {email && (
                    <p className="text-xs font-mono text-gray-500 mb-4">
                        Signed in as: {email}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="text-left">
                        <label className="font-bold text-xs uppercase ml-1">Your Codename</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 font-bold text-gray-400">@</span>
                            <input
                                type="text"
                                placeholder="chillguy"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.toLowerCase())}
                                className={`w-full p-4 pl-8 font-bold outline-none ${THEME.border} focus:bg-pink-100 transition-colors`}
                                maxLength={12}
                                autoFocus
                            />
                        </div>
                        <p className="text-xs font-mono text-gray-500 mt-1 ml-1">
                            3-12 characters, letters/numbers/underscores only
                        </p>
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 font-mono font-bold">{error}</p>
                    )}

                    <BrutalButton
                        type="submit"
                        color={THEME.primary}
                        className="text-white w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Setting up...' : 'Lock It In'}
                    </BrutalButton>
                </form>
            </motion.div>
        </div>
    );
};

export default CodenamePage;
