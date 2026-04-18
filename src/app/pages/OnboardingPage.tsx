import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import openingBgWebm from '../../assets/webm/粉色开场gif.webm';
import appearCatGif from '../../assets/gifs/出现小猫.GIF';

const storySteps = [
  {
    title: "遇见你的专属伙伴",
    text: "在一个温暖的午后",
    subtext: "一只可爱的小猫正在等待着你",
    emoji: "🐱",
  },
  {
    title: "特别的陪伴",
    text: "这是一只神奇的小猫",
    subtext: "它的健康与你的自律紧密相连",
    emoji: "✨",
  },
  {
    title: "双向奔赴",
    text: "你越健康，它越快乐",
    subtext: "一起见证更好的自己",
    emoji: "💝",
  },
  {
    title: "开始旅程",
    text: "准备好了吗？",
    subtext: "让我们一起开启这段美好的陪伴",
    emoji: "🌟",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentStep < storySteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/adoption-form');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <video
        src={openingBgWebm}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-white/20" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-[#FF9B8A]/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#FFCAB0]/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Cat Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <img
              src={appearCatGif}
              alt="小猫咪"
              className="w-64 h-64 object-contain drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Story Cards - Swipeable */}
        <div className="relative min-h-[320px] mb-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-[#FF9B8A]/20">
                {/* Emoji Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl text-center mb-6"
                >
                  {storySteps[currentStep].emoji}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-center mb-4 text-[#FF7B5F]"
                >
                  {storySteps[currentStep].title}
                </motion.h2>

                {/* Text */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-800 text-center mb-3 leading-relaxed"
                >
                  {storySteps[currentStep].text}
                </motion.p>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-base text-gray-600 text-center italic"
                >
                  {storySteps[currentStep].subtext}
                </motion.p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {storySteps.map((_, index) => (
                    <motion.div
                      key={index}
                      onClick={() => {
                        setDirection(index > currentStep ? 1 : -1);
                        setCurrentStep(index);
                      }}
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        index === currentStep
                          ? 'bg-[#FF7B5F] w-8'
                          : 'bg-gray-300 w-2'
                      }`}
                      animate={{
                        scale: index === currentStep ? 1.2 : 1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button
              onClick={handlePrev}
              variant="outline"
              className="flex-1 border-2 border-[#FF9B8A] text-[#FF7B5F] hover:bg-[#FFE5E0]"
            >
              <ChevronLeft className="mr-2 w-4 h-4" />
              上一步
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={`bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] hover:from-[#FF8A77] hover:to-[#FF6A4D] text-white shadow-lg ${
              currentStep === 0 ? 'w-full' : 'flex-1'
            }`}
          >
            {currentStep < storySteps.length - 1 ? (
              <>
                下一步
                <ChevronRight className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                <Heart className="mr-2 w-5 h-5" fill="currentColor" />
                开始领养
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
