

export type TabType = 'feed' | 'leaderboard' | 'friends' | 'chat';

interface TabsProps {
    currentTab: TabType;
    setCurrentTab: (tab: TabType) => void;
}

const Tabs = ({ currentTab, setCurrentTab }: TabsProps) => {
    return (
        <div className="px-4 flex gap-2 overflow-x-auto pb-2">
            <button
                onClick={() => setCurrentTab('feed')}
                className={`flex-1 py-2 font-bold text-xs sm:text-sm uppercase border-2 border-black whitespace-nowrap transition-all ${currentTab === 'feed' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
                Feed
            </button>
            <button
                onClick={() => setCurrentTab('leaderboard')}
                className={`flex-1 py-2 font-bold text-xs sm:text-sm uppercase border-2 border-black whitespace-nowrap transition-all ${currentTab === 'leaderboard' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
                Ranking
            </button>
            <button
                onClick={() => setCurrentTab('friends')}
                className={`flex-1 py-2 font-bold text-xs sm:text-sm uppercase border-2 border-black whitespace-nowrap transition-all ${currentTab === 'friends' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
                Day Ones
            </button>
        </div>
    );
};

export default Tabs;
