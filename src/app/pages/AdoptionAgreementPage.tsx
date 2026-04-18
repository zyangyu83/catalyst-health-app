import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import newCatWebm from '../../assets/webm/刚领养小猫.webm';

export default function AdoptionAgreementPage() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [showAdoptionPopup, setShowAdoptionPopup] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    setTimeout(() => setShowCat(true), 500);
    const popupTimer = setTimeout(() => setShowAdoptionPopup(false), 2200);

    return () => {
      clearTimeout(popupTimer);
    };
  }, []);

  const handleAdopt = () => {
    if (agreed) {
      localStorage.setItem('adoptionComplete', 'true');
      localStorage.setItem('catAdoptedDate', new Date().toISOString());
      navigate('/app');
    }
  };

  const getGoalText = (goalId: string) => {
    if (profile?.goalText) return profile.goalText;
    const goals: Record<string, string> = {
      gain: '30天增重2kg',
      lose: '30天减重2kg',
      maintain: '30天保持0kg',
    };
    return goals[goalId] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] flex items-center justify-center p-6">
      <AnimatePresence>
        {showAdoptionPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 16 }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center"
            >
              <video
                src={newCatWebm}
                autoPlay
                loop
                muted
                playsInline
                className="w-64 h-64 mx-auto object-contain"
              />
              <p className="text-[#FF7B5F] font-semibold mt-3">你领养了一只小猫</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-[#FF9B8A]/20">
          {/* Cat Display */}
          <div className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] p-8 text-center relative overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-white/10"
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{
                scale: showCat ? (showAdoptionPopup ? 1.08 : 0.62) : 0.9,
                y: showAdoptionPopup ? 0 : -10,
                opacity: showCat ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative z-10"
            >
              <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                <video
                  src={newCatWebm}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="你的小猫"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  你的专属伙伴
                  <Sparkles className="w-6 h-6" />
                </h2>
                <p className="text-white/90">等待与你一起成长 🐾</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Agreement Content */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-center mb-6 text-[#FF7B5F]">
                领养协议
              </h3>

              <div className="bg-[#FFE5E0] rounded-2xl p-6 mb-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">你的目标</p>
                    <p className="text-gray-600">
                      {profile && getGoalText(profile.goal)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#FF7B5F] flex-shrink-0 mt-1" fill="currentColor" />
                  <div>
                    <p className="font-semibold text-gray-800">你的承诺</p>
                    <p className="text-gray-600">
                      在接下来的30天内，坚持记录运动和饮食，与小猫一起养成健康习惯
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">温馨提醒</p>
                    <p className="text-gray-600">
                      如果连续3天未打卡，小猫的健康值会降低；但只要重新开始，一切都来得及
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FFF0ED] to-[#FFE5E0] rounded-2xl p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">特别说明</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• 完成30天目标后，你可以领养一只新品种的小猫</li>
                  <li>• 小猫的成长值会随着你的健康行为增加</li>
                  <li>• 你可以与好友的小猫进行状态PK，增加动力</li>
                  <li>• 每一次打卡都在见证更好的自己</li>
                </ul>
              </div>

              {/* Agreement Checkbox */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-3 mb-6 bg-white border-2 border-[#FF9B8A]/30 rounded-xl p-4"
              >
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="border-[#FF7B5F]"
                />
                <label
                  htmlFor="agree"
                  className="text-gray-700 cursor-pointer select-none"
                >
                  我已阅读并同意以上协议，愿意与小猫一起开启健康之旅 🐱
                </label>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/adoption-form')}
                  variant="outline"
                  className="flex-1 border-2 border-[#FF9B8A] text-[#FF7B5F] hover:bg-[#FFE5E0]"
                >
                  返回修改
                </Button>
                <Button
                  onClick={handleAdopt}
                  disabled={!agreed}
                  className="flex-1 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] hover:from-[#FF8A77] hover:to-[#FF6A4D] text-white shadow-lg disabled:opacity-50"
                >
                  <Heart className="mr-2 w-5 h-5" fill="currentColor" />
                  确认领养
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
