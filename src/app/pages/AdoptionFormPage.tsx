import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Target, TrendingDown, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';

const goalOptions = [
  {
    id: 'gain',
    title: '我要增重',
    action: '增重',
    icon: Target,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'lose',
    title: '我要减重',
    action: '减重',
    icon: TrendingDown,
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'maintain',
    title: '维持现状',
    action: '保持',
    icon: Calendar,
    color: 'from-orange-400 to-red-500',
  },
] as const;

type GoalId = (typeof goalOptions)[number]['id'];

export default function AdoptionFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    goal: '' as GoalId | '',
  });
  const [goalTargets, setGoalTargets] = useState<Record<GoalId, { days: string; kg: string }>>({
    gain: { days: '', kg: '' },
    lose: { days: '', kg: '' },
    maintain: { days: '', kg: '' },
  });

  const selectedTarget = formData.goal ? goalTargets[formData.goal] : { days: '', kg: '' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.height || !formData.weight || !formData.goal) return;
    if (!selectedTarget.days || !selectedTarget.kg) return;

    const selectedGoal = goalOptions.find((item) => item.id === formData.goal);
    const goalText = `${selectedTarget.days}天${selectedGoal?.action}${selectedTarget.kg}kg`;
    localStorage.setItem(
      'userProfile',
      JSON.stringify({
        ...formData,
        goalDays: selectedTarget.days,
        goalKg: selectedTarget.kg,
        goalText,
      })
    );
    navigate('/adoption-agreement');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-[#FF9B8A]/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-[#FF7B5F] mb-2">
              领养档案登记 🐱
            </h1>
            <p className="text-gray-600">
              让我们了解一下你，为你和小猫制定专属计划
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="height" className="text-gray-700">身高 (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="165"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  required
                  className="border-[#FF9B8A]/50 focus:border-[#FF7B5F] focus:ring-[#FF7B5F]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-gray-700">体重 (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="60"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                  className="border-[#FF9B8A]/50 focus:border-[#FF7B5F] focus:ring-[#FF7B5F]"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Label className="text-gray-700 text-lg">选择你的抚养计划</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {goalOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      onClick={() => setFormData({ ...formData, goal: option.id })}
                      className={`p-5 cursor-pointer transition-all ${
                        formData.goal === option.id
                          ? 'ring-2 ring-[#FF7B5F] shadow-xl bg-[#FFE5E0]'
                          : 'hover:shadow-lg'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mb-4`}>
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                      <div className="flex flex-nowrap items-center gap-1 text-xs text-gray-600 whitespace-nowrap overflow-x-auto">
                        <Input
                          placeholder="30"
                          type="number"
                          value={goalTargets[option.id].days}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setGoalTargets({
                              ...goalTargets,
                              [option.id]: { ...goalTargets[option.id], days: e.target.value },
                            })
                          }
                          className="h-8 w-14 min-w-0 px-2 text-xs border-[#FF9B8A]/50"
                        />
                        <span className="shrink-0">天{option.action}</span>
                        <Input
                          placeholder="2"
                          type="number"
                          step="0.1"
                          value={goalTargets[option.id].kg}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setGoalTargets({
                              ...goalTargets,
                              [option.id]: { ...goalTargets[option.id], kg: e.target.value },
                            })
                          }
                          className="h-8 w-14 min-w-0 px-2 text-xs border-[#FF9B8A]/50"
                        />
                        <span className="shrink-0">kg</span>
                      </div>
                      <div
                        className={`mt-4 w-full h-1 rounded-full bg-gradient-to-r ${option.color} ${
                          formData.goal === option.id ? 'opacity-100' : 'opacity-0'
                        } transition-opacity`}
                      />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                disabled={!formData.height || !formData.weight || !formData.goal || !selectedTarget.days || !selectedTarget.kg}
                className="w-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] hover:from-[#FF8A77] hover:to-[#FF6A4D] text-white shadow-lg py-6 text-lg disabled:opacity-50"
              >
                确认信息，继续
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
