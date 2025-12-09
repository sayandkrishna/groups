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

    // Sort users: Friends first, then everyone else
    const friendIds = currentUser?.friends || [];
    const sortedUsers = [...users].sort((a, b) => {
        const aIsFriend = friendIds.includes(a.id);
        const bIsFriend = friendIds.includes(b.id);
        if (aIsFriend && !bIsFriend) return -1;
        if (!aIsFriend && bIsFriend) return 1;
        return 0;
    });

    const handleSubmit = async () => {
        if (!selectedUser || !reason || isProcessing) return;

        setIsProcessing(true);
        let finalReason = reason;

        if (reason.startsWith('/slang ')) {
            finalReason = await translateToSlang(reason.replace('/slang ', ''));
        }

        const finalAmount = type === 'glaze' ? Math.abs(amount) : -Math.abs(amount);
        await onAction(selectedUser, finalAmount, finalReason);
        setIsProcessing(false);
        onClose();
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
                            {sortedUsers.filter(u => u.id !== currentUser?.uid).map(u => (
                                <option key={u.id} value={u.id}>
                                    {friendIds.includes(u.id) ? '★ ' : ''}{u.handle} ({u.aura})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount Slider */}
                    <div>
                        <label className="font-bold text-xs uppercase block mb-1">Magnitude: {amount}</label>
                        <input
                            type="range"
                            min="10"
                            max="10000"
                            step="10"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            className="w-full accent-black h-4 bg-gray-200 rounded-none appearance-none border-2 border-black"
                        />
                        <div className="flex justify-between text-xs font-mono mt-1 opacity-60">
                            <span>Mild</span>
                            <span>Celestial</span>
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
