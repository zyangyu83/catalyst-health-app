import { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, TrendingUp, Calendar, Award } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { CatHeader } from '../components/CatHeader';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import angryCatWebm from '../../assets/webm/猫生气.webm';

interface ExerciseRecord {
  date: string;
  type: string;
  duration: number;
  calories: number;
}

const EXERCISE_HISTORY_KEY = 'exerciseHistory';
const EXERCISE_STREAK_KEY = 'checkInStreak';

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [streak] = useState<number>(() => {
    const saved = localStorage.getItem(EXERCISE_STREAK_KEY);
    return saved ? Number(saved) : 0;
  });
  const [exerciseHistory] = useState<ExerciseRecord[]>(() => {
    const saved = localStorage.getItem(EXERCISE_HISTORY_KEY);
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const targetDailyMinutes = 30;
  const recentRecords = useMemo(() => exerciseHistory.slice(0, 7), [exerciseHistory]);

  const status = useMemo(() => {
    const activeDays = recentRecords.length;
    const totalMinutes = recentRecords.reduce((sum, item) => sum + item.duration, 0);
    const avgDailyMinutes = activeDays > 0 ? totalMinutes / activeDays : 0;
    const exerciseRate = Math.min(1, avgDailyMinutes / targetDailyMinutes);
    const continuityFactor = Math.min(1, streak / 7);

    const health = clamp((exerciseRate * 0.6 + continuityFactor * 0.4) * 100);

    const weights = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];
    const recentActivityScore = recentRecords.reduce((sum, item, idx) => {
      const ratio = Math.min(1.2, item.duration / targetDailyMinutes);
      return sum + ratio * (weights[idx] || 0.4);
    }, 0);
    const vitality = clamp((recentActivityScore / weights.reduce((a, b) => a + b, 0)) * 100);

    const previousWindow = exerciseHistory.slice(7, 14);
    const prevAvg =
      previousWindow.length > 0
        ? previousWindow.reduce((sum, item) => sum + item.duration, 0) / previousWindow.length
        : 0;
    const baseProgress = prevAvg > 0 ? ((avgDailyMinutes - prevAvg) / prevAvg) * 50 + 50 : 50;
    const milestoneBonus = totalMinutes >= 180 ? 20 : totalMinutes >= 120 ? 12 : totalMinutes >= 90 ? 8 : 0;
    const streakBonus = Math.min(20, streak * 2);
    const growth = clamp(baseProgress + milestoneBonus + streakBonus);

    return {
      health,
      vitality,
      growth,
      breakdown: {
        exerciseRate,
        continuityFactor,
        recentActivityScore,
        baseProgress,
        milestoneBonus,
        streakBonus,
      },
    };
  }, [recentRecords, exerciseHistory, streak]);

  const getCatMood = (): 'happy' | 'normal' | 'sad' => {
    const avgStatus = (status.health + status.vitality) / 2;
    if (avgStatus > 80) return 'happy';
    if (avgStatus > 40) return 'normal';
    return 'sad';
  };

  const mood = getCatMood();
  const recordData = useMemo(() => {
    const hasAnyRecord = exerciseHistory.length > 0;
    if (!hasAnyRecord) {
      return [
        { day: '今天', growth: 0, color: 'from-[#FF9B8A] to-[#FF7B5F]' },
        { day: '昨天', growth: 0, color: 'from-[#FFCAB0] to-[#FF9B8A]' },
        { day: '前天', growth: 0, color: 'from-[#FFE5E0] to-[#FFCAB0]' },
        { day: '3天前', growth: 0, color: 'from-orange-200 to-[#FFE5E0]' },
      ];
    }

    const recent = exerciseHistory.slice(0, 4);
    const labels = ['今天', '昨天', '前天', '3天前'];
    return labels.map((label, idx) => ({
      day: label,
      growth: recent[idx] ? Math.min(10, Math.round(recent[idx].duration / 6)) : 0,
      color: idx === 0 ? 'from-[#FF9B8A] to-[#FF7B5F]' : idx === 1 ? 'from-[#FFCAB0] to-[#FF9B8A]' : idx === 2 ? 'from-[#FFE5E0] to-[#FFCAB0]' : 'from-orange-200 to-[#FFE5E0]',
    }));
  }, [exerciseHistory]);

  const healthLineData = useMemo(() => {
    const dayMap = new Map<string, number>();
    exerciseHistory.forEach((item) => {
      dayMap.set(item.date, (dayMap.get(item.date) || 0) + item.duration);
    });

    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const key = d.toISOString().slice(0, 10);
      const minutes = dayMap.get(key) || 0;
      const dayHealth = clamp(Math.min(1, minutes / targetDailyMinutes) * 100);
      return { day: `${d.getMonth() + 1}/${d.getDate()}`, health: dayHealth };
    });
  }, [exerciseHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] p-6 pt-8 max-w-md mx-auto relative">
      <CatHeader isHappy={streak > 0} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          你好，{user?.username || '朋友'} 👋
        </h1>
        <p className="text-gray-600">你的小猫今天很{mood === 'happy' ? '开心' : mood === 'normal' ? '愉快' : '需要关爱'} 🐱</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] text-white p-6 mb-6 border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">当前连胜</p>
              <p className="text-4xl font-bold">{streak} 天</p>
            </div>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Award className="w-16 h-16" />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card className="p-6 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20">
          <div className="flex justify-center mb-6">
            <motion.video
              src={angryCatWebm}
              autoPlay
              loop
              muted
              playsInline
              aria-label="猫生气"
              className="w-[220px] h-[220px] object-contain"
              animate={{
                y: [0, -8, 0],
                rotate: [0, -3, 2, 0],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">你的小猫</h3>
            <p className="text-gray-600">你陪伴 {streak} 天了 🐾</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#FF7B5F]" />
                  <span className="text-sm text-gray-700">健康值</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{status.health}%</span>
              </div>
              <Progress value={status.health} className="h-2" />
              <p className="mt-1 text-xs text-gray-500">
                (运动达标率 {Math.round(status.breakdown.exerciseRate * 100)}% x 0.6 + 连续系数 {Math.round(status.breakdown.continuityFactor * 100)}% x 0.4) x 100
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FF9B8A]" />
                  <span className="text-sm text-gray-700">活力值</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{status.vitality}%</span>
              </div>
              <Progress value={status.vitality} className="h-2" />
              <p className="mt-1 text-xs text-gray-500">
                最近7天加权运动分 {status.breakdown.recentActivityScore.toFixed(2)}，按目标时长与衰减权重计算
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FFCAB0]" />
                  <span className="text-sm text-gray-700">成长值</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{status.growth}%</span>
              </div>
              <Progress value={status.growth} className="h-2" />
              <p className="mt-1 text-xs text-gray-500">
                基础进步分 {Math.round(status.breakdown.baseProgress)} + 里程碑奖励 {status.breakdown.milestoneBonus} + 连胜加成 {status.breakdown.streakBonus}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">每日成长记录</h3>
        <Card className="p-6 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20">
          <div className="space-y-3">
            {recordData.map((record, index) => (
              <motion.div
                key={record.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-sm text-gray-600 w-12">{record.day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(record.growth / 10) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r ${record.color} flex items-center justify-end px-3`}
                  >
                    <span className="text-xs font-semibold text-white">+{record.growth}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">7天健康值趋势</h3>
        <Card className="p-4 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5d6cf" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="health" stroke="#FF7B5F" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
