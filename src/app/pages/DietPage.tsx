import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Plus, Utensils, Coffee, Moon, TrendingDown, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { CatHeader } from '../components/CatHeader';

interface MealRecord {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  time: string;
  description: string;
}

const MEAL_HISTORY_KEY = 'mealHistory';
const DAILY_CALORIES_KEY = 'dailyDietCalories';
const WEEKLY_WEIGHT_LOSS_KEY = 'weeklyWeightLoss';

const mealTypes = [
  { id: 'breakfast', name: '早餐', icon: Coffee, color: 'from-yellow-400 to-orange-500' },
  { id: 'lunch', name: '午餐', icon: Utensils, color: 'from-green-400 to-emerald-500' },
  { id: 'dinner', name: '晚餐', icon: Moon, color: 'from-blue-400 to-purple-500' },
  { id: 'snack', name: '加餐', icon: Coffee, color: 'from-pink-400 to-rose-500' },
];

export default function DietPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({
    type: 'breakfast',
    calories: '',
    description: '',
    photo: null as File | null,
  });
  const [dailyCalories, setDailyCalories] = useState(() => {
    const saved = localStorage.getItem(DAILY_CALORIES_KEY);
    return { consumed: saved ? Number(saved) : 0, target: 1500 };
  });
  const [fastingMode, setFastingMode] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(() => !!localStorage.getItem(DAILY_CALORIES_KEY));
  const [weeklyWeightLoss, setWeeklyWeightLoss] = useState(() => localStorage.getItem(WEEKLY_WEIGHT_LOSS_KEY) || '0');

  const [mealHistory, setMealHistory] = useState<MealRecord[]>(() => {
    const saved = localStorage.getItem(MEAL_HISTORY_KEY);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const uniqueDays = new Set(
    mealHistory.map((meal) => {
      const dateText = meal.id.includes('-') ? meal.id.slice(0, 10) : new Date().toISOString().slice(0, 10);
      return dateText;
    })
  ).size;
  const weeklyAverage = uniqueDays > 0 ? Math.round(mealHistory.reduce((sum, meal) => sum + meal.calories, 0) / uniqueDays) : 0;

  const handleAddMeal = () => {
    if (newMeal.calories && newMeal.description) {
      const calories = Number(newMeal.calories);
      const record: MealRecord = {
        id: `${new Date().toISOString().slice(0, 10)}-${Date.now()}`,
        type: newMeal.type as MealRecord['type'],
        calories,
        time: new Date().toTimeString().slice(0, 5),
        description: newMeal.description,
      };
      const nextHistory = [record, ...mealHistory];
      const nextConsumed = dailyCalories.consumed + calories;

      setMealHistory(nextHistory);
      setDailyCalories({ ...dailyCalories, consumed: nextConsumed });
      setHasLoggedToday(true);
      localStorage.setItem(MEAL_HISTORY_KEY, JSON.stringify(nextHistory));
      localStorage.setItem(DAILY_CALORIES_KEY, String(nextConsumed));
      setIsDialogOpen(false);
      setNewMeal({ type: 'breakfast', calories: '', description: '', photo: null });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewMeal({ ...newMeal, photo: e.target.files[0] });
    }
  };

  const getMealIcon = (type: string) => {
    const meal = mealTypes.find((m) => m.id === type);
    return meal ? meal : mealTypes[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] p-6 pt-8 max-w-md mx-auto relative">
      {/* Cat Header */}
      <CatHeader isHappy={hasLoggedToday} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-1">饮食记录 🐾</h1>
        <p className="text-gray-600">健康饮食，科学管理</p>
      </motion.div>

      {/* Daily Calories Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] text-white p-6 mb-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">今日摄入</p>
              <p className="text-4xl font-bold">{dailyCalories.consumed}</p>
              <p className="text-white/90 text-sm">/ {dailyCalories.target} 千卡</p>
            </div>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TrendingDown className="w-16 h-16" />
            </motion.div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(dailyCalories.consumed / dailyCalories.target) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </Card>
      </motion.div>

      {/* Fasting Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 mb-6 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">轻断食模式</p>
                <p className="text-xs text-gray-600">16:8 间歇性断食</p>
              </div>
            </div>
            <button
              onClick={() => setFastingMode(!fastingMode)}
              className={`w-12 h-6 rounded-full transition-all ${
                fastingMode ? 'bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: fastingMode ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
          {fastingMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600">
                进食时间：12:00 - 20:00
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Add Meal Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] hover:from-[#FF8A77] hover:to-[#FF6A4D] text-white shadow-lg">
              <Plus className="mr-2 w-5 h-5" />
              添加餐食记录
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#FF7B5F]">
                记录今日餐食
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>拍照上传</Label>
                <div className="border-2 border-dashed border-[#FF9B8A]/50 rounded-lg p-6 text-center hover:border-[#FF7B5F] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    {newMeal.photo ? (
                      <div className="flex items-center justify-center gap-2 text-[#FF7B5F]">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm">{newMeal.photo.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Camera className="w-8 h-8" />
                        <p className="text-sm">点击拍照或上传照片</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>餐食类型</Label>
                <div className="grid grid-cols-2 gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setNewMeal({ ...newMeal, type: type.id as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newMeal.type === type.id
                          ? 'border-[#FF7B5F] bg-[#FFE5E0]'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <type.icon className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-sm font-medium">{type.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">热量 (千卡)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="300"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  className="border-[#FF9B8A]/50 focus:border-[#FF7B5F]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">餐食描述</Label>
                <Input
                  id="description"
                  placeholder="例：鸡胸肉沙拉 + 全麦面包"
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                  className="border-[#FF9B8A]/50 focus:border-[#FF7B5F]"
                />
              </div>

              <Button
                onClick={handleAddMeal}
                className="w-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]"
              >
                <Camera className="mr-2 w-4 h-4" />
                保存记录
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Meal History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">今日餐食</h3>
        {mealHistory.length === 0 ? (
          <Card className="p-6 bg-white/80 backdrop-blur-lg border border-purple-100 text-center text-gray-600">
            你还没有开始记录哦
          </Card>
        ) : (
          <div className="space-y-3">
            {mealHistory.map((meal, index) => {
              const mealType = getMealIcon(meal.type);
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="p-4 bg-white/80 backdrop-blur-lg border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${mealType.color} flex items-center justify-center`}>
                        <mealType.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800">{mealType.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {meal.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{meal.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">{meal.calories}</p>
                        <p className="text-xs text-gray-500">千卡</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">本周统计</h3>
        <Card className="p-6 bg-white/80 backdrop-blur-lg border border-purple-100">
          <div className="mb-4">
            <Label htmlFor="weeklyWeightLoss" className="text-gray-700 mb-2 block">本周减重(斤)</Label>
            <Input
              id="weeklyWeightLoss"
              type="number"
              step="0.1"
              value={weeklyWeightLoss}
              onChange={(e) => {
                setWeeklyWeightLoss(e.target.value);
                localStorage.setItem(WEEKLY_WEIGHT_LOSS_KEY, e.target.value);
              }}
              className="border-[#FF9B8A]/50 focus:border-[#FF7B5F]"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">{weeklyAverage}</p>
              <p className="text-xs text-gray-600 mt-1">平均摄入</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{weeklyWeightLoss || '0'}</p>
              <p className="text-xs text-gray-600 mt-1">减重(斤)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{uniqueDays}</p>
              <p className="text-xs text-gray-600 mt-1">记录天数</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
