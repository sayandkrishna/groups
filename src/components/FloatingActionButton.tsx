import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
    onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClick}
                className="pointer-events-auto bg-[#CCFF00] text-black border-2 border-black w-16 h-16 flex items-center justify-center rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
                <Plus size={32} strokeWidth={3} />
            </motion.button>
        </div>
    );
};

export default FloatingActionButton;
