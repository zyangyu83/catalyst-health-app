import { motion } from 'motion/react';
import whipCatWebm from '../../assets/webm/猫甩鞭.webm';

interface CatHeaderProps {
  isHappy?: boolean;
}

export function CatHeader({ isHappy = true }: CatHeaderProps) {
  return (
    <div className="absolute top-0 right-6 z-10">
      <div className="relative">
        <video
          src={whipCatWebm}
          autoPlay
          loop
          muted
          playsInline
          className="w-20 h-20 object-contain"
          style={{
            filter: isHappy ? 'none' : 'grayscale(30%)',
          }}
        />
        {!isHappy && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-white/90 px-2 py-1 rounded-full shadow-sm"
          >
            😿
          </motion.div>
        )}
      </div>
    </div>
  );
}
