import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { THEME } from '../theme';
import { Transaction, UserListItem } from '../types';

interface FeedItemProps {
    item: Transaction;
    users: UserListItem[];
}

const FeedItem = ({ item, users }: FeedItemProps) => {
    const sender = users.find(u => u.id === item.senderId)?.handle || 'Unknown';
    const receiver = users.find(u => u.id === item.receiverId)?.handle || 'Unknown';
    const isPositive = item.amount > 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 mb-3 bg-white ${THEME.border} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex gap-3`}
        >
            <div className={`shrink-0 w-10 h-10 ${THEME.border} flex items-center justify-center ${isPositive ? 'bg-cyan-300' : 'bg-red-400'}`}>
                {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-sm truncate">
                        {receiver} <span className="text-gray-500 font-normal text-xs">was {isPositive ? 'glazed' : 'roasted'} by</span> {sender}
                    </p>
                    <span className={`font-black text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                    </span>
                </div>
                <p className="text-xs font-mono text-gray-600 mt-1 break-words">"{item.reason}"</p>
            </div>
        </motion.div>
    );
};

export default FeedItem;
