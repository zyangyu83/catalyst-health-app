import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email) {
      [
        'exerciseHistory',
        'checkInStreak',
        'dailyExerciseMinutes',
        'mealHistory',
        'dailyDietCalories',
        'weeklyWeightLoss',
        'userProfile',
        'adoptionComplete',
        'catAdoptedDate',
      ].forEach((key) => localStorage.removeItem(key));
      localStorage.setItem('user', JSON.stringify({ username, email }));
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-[#FF9B8A]/20">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center mb-4"
            >
              <img
                src="/src/imports/image.png"
                alt="Catalyst Logo"
                className="w-32 h-32 object-contain"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-[#FF7B5F] mb-2"
            >
              Catalyst
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#FF9B8A]" />
              开启你的健康陪伴之旅
              <Sparkles className="w-4 h-4 text-[#FF9B8A]" />
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="输入你的名字"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-[#FF9B8A]/50 focus:border-[#FF7B5F] focus:ring-[#FF7B5F]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#FF9B8A]/50 focus:border-[#FF7B5F] focus:ring-[#FF7B5F]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] hover:from-[#FF8A77] hover:to-[#FF6A4D] text-white shadow-lg"
            >
              开始旅程
            </Button>
          </motion.form>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            与你的专属小猫一起变得更好 ✨
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
