import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { THEME } from '../theme';
import BrutalButton from './BrutalButton';
import { detectSentiment, translateToSlang } from '../services/ai';

interface ChatInputProps {
    onSend: (text: string, sentiment: 'roast' | 'glaze' | 'neutral') => void;
    userAura: number;
    disabled?: boolean;
}

const EMOJI_PACKS = [
    { minAura: -99999, emojis: ['💀', '🤡', '💩', '👻', '🧊'] },
    { minAura: 0, emojis: ['🔥', '💯', '🗿', '👀', '🧢', '🤣'] },
    { minAura: 5000, emojis: ['👑', '✨', '🐐', '💎', '🚀', '🔮'] }
];

const ChatInput = ({ onSend, userAura, disabled }: ChatInputProps) => {
    const [msg, setMsg] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);

    const handleSend = async () => {
        if (!msg.trim() || isProcessing) return;

        setIsProcessing(true);
        let finalMsg = msg;

        // Slang command check
        if (msg.startsWith('/slang ')) {
            const rawText = msg.replace('/slang ', '');
            finalMsg = await translateToSlang(rawText);
        }

        // Sentiment analysis
        const sentimentResult = await detectSentiment(finalMsg);

        onSend(finalMsg, sentimentResult.sentiment);

        setMsg('');
        setIsProcessing(false);
        setShowEmojis(false);
    };

    const handleEmojiClick = (emoji: string) => {
        setMsg(prev => prev + emoji);
    };

    // Get available emojis based on aura
    const availableEmojis = EMOJI_PACKS.filter(pack => userAura >= pack.minAura).flatMap(p => p.emojis);

    return (
        <div className={`p-4 bg-white ${THEME.border} border-t-2 sticky bottom-0`}>
            {/* Emoji Picker */}
            {showEmojis && (
                <div className="flex flex-wrap gap-2 mb-3 p-2 bg-gray-100 border-2 border-black">
                    {availableEmojis.map(emoji => (
                        <button
                            key={emoji}
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-xl hover:scale-125 transition-transform"
                        >
                            {emoji}
                        </button>
                    ))}
                    {userAura < 5000 && (
                        <div className="w-full text-xs font-mono text-gray-500 mt-1">
                            Reach 5000 Aura for God Tier emojis (👑✨🐐)
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => setShowEmojis(!showEmojis)}
                    className="p-3 bg-yellow-300 border-2 border-black font-bold hover:bg-yellow-400"
                >
                    ☺
                </button>

                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={userAura < 0 ? "Apologize here..." : "Yap here..."}
                    className={`flex-1 p-3 font-bold outline-none ${THEME.border} bg-gray-50 focus:bg-white`}
                    disabled={disabled || isProcessing}
                />

                <BrutalButton
                    onClick={handleSend}
                    disabled={disabled || isProcessing || !msg.trim()}
                    className="px-4 bg-[#CCFF00]"
                >
                    {isProcessing ? (
                        <Sparkles className="animate-spin" size={20} />
                    ) : (
                        <Send size={20} />
                    )}
                </BrutalButton>
            </div>

            <div className="text-[10px] font-mono text-gray-400 mt-1 flex justify-between">
                <span>Use /slang to yassify details</span>
                {isProcessing && <span className="text-purple-600 font-bold animate-pulse">Running Vibe Check...</span>}
            </div>
        </div>
    );
};

export default ChatInput;
