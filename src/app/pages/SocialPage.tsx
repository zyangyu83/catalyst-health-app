import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Trophy, Heart, TrendingUp, UserPlus, Award, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { CatHeader } from '../components/CatHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  catHealth: number;
  streak: number;
  todayExerciseMinutes: number;
  todayDietCalories: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
}

export default function SocialPage() {
  const myStreak = Number(localStorage.getItem('checkInStreak') || 0);
  const myTodayExercise = Number(localStorage.getItem('dailyExerciseMinutes') || 0);
  const myTodayDietCalories = Number(localStorage.getItem('dailyDietCalories') || 0);

  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: '小美', avatar: 'XM', catHealth: 85, streak: 7, todayExerciseMinutes: 42, todayDietCalories: 1320 },
    { id: '2', name: '莉莉', avatar: 'LL', catHealth: 78, streak: 5, todayExerciseMinutes: 26, todayDietCalories: 1480 },
    { id: '3', name: '婷婷', avatar: 'TT', catHealth: 92, streak: 12, todayExerciseMinutes: 55, todayDietCalories: 1290 },
    { id: '4', name: '欣欣', avatar: 'XX', catHealth: 70, streak: 4, todayExerciseMinutes: 18, todayDietCalories: 1660 },
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: '婷婷', avatar: 'TT', score: 920, streak: 12 },
    { rank: 2, name: '小美', avatar: 'XM', score: 850, streak: 7 },
    { rank: 3, name: '你', avatar: 'ME', score: 800, streak: myStreak },
    { rank: 4, name: '莉莉', avatar: 'LL', score: 780, streak: 5 },
    { rank: 5, name: '欣欣', avatar: 'XX', score: 700, streak: 4 },
  ]);

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const myHealth = 80;

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-purple-400 to-pink-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Trophy className="w-5 h-5 text-white" />;
    return <span className="text-white font-bold">{rank}</span>;
  };

  const handleAddFriend = () => {
    if (!friendEmail || !friendEmail.includes('@')) return;
    const name = friendEmail.split('@')[0] || '新好友';
    const avatar = name.slice(0, 2).toUpperCase();
    const newFriend: Friend = {
      id: Date.now().toString(),
      name,
      avatar,
      catHealth: 75,
      streak: 0,
      todayExerciseMinutes: 0,
      todayDietCalories: 0,
    };
    setFriends([newFriend, ...friends]);
    setFriendEmail('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] p-6 pt-8 max-w-md mx-auto relative">
      {/* Cat Header */}
      <CatHeader isHappy={true} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-1">社交广场 🐾</h1>
        <p className="text-gray-600">与好友一起成长</p>
      </motion.div>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/90 border-2 border-[#FF9B8A]/20">
          <TabsTrigger value="friends" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9B8A] data-[state=active]:to-[#FF7B5F] data-[state=active]:text-white">好友</TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9B8A] data-[state=active]:to-[#FF7B5F] data-[state=active]:text-white">排行榜</TabsTrigger>
        </TabsList>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-6">
          {/* Add Friend Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] hover:from-[#FF8A77] hover:to-[#FF6A4D] text-white shadow-lg">
                  <UserPlus className="mr-2 w-5 h-5" />
                  添加好友
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-[#FF7B5F]">添加好友</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="friendEmail" className="text-gray-700 mb-2 block">好友邮箱</Label>
                    <Input
                      id="friendEmail"
                      type="email"
                      placeholder="friend@email.com"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                      className="border-[#FF9B8A]/50 focus:border-[#FF7B5F]"
                    />
                  </div>
                  <Button
                    onClick={handleAddFriend}
                    disabled={!friendEmail || !friendEmail.includes('@')}
                    className="w-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] disabled:opacity-50"
                  >
                    确认添加
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Friends List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              我的好友 ({friends.length})
            </h3>
            <div className="space-y-3">
              {friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    onClick={() => setSelectedFriend(friend)}
                    className="p-4 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]">
                          <AvatarFallback className="text-white font-semibold">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-800">{friend.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Zap className="w-3 h-3 text-orange-500" />
                            <span>{friend.streak} 天连胜</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">猫咪活力</p>
                        <p className="text-xl font-bold text-gray-800">{friend.catHealth}%</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* PK Dialog */}
          {selectedFriend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
              onClick={() => setSelectedFriend(null)}
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-center mb-6 text-[#FF7B5F]">
                    猫咪状态 PK 🐱
                  </h3>

                  <div className="space-y-6">
                    {/* Me */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500">
                          <AvatarFallback className="text-white font-semibold">
                            我
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">你的小猫</p>
                          <p className="text-sm text-gray-600">活力值 {myHealth}%</p>
                          <p className="text-xs text-gray-500">今日运动 {myTodayExercise} 分钟</p>
                          <p className="text-xs text-gray-500">今日饮食 {myTodayDietCalories} 千卡</p>
                        </div>
                      </div>
                      <Progress value={myHealth} className="h-3" />
                    </div>

                    {/* VS Badge */}
                    <div className="flex justify-center">
                      <Badge className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] text-white text-lg px-4 py-2">
                        VS
                      </Badge>
                    </div>

                    {/* Friend */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]">
                          <AvatarFallback className="text-white font-semibold">
                            {selectedFriend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{selectedFriend.name}的小猫</p>
                          <p className="text-sm text-gray-600">活力值 {selectedFriend.catHealth}%</p>
                          <p className="text-xs text-gray-500">今日运动 {selectedFriend.todayExerciseMinutes} 分钟</p>
                          <p className="text-xs text-gray-500">今日饮食 {selectedFriend.todayDietCalories} 千卡</p>
                        </div>
                      </div>
                      <Progress value={selectedFriend.catHealth} className="h-3" />
                    </div>

                    {/* Result */}
                    <div className="bg-gradient-to-r from-[#FFE5E0] to-[#FFF0ED] rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">对比结果</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {myHealth > selectedFriend.catHealth
                          ? '你的小猫更活力满满！🎉'
                          : myHealth < selectedFriend.catHealth
                          ? '继续加油，追上好友！💪'
                          : '势均力敌，继续保持！✨'}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedFriend(null)}
                    className="w-full mt-6 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]"
                  >
                    关闭
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] text-white p-6 mb-6 border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">本周猫咪活力榜</p>
                  <p className="text-3xl font-bold">第 {leaderboard.find(e => e.name === '你')?.rank} 名</p>
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
                  <Award className="w-16 h-16" />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">排行榜</h3>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card
                    className={`p-4 border-2 ${
                      entry.name === '你'
                        ? 'bg-gradient-to-r from-[#FFE5E0] to-[#FFF0ED] border-[#FF9B8A]'
                        : 'bg-white/90 border-[#FF9B8A]/20'
                    } backdrop-blur-lg`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(
                          entry.rank
                        )} flex items-center justify-center flex-shrink-0 shadow-md`}
                      >
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Avatar & Name */}
                      <Avatar className="w-12 h-12 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]">
                        <AvatarFallback className="text-white font-semibold">
                          {entry.avatar}
                        </AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {entry.name}
                          {entry.name === '你' && (
                            <Badge className="ml-2 bg-[#FF7B5F] text-white text-xs">你</Badge>
                          )}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="w-3 h-3" />
                          <span>{entry.streak} 天连胜</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">{entry.score}</p>
                        <p className="text-xs text-gray-500">活力分</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-4 bg-gradient-to-r from-[#FFE5E0] to-[#FFF0ED] border-2 border-[#FF9B8A]/30">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#FF7B5F] flex-shrink-0 mt-0.5" fill="currentColor" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">提升排名小贴士 🐾</p>
                  <p className="text-sm text-gray-600">
                    坚持每日打卡，保持健康饮食，你的小猫活力值会不断提升，排名也会上升哦！
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
