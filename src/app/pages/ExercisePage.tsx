import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, TrendingUp, Clock, Flame, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CatHeader } from '../components/CatHeader';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface ExerciseRecord {
  date: string;
  type: string;
  duration: number;
  calories: number;
}

const EXERCISE_HISTORY_KEY = 'exerciseHistory';
const EXERCISE_STREAK_KEY = 'checkInStreak';
const DAILY_EXERCISE_KEY = 'dailyExerciseMinutes';

const exerciseTypes = [
  { id: 'yoga', name: '瑜伽', icon: '🧘‍♀️', calories: 40, display: '预估40kcal/30min' },
  { id: 'running', name: '跑步', icon: '🏃‍♀️', calories: 340, display: '预估340kcal/30min' },
  { id: 'walking', name: '散步', icon: '🚶‍♀️', calories: 140, display: '预估140kcal/30min' },
  { id: 'dancing', name: '跳舞', icon: '💃', calories: 180, display: '预估180kcal/30min' },
  { id: 'swimming', name: '游泳', icon: '🏊‍♀️', calories: 260, display: '预估260kcal/30min' },
  { id: 'custom', name: '自定义', icon: '✨', calories: 0, display: '0卡' },
];

export default function ExercisePage() {
  const [checkedToday, setCheckedToday] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState('30');
  const [customTypeName, setCustomTypeName] = useState('');
  const [customCalories, setCustomCalories] = useState('');

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem(EXERCISE_STREAK_KEY);
    return saved ? Number(saved) : 0;
  });
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 5 });

  const [exerciseHistory, setExerciseHistory] = useState<ExerciseRecord[]>(() => {
    const saved = localStorage.getItem(EXERCISE_HISTORY_KEY);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const weeklyStats = useMemo(() => {
    return exerciseHistory.slice(0, 7).reduce(
      (acc, record) => {
        acc.minutes += record.duration;
        acc.calories += record.calories;
        return acc;
      },
      { minutes: 0, calories: 0 }
    );
  }, [exerciseHistory]);

  const handleCheckIn = () => {
    if (!selectedType || !duration) return;

    if (selectedType === 'custom' && (!customTypeName || !customCalories)) return;

    const parsedDuration = Number(duration);
    const now = new Date();
    const typeConfig = exerciseTypes.find((item) => item.id === selectedType);
    const displayType = selectedType === 'custom' ? customTypeName : typeConfig?.name || '自定义';
    const calories =
      selectedType === 'custom' ? Number(customCalories) : Number(typeConfig?.calories || 0);
    const newRecord: ExerciseRecord = {
      date: now.toISOString().slice(0, 10),
      type: displayType,
      duration: parsedDuration,
      calories,
    };

    const nextHistory = [newRecord, ...exerciseHistory];
    const nextStreak = streak + 1;

    setCheckedToday(true);
    setStreak(nextStreak);
    setWeeklyGoal({ ...weeklyGoal, current: Math.min(weeklyGoal.target, weeklyGoal.current + 1) });
    setExerciseHistory(nextHistory);
    localStorage.setItem(EXERCISE_HISTORY_KEY, JSON.stringify(nextHistory));
    localStorage.setItem(EXERCISE_STREAK_KEY, String(nextStreak));
    localStorage.setItem(DAILY_EXERCISE_KEY, String(parsedDuration));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] p-6 pt-8 max-w-md mx-auto relative">
      {/* Cat Header */}
      <CatHeader isHappy={checkedToday} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-1">运动打卡 🐾</h1>
        <p className="text-gray-600">坚持运动，让小猫更健康</p>
      </motion.div>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] text-white p-6 mb-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">连续打卡</p>
              <p className="text-4xl font-bold">{streak} 天</p>
            </div>
            <motion.div
              animate={{
                x: [0, -6, 6, -4, 0],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TrendingUp className="w-16 h-16" />
            </motion.div>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Calendar className="w-4 h-4" />
            <span>本周目标：{weeklyGoal.current}/{weeklyGoal.target} 次</span>
          </div>
        </Card>
      </motion.div>

      {/* Today's Check-in */}
      {!checkedToday ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-6 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">今日运动</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {exerciseTypes.map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-[#FF7B5F] bg-[#FFE5E0]'
                      : 'border-gray-200 bg-white hover:border-[#FF9B8A]'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{type.name}</div>
                  <div className="text-xs text-gray-500">{type.display}</div>
                </motion.button>
              ))}
            </div>

            {selectedType === 'custom' && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <Label htmlFor="customName" className="text-gray-700 mb-2 block">自定义项目名</Label>
                  <Input
                    id="customName"
                    placeholder="例如：跳绳"
                    value={customTypeName}
                    onChange={(e) => setCustomTypeName(e.target.value)}
                    className="border-[#FF9B8A]/50 focus:border-[#FF7B5F]"
                  />
                </div>
                <div>
                  <Label htmlFor="customCalories" className="text-gray-700 mb-2 block">预计消耗(千卡)</Label>
                  <Input
                    id="customCalories"
                    type="number"
                    placeholder="180"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="border-[#FF9B8A]/50 focus:border-[#FF7B5F]"
                    min="1"
                  />
                </div>
              </div>
            )}

            {/* Duration Input */}
            <div className="mb-6">
              <Label htmlFor="duration" className="text-gray-700 mb-2 block">运动时长（分钟）</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border-[#FF9B8A]/50 focus:border-[#FF7B5F] focus:ring-[#FF7B5F]"
                min="1"
              />
            </div>

            <Button
              onClick={handleCheckIn}
              disabled={
                !selectedType ||
                !duration ||
                (selectedType === 'custom' && (!customTypeName || !customCalories))
              }
              className="w-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] hover:from-[#FF8A77] hover:to-[#FF6A4D] text-white disabled:opacity-50"
            >
              <CheckCircle className="mr-2 w-5 h-5" />
              完成打卡
            </Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg">
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.5, 1],
                }}
                className="text-6xl mb-3"
              >
                ✅
              </motion.div>
              <h3 className="text-xl font-bold mb-2">今日已打卡！</h3>
              <p className="text-white/90">你的小猫获得了 +5 成长值 🐱✨</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Weekly Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">本周统计</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">总消耗</p>
                <p className="text-xl font-bold text-gray-800">{weeklyStats.calories}</p>
                <p className="text-xs text-gray-500">千卡</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">总时长</p>
                <p className="text-xl font-bold text-gray-800">{weeklyStats.minutes}</p>
                <p className="text-xs text-gray-500">分钟</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Exercise History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">运动记录</h3>
        {exerciseHistory.length === 0 ? (
          <Card className="p-6 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20 text-center text-gray-600">
            你还没有开始记录哦
          </Card>
        ) : (
          <div className="space-y-3">
            {exerciseHistory.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-4 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] flex items-center justify-center text-white font-semibold">
                        {record.type.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{record.type}</p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {record.duration} 分钟
                      </Badge>
                      <p className="text-xs text-gray-600">{record.calories} 千卡</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
