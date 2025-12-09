import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { THEME } from '../../theme';
import { UserListItem } from '../../types';

interface LeaderboardTabProps {
    users: UserListItem[];
}

const LeaderboardTab = ({ users }: LeaderboardTabProps) => {
    return (
        <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3 px-4"
        >
            <h3 className="font-black text-xl mb-4 uppercase italic flex items-center gap-2">
                <Crown size={20} /> Top Gs
            </h3>
            {users.map((u, idx) => (
                <div key={u.id} className={`flex items-center p-3 bg-white ${THEME.border} ${idx < 3 ? 'shadow-[4px_4px_0px_0px_#FFD700]' : ''}`}>
                    <span className={`font-black text-lg w-8 ${idx === 0 ? 'text-[#FFD700]' : ''}`}>#{idx + 1}</span>
                    <span className="text-2xl mr-3">{u.avatar}</span>
                    <div className="flex-1">
                        <p className="font-bold leading-none">{u.handle}</p>
                        <p className="text-xs font-mono text-gray-500">
                            {u.aura > 5000 ? 'CELESTIAL' : u.aura > 1000 ? 'MAIN CHARACTER' : u.aura < 0 ? 'COOKED' : 'NPC'}
                        </p>
                    </div>
                    <span className="font-black">{u.aura}</span>
                </div>
            ))}
        </motion.div>
    );
};

export default LeaderboardTab;
