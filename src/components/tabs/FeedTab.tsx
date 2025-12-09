import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { Transaction, UserListItem } from '../../types';
import FeedItem from '../FeedItem';

interface FeedTabProps {
    feed: Transaction[];
    users: UserListItem[];
}

const FeedTab = ({ feed, users }: FeedTabProps) => {
    return (
        <motion.div
            key="feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4"
        >
            <h3 className="font-black text-xl mb-4 uppercase italic flex items-center gap-2">
                <History size={20} /> Live Log
            </h3>
            {feed.length === 0 ? (
                <div className="text-center py-10 opacity-50 font-mono">No aura detected yet.</div>
            ) : (
                feed.map(item => <FeedItem key={item.id} item={item} users={users} />)
            )}
        </motion.div>
    );
};

export default FeedTab;
