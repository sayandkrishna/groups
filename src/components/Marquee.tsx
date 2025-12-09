import { motion } from 'framer-motion';
import { Zap, Skull } from 'lucide-react';

const Marquee = () => (
    <div className="bg-black text-white overflow-hidden py-2 border-b-2 border-black sticky top-0 z-50">
        <motion.div
            className="whitespace-nowrap font-mono font-bold text-sm flex gap-8"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
            {[...Array(10)].map((_, i) => (
                <span key={i} className="flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" />
                    WHO IS COOKED? // GROUPS CHECK // PROTECT YOUR ENERGY //
                    <Skull size={14} className="text-red-500" />
                </span>
            ))}
        </motion.div>
    </div>
);

export default Marquee;
