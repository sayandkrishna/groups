import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserMinus, Search, Check, X } from 'lucide-react';
import { THEME } from '../../theme';
import { UserListItem } from '../../types';
import BrutalButton from '../BrutalButton';

interface FriendsTabProps {
    myFriends: UserListItem[];
    usersList: UserListItem[];
    currentUserId: string;
    currentUserFriends: string[];
    incomingRequests: UserListItem[];
    sentRequests: string[];
    onSendFriendRequest: (targetId: string) => Promise<{ type: string; msg: string }>;
    onAcceptRequest: (fromUserId: string) => void;
    onDeclineRequest: (fromUserId: string) => void;
    onRemoveFriend: (friendId: string) => void;
    onOpenChat: (friend: UserListItem) => void;
}

const FriendsTab = ({
    myFriends,
    usersList,
    currentUserId,
    currentUserFriends,
    incomingRequests,
    sentRequests,
    onSendFriendRequest,
    onAcceptRequest,
    onDeclineRequest,
    onRemoveFriend,
    onOpenChat
}: FriendsTabProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserListItem[]>([]);
    const [feedback, setFeedback] = useState({ type: '', msg: '' });
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const results = usersList.filter(u =>
            u.id !== currentUserId &&
            u.handle?.toLowerCase().includes(query)
        );

        setSearchResults(results);
        setIsSearching(true);
    };

    const handleSendRequest = async (targetId: string) => {
        const result = await onSendFriendRequest(targetId);
        setFeedback(result);

        // Clear feedback after 3 seconds
        setTimeout(() => setFeedback({ type: '', msg: '' }), 3000);
    };

    const getRelationship = (userId: string): 'friend' | 'incoming' | 'sent' | 'none' => {
        if (currentUserFriends.includes(userId)) return 'friend';
        if (incomingRequests.some(u => u.id === userId)) return 'incoming';
        if (sentRequests.includes(userId)) return 'sent';
        return 'none';
    };

    return (
        <motion.div
            key="friends"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            {/* SEARCH SECTION */}
            <div className={`bg-[#CCFF00] p-4 ${THEME.border} ${THEME.shadow}`}>
                <h3 className="font-black text-sm uppercase mb-2 flex items-center gap-2">
                    <Search size={16} /> Find Friends
                </h3>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 font-bold text-gray-400">@</span>
                        <input
                            type="text"
                            placeholder="search codename"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className={`w-full p-2 pl-7 font-bold text-sm bg-white ${THEME.border} focus:outline-none`}
                        />
                    </div>
                    <BrutalButton onClick={handleSearch} className="px-4 py-2 text-xs">
                        Search
                    </BrutalButton>
                </div>

                {feedback.msg && (
                    <p className={`mt-2 text-xs font-mono font-bold ${feedback.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
                        {feedback.msg}
                    </p>
                )}
            </div>

            {/* SEARCH RESULTS */}
            {isSearching && (
                <div className="px-4">
                    <h3 className="font-black text-sm uppercase mb-2 flex items-center gap-2">
                        Search Results ({searchResults.length})
                    </h3>
                    {searchResults.length === 0 ? (
                        <div className="p-4 text-center border-2 border-dashed border-gray-400 opacity-50">
                            <p className="font-mono text-sm">No users found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {searchResults.map((u) => {
                                const rel = getRelationship(u.id);
                                return (
                                    <div key={u.id} className={`flex items-center p-3 bg-white ${THEME.border} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                                        <span className="text-2xl mr-3">{u.avatar}</span>
                                        <div className="flex-1">
                                            <p className="font-bold leading-none">@{u.handle}</p>
                                            <p className="text-xs font-mono text-gray-500">Aura: {u.aura}</p>
                                        </div>
                                        {rel === 'friend' && (
                                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 border border-green-600">
                                                Friends
                                            </span>
                                        )}
                                        {rel === 'sent' && (
                                            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 border border-orange-600">
                                                Pending
                                            </span>
                                        )}
                                        {rel === 'incoming' && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => onAcceptRequest(u.id)}
                                                    className="p-2 bg-green-500 text-white border-2 border-black"
                                                    title="Accept"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button
                                                    onClick={() => onDeclineRequest(u.id)}
                                                    className="p-2 bg-red-500 text-white border-2 border-black"
                                                    title="Decline"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                        {rel === 'none' && (
                                            <button
                                                onClick={() => handleSendRequest(u.id)}
                                                className="p-2 hover:bg-cyan-100 transition-colors border-2 border-black"
                                                title="Send Friend Request"
                                            >
                                                <UserPlus size={16} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <button
                        onClick={() => { setIsSearching(false); setSearchQuery(''); setSearchResults([]); }}
                        className="mt-2 text-sm font-bold underline"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* INCOMING REQUESTS */}
            {incomingRequests.length > 0 && (
                <div className="px-4">
                    <h3 className="font-black text-xl mb-4 uppercase italic flex items-center gap-2">
                        <UserPlus size={20} /> Friend Requests ({incomingRequests.length})
                    </h3>
                    <div className="space-y-2">
                        {incomingRequests.map((u) => (
                            <div key={u.id} className={`flex items-center p-3 bg-cyan-100 ${THEME.border} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                                <span className="text-2xl mr-3">{u.avatar}</span>
                                <div className="flex-1">
                                    <p className="font-bold leading-none">@{u.handle}</p>
                                    <p className="text-xs font-mono text-gray-500">wants to be friends</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onAcceptRequest(u.id)}
                                        className="p-2 bg-green-500 text-white border-2 border-black font-bold"
                                        title="Accept"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDeclineRequest(u.id)}
                                        className="p-2 bg-red-500 text-white border-2 border-black"
                                        title="Decline"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FRIENDS LIST */}
            <div className="px-4">
                <h3 className="font-black text-xl mb-4 uppercase italic flex items-center gap-2">
                    <Users size={20} /> The Crew ({myFriends.length})
                </h3>

                {myFriends.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-gray-400 opacity-50">
                        <p className="font-mono text-sm">No day ones found.</p>
                        <p className="font-mono text-xs mt-1">Search for friends by their codename above.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myFriends.map((u) => (
                            <div
                                key={u.id}
                                onClick={() => onOpenChat(u)}
                                className={`flex items-center p-3 bg-white ${THEME.border} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-purple-50 transition-colors`}
                            >
                                <span className="text-2xl mr-3">{u.avatar}</span>
                                <div className="flex-1">
                                    <p className="font-bold leading-none">@{u.handle}</p>
                                    <p className="text-xs font-mono text-gray-500">Aura: {u.aura}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-xs font-bold uppercase bg-purple-100 text-purple-600 px-2 py-1 border border-purple-600">Chat</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRemoveFriend(u.id); }}
                                        className="p-2 hover:bg-red-100 transition-colors"
                                        title="Remove Friend"
                                    >
                                        <UserMinus size={16} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default FriendsTab;
