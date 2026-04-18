import { motion } from 'motion/react';

interface AnimatedCatProps {
  mood?: 'happy' | 'normal' | 'sad';
  size?: number;
  className?: string;
}

export function AnimatedCat({ mood = 'normal', size = 200, className = '' }: AnimatedCatProps) {
  const getAnimation = () => {
    switch (mood) {
      case 'happy':
        return {
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        };
      case 'sad':
        return {
          y: [0, 5, 0],
          rotate: [0, -2, 2, 0],
        };
      default:
        return {
          y: [0, -8, 0],
          rotate: [0, 3, -3, 0],
        };
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{
        duration: mood === 'happy' ? 2 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/src/imports/image.png"
        alt="小猫"
        className="w-full h-full object-contain"
        style={{
          filter: mood === 'sad' ? 'grayscale(20%) brightness(0.95)' : 'none',
        }}
      />
      {mood === 'happy' && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute -top-2 -right-2 text-2xl"
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  );
}
