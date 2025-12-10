import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { THEME } from '../theme';
import { User, UserListItem } from '../types';
import BrutalButton from './BrutalButton';
import { translateToSlang } from '../services/ai';

interface AuraActionProps {
    onClose: () => void;
    users: UserListItem[];
    currentUser: User | null;
    onAction: (targetId: string, amount: number, reason: string) => Promise<void>;
}

const AuraAction = ({ onClose, users, currentUser, onAction }: AuraActionProps) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [amount, setAmount] = useState(100);
    const [reason, setReason] = useState('');
    const [type, setType] = useState<'glaze' | 'roast'>('glaze');
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter to show only friends
    const friendIds = currentUser?.friends || [];
    const friendUsers = users.filter(u =>
        friendIds.includes(u.id) && u.id !== currentUser?.uid
    );

    const handleSubmit = async () => {
        if (!selectedUser || !reason || isProcessing) return;

        setIsProcessing(true);

        try {
            let finalReason = reason;

            // Handle AI translation if requested
            if (reason.startsWith('/slang ')) {
                try {
                    finalReason = await translateToSlang(reason.replace('/slang ', ''));
                } catch (err) {
                    console.error('AI translation failed, using original reason:', err);
                    finalReason = reason.replace('/slang ', '');
                }
            }

            const finalAmount = type === 'glaze' ? Math.abs(amount) : -Math.abs(amount);

            // Submit transaction
            await onAction(selectedUser, finalAmount, finalReason);

            // Close modal immediately after transaction is confirmed
            onClose();
        } catch (err) {
            console.error('Transaction failed:', err);
            setIsProcessing(false);
            // Could show an error message to user here
        }
    };

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm p-4"
        >
            <div className={`w-full max-w-md bg-white ${THEME.border} ${THEME.shadow} overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="bg-black text-white p-4 flex justify-between items-center">
                    <h2 className="font-black text-xl uppercase blink font-neo">Vibe Check</h2>
                    <button onClick={onClose}><X className="text-white" /></button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Toggle Type */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setType('glaze')}
                            className={`flex-1 py-3 font-black uppercase border-2 border-black transition-all ${type === 'glaze' ? 'bg-[#00F0FF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 opacity-50'}`}
                        >
                            Glaze (+)
                        </button>
                        <button
                            onClick={() => setType('roast')}
                            className={`flex-1 py-3 font-black uppercase border-2 border-black transition-all ${type === 'roast' ? 'bg-[#FF4D00] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 opacity-50'}`}
                        >
                            Roast (-)
                        </button>
                    </div>

                    {/* User Select */}
                    <div>
                        <label className="font-bold text-xs uppercase block mb-1">Target</label>
                        <select
                            className={`w-full p-3 font-bold bg-white ${THEME.border}`}
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Select a victim...</option>
                            {friendUsers.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.handle} ({u.aura})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount Slider */}
                    <div>
                        <label
                            className="font-bold text-xs uppercase block mb-1 transition-colors duration-300"
                            style={{
                                color: (() => {
                                    const percent = (amount - 10) / (10000 - 10);

                                    // Helper for linear interpolation between two hex colors
                                    const interpolate = (color1: string, color2: string, factor: number) => {
                                        const c1 = parseInt(color1.slice(1), 16);
                                        const c2 = parseInt(color2.slice(1), 16);

                                        const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
                                        const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;

                                        const r = Math.round(r1 + (r2 - r1) * factor);
                                        const g = Math.round(g1 + (g2 - g1) * factor);
                                        const b = Math.round(b1 + (b2 - b1) * factor);

                                        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                                    };

                                    if (percent < 0.33) return interpolate('#4ADE80', '#FACC15', percent / 0.33); // Green -> Yellow
                                    if (percent < 0.66) return interpolate('#FACC15', '#FF4D00', (percent - 0.33) / 0.33); // Yellow -> Orange
                                    return interpolate('#FF4D00', '#D946EF', (percent - 0.66) / 0.34); // Orange -> Purple
                                })()
                            }}
                        >
                            Magnitude: {amount}
                        </label>
                        <div className="relative h-6 w-full flex items-center">
                            <input
                                type="range"
                                min="10"
                                max="10000"
                                step="10"
                                value={amount}
                                onChange={(e) => setAmount(parseInt(e.target.value))}
                                className="w-full h-4 rounded-none appearance-none border-2 border-black relative z-10 bg-transparent cursor-pointer"
                                style={{
                                    background: (() => {
                                        const percent = (amount - 10) / (10000 - 10);

                                        // Same interpolation helper
                                        const interpolate = (color1: string, color2: string, factor: number) => {
                                            const c1 = parseInt(color1.slice(1), 16);
                                            const c2 = parseInt(color2.slice(1), 16);

                                            const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
                                            const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;

                                            const r = Math.round(r1 + (r2 - r1) * factor);
                                            const g = Math.round(g1 + (g2 - g1) * factor);
                                            const b = Math.round(b1 + (b2 - b1) * factor);

                                            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                                        };

                                        let color;
                                        if (percent < 0.33) color = interpolate('#4ADE80', '#FACC15', percent / 0.33);
                                        else if (percent < 0.66) color = interpolate('#FACC15', '#FF4D00', (percent - 0.33) / 0.33);
                                        else color = interpolate('#FF4D00', '#D946EF', (percent - 0.66) / 0.34);

                                        return `linear-gradient(to right, ${color} 0%, ${color} ${percent * 100}%, #E5E7EB ${percent * 100}%, #E5E7EB 100%)`;
                                    })()
                                }}
                            />
                            {/* Glow Effect */}
                            <div
                                className="absolute inset-0 blur-md opacity-50 transition-colors duration-300 pointer-events-none"
                                style={{
                                    background: (() => {
                                        const percent = (amount - 10) / (10000 - 10);

                                        const interpolate = (color1: string, color2: string, factor: number) => {
                                            const c1 = parseInt(color1.slice(1), 16);
                                            const c2 = parseInt(color2.slice(1), 16);
                                            const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
                                            const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
                                            const r = Math.round(r1 + (r2 - r1) * factor);
                                            const g = Math.round(g1 + (g2 - g1) * factor);
                                            const b = Math.round(b1 + (b2 - b1) * factor);
                                            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                                        };

                                        if (percent < 0.33) return interpolate('#4ADE80', '#FACC15', percent / 0.33);
                                        if (percent < 0.66) return interpolate('#FACC15', '#FF4D00', (percent - 0.33) / 0.33);
                                        return interpolate('#FF4D00', '#D946EF', (percent - 0.66) / 0.34);
                                    })()
                                }}
                            />
                        </div>
                        <div className="flex justify-between text-xs font-mono mt-2 opacity-80 font-bold transition-colors duration-300">
                            <span className="text-green-500">Mild</span>
                            <span className="text-yellow-500">Spicy</span>
                            <span className="text-orange-500">Nuclear</span>
                            <span className="text-purple-500">Celestial</span>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <div className="flex justify-between">
                            <label className="font-bold text-xs uppercase block mb-1">The Receipt (Reason)</label>
                            <span className="text-[10px] font-mono text-gray-500">/slang supported</span>
                        </div>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={type === 'glaze' ? "Held the door open..." : "Tripped on nothing..."}
                            className={`w-full p-3 font-bold bg-gray-50 ${THEME.border} h-24 resize-none`}
                            disabled={isProcessing}
                        />
                    </div>

                    <BrutalButton
                        onClick={handleSubmit}
                        color="bg-yellow-400"
                        className="w-full"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <Sparkles className="animate-spin" size={16} /> Processing...
                            </span>
                        ) : 'Confirm Transaction'}
                    </BrutalButton>
                </div>
            </div>
        </motion.div>
    );
};

export default AuraAction;
