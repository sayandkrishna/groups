import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { User, ChatMessage, UserListItem } from '../types';
import { THEME } from '../theme';
import ChatInput from './ChatInput';
import { ArrowLeft } from 'lucide-react';

interface ChatInterfaceProps {
    currentUser: User;
    chatPartner?: UserListItem | null; // If null, it's public chat
    onBack?: () => void;
}

const ChatInterface = ({ currentUser, chatPartner, onBack }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const isPublic = !chatPartner;
    const chatId = isPublic
        ? 'public_chat'
        : [currentUser.uid, chatPartner.id].sort().join('_');

    const collectionPath = isPublic ? 'public_chat' : `chats/${chatId}/messages`;

    useEffect(() => {
        const q = query(
            collection(db, collectionPath),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsub = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
            setMessages(msgs.reverse());
        });

        return () => unsub();
    }, [chatId, collectionPath]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text: string, sentiment: 'roast' | 'glaze' | 'neutral') => {
        await addDoc(collection(db, collectionPath), {
            text,
            senderId: currentUser.uid,
            senderHandle: currentUser.handle,
            senderAvatar: currentUser.avatar,
            senderAura: currentUser.aura || 0,
            sentiment,
            type: 'user',
            createdAt: serverTimestamp()
        });
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Header */}
            <div className={`p-4 bg-white ${THEME.border} border-b-2 flex items-center justify-between sticky top-0 z-10`}>
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full border-2 border-black">
                            <ArrowLeft size={20} />
                        </button>
                    )}

                    <div className="text-3xl">
                        {isPublic ? '🌍' : chatPartner?.avatar}
                    </div>

                    <div>
                        <h2 className="font-black text-lg leading-none uppercase">
                            {isPublic ? 'THE VIBE' : `@${chatPartner?.handle}`}
                        </h2>
                        <p className="text-xs font-mono text-gray-500">
                            {isPublic ? 'Global Yap Session' : `Aura: ${chatPartner?.aura}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.uid;
                    const isSystem = msg.type === 'system';

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="text-center py-2">
                                <span className="bg-black text-white px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest">
                                    {msg.text}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {!isMe && (
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl">{msg.senderAvatar}</span>
                                    {isPublic && (
                                        <span className="text-[10px] font-mono font-bold bg-gray-200 px-1 border border-black mt-1">
                                            {msg.senderAura}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {isPublic && !isMe && (
                                    <span className="text-[10px] font-bold text-gray-500 mb-1 ml-1">
                                        @{msg.senderHandle}
                                    </span>
                                )}

                                <div
                                    className={`
                    p-3 border-2 border-black relative
                    ${isMe ? 'bg-[#CCFF00]' : 'bg-white'}
                    ${msg.sentiment === 'roast' ? 'shadow-[4px_4px_0px_0px_#FF0000] border-red-600' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
                    ${msg.sentiment === 'glaze' ? 'shadow-[4px_4px_0px_0px_#00FFFF] border-cyan-500' : ''}
                  `}
                                >
                                    <p className="font-bold text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>

                                {msg.sentiment === 'roast' && (
                                    <span className="text-[10px] font-black text-red-600 mt-1 uppercase animate-pulse">🔥 ROAST DETECTED</span>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <ChatInput
                onSend={handleSendMessage}
                userAura={currentUser.aura || 0}
            />
        </div>
    );
};

export default ChatInterface;
