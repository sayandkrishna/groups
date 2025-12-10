import { Crown, Settings } from 'lucide-react';
import { THEME } from '../theme';
import { User } from '../types';

interface HeaderProps {
    user: User;
    myRank: number;
    onSettingsClick: () => void;
}

const Header = ({ user, myRank, onSettingsClick }: HeaderProps) => {
    return (
        <header className="p-4 pt-6">
            <div className={`bg-white ${THEME.border} ${THEME.shadow} p-4 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Crown size={100} />
                </div>

                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <p className="font-mono text-xs text-gray-500 uppercase">Current Status</p>
                        <h1 className="text-4xl font-black mt-1 leading-none tracking-tighter font-neo">
                            {user.aura} <span className="text-lg">PTS</span>
                        </h1>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl">{user.avatar}</div>
                        <p className="font-bold text-sm mt-1">{user.handle}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-black flex justify-between items-center text-xs font-bold uppercase">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Rank: #{myRank}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                            ID: {user.uid.slice(0, 4)}
                        </div>
                    </div>

                    {/* Settings Button */}
                    <button
                        onClick={onSettingsClick}
                        className={`p-2 ${THEME.border} ${THEME.shadow} ${THEME.shadowActive} bg-white hover:bg-gray-100 transition-colors`}
                        aria-label="Settings"
                    >
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
