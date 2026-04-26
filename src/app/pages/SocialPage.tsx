import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Heart,
  TrendingUp,
  UserPlus,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Medal,
  Crown,
  Copy,
  Share2,
  DoorOpen,
  Pencil,
} from 'lucide-react';
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

type DormRankScope = 'floor' | 'building' | 'campus';
type Trend = 'up' | 'down' | 'flat';

interface DormTeamMember {
  id: string;
  nickname: string;
  avatar: string;
  streak: number;
  vitality: number;
}

interface DormRankEntry {
  rank: number;
  teamName: string;
  members: number;
  score: number;
  trend: Trend;
  buildingTag?: string;
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
  const [activeDormScope, setActiveDormScope] = useState<DormRankScope>('floor');
  const [teamName, setTeamName] = useState('喵力 303');
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const myHealth = 80;

  const seasonStarted = false;
  const canQuitTeam = !seasonStarted;

  const dormMembers: DormTeamMember[] = [
    { id: 'm1', nickname: '你', avatar: 'ME', streak: myStreak, vitality: 80 },
    { id: 'm2', nickname: '阿宁', avatar: 'AN', streak: 6, vitality: 78 },
    { id: 'm3', nickname: '小冉', avatar: 'XR', streak: 9, vitality: 86 },
    { id: 'm4', nickname: '可可', avatar: 'KK', streak: 4, vitality: 72 },
  ];

  const dormRankings: Record<DormRankScope, DormRankEntry[]> = {
    floor: [
      { rank: 1, teamName: '喵步 301', members: 6, score: 3520, trend: 'up' },
      { rank: 2, teamName: '夜跑 302', members: 5, score: 3390, trend: 'flat' },
      { rank: 3, teamName: teamName, members: dormMembers.length, score: 3260, trend: 'up' },
      { rank: 4, teamName: '快乐 304', members: 4, score: 3095, trend: 'down' },
    ],
    building: [
      { rank: 1, teamName: '星火 A-801', members: 6, score: 3690, trend: 'up' },
      { rank: 2, teamName: '喵步 301', members: 6, score: 3520, trend: 'flat' },
      { rank: 3, teamName: '强风 A-605', members: 5, score: 3410, trend: 'up' },
      { rank: 4, teamName: teamName, members: dormMembers.length, score: 3260, trend: 'up' },
    ],
    campus: [
      { rank: 1, teamName: '晨跑先锋', members: 6, score: 4120, trend: 'up', buildingTag: '1栋' },
      { rank: 2, teamName: '夜猫突击队', members: 5, score: 4050, trend: 'flat', buildingTag: '7栋' },
      { rank: 3, teamName: 'B-305 热量清零', members: 6, score: 3960, trend: 'up', buildingTag: '3栋' },
      { rank: 4, teamName: '喵力 220', members: 4, score: 3880, trend: 'down', buildingTag: '2栋' },
      { rank: 5, teamName: teamName, members: dormMembers.length, score: 3260, trend: 'up', buildingTag: '3栋' },
    ],
  };

  const myDormRank = useMemo(() => {
    const found = dormRankings.floor.find((item) => item.teamName === teamName);
    return found?.rank ?? 3;
  }, [teamName]);

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

  const getDormRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-sm font-semibold text-gray-600 w-4 text-center">{rank}</span>;
  };

  const getTrendNode = (trend: Trend) => {
    if (trend === 'up') return <span className="text-green-600 text-xs flex items-center gap-1"><ArrowUp className="w-3 h-3" />上升</span>;
    if (trend === 'down') return <span className="text-red-500 text-xs flex items-center gap-1"><ArrowDown className="w-3 h-3" />下降</span>;
    return <span className="text-gray-500 text-xs flex items-center gap-1"><ArrowRight className="w-3 h-3" />持平</span>;
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

  const handleGenerateInvite = async () => {
    const code = `DORM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setInviteCode(code);
    if (navigator.share) {
      await navigator.share({ title: '宿舍赛邀请码', text: `加入我们的宿舍赛队伍：${code}` });
      return;
    }
    await navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] p-6 pt-8 max-w-md mx-auto relative">
      <CatHeader isHappy />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">社交广场 🐾</h1>
        <p className="text-gray-600">与好友和宿舍队一起成长</p>
      </motion.div>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/90 border-2 border-[#FF9B8A]/20">
          <TabsTrigger value="friends" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9B8A] data-[state=active]:to-[#FF7B5F] data-[state=active]:text-white">好友</TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9B8A] data-[state=active]:to-[#FF7B5F] data-[state=active]:text-white">排行榜</TabsTrigger>
          <TabsTrigger value="dorm" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9B8A] data-[state=active]:to-[#FF7B5F] data-[state=active]:text-white">宿舍赛</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
                    <Input id="friendEmail" type="email" placeholder="friend@email.com" value={friendEmail} onChange={(e) => setFriendEmail(e.target.value)} className="border-[#FF9B8A]/50 focus:border-[#FF7B5F]" />
                  </div>
                  <Button onClick={handleAddFriend} disabled={!friendEmail || !friendEmail.includes('@')} className="w-full bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] disabled:opacity-50">确认添加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">我的好友 ({friends.length})</h3>
            <div className="space-y-3">
              {friends.map((friend, index) => (
                <motion.div key={friend.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} whileHover={{ scale: 1.02 }}>
                  <Card onClick={() => setSelectedFriend(friend)} className="p-4 bg-white/90 backdrop-blur-lg border-2 border-[#FF9B8A]/20 cursor-pointer hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]"><AvatarFallback className="text-white font-semibold">{friend.avatar}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-semibold text-gray-800">{friend.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600"><Zap className="w-3 h-3 text-orange-500" /><span>{friend.streak} 天连胜</span></div>
                        </div>
                      </div>
                      <div className="text-right"><p className="text-sm text-gray-600 mb-1">猫咪活力</p><p className="text-xl font-bold text-gray-800">{friend.catHealth}%</p></div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {selectedFriend && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setSelectedFriend(null)}>
              <motion.div initial={{ y: 50 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
                <Card className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-center mb-6 text-[#FF7B5F]">猫咪状态 PK 🐱</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500"><AvatarFallback className="text-white font-semibold">我</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">你的小猫</p>
                          <p className="text-sm text-gray-600">活力值 {myHealth}%</p>
                          <p className="text-xs text-gray-500">今日运动 {myTodayExercise} 分钟</p>
                          <p className="text-xs text-gray-500">今日饮食 {myTodayDietCalories} 千卡</p>
                        </div>
                      </div>
                      <Progress value={myHealth} className="h-3" />
                    </div>
                    <div className="flex justify-center"><Badge className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] text-white text-lg px-4 py-2">VS</Badge></div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]"><AvatarFallback className="text-white font-semibold">{selectedFriend.avatar}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{selectedFriend.name}的小猫</p>
                          <p className="text-sm text-gray-600">活力值 {selectedFriend.catHealth}%</p>
                          <p className="text-xs text-gray-500">今日运动 {selectedFriend.todayExerciseMinutes} 分钟</p>
                          <p className="text-xs text-gray-500">今日饮食 {selectedFriend.todayDietCalories} 千卡</p>
                        </div>
                      </div>
                      <Progress value={selectedFriend.catHealth} className="h-3" />
                    </div>
                  </div>
                  <Button onClick={() => setSelectedFriend(null)} className="w-full mt-6 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]">关闭</Button>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] text-white p-6 mb-6 border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">本周猫咪活力榜</p>
                  <p className="text-3xl font-bold">第 {leaderboard.find((e) => e.name === '你')?.rank} 名</p>
                </div>
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <Award className="w-16 h-16" />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">排行榜</h3>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div key={entry.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                  <Card className={`p-4 border-2 ${entry.name === '你' ? 'bg-gradient-to-r from-[#FFE5E0] to-[#FFF0ED] border-[#FF9B8A]' : 'bg-white/90 border-[#FF9B8A]/20'} backdrop-blur-lg`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)} flex items-center justify-center flex-shrink-0 shadow-md`}>{getRankIcon(entry.rank)}</div>
                      <Avatar className="w-12 h-12 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]"><AvatarFallback className="text-white font-semibold">{entry.avatar}</AvatarFallback></Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{entry.name}{entry.name === '你' && <Badge className="ml-2 bg-[#FF7B5F] text-white text-xs">你</Badge>}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600"><TrendingUp className="w-3 h-3" /><span>{entry.streak} 天连胜</span></div>
                      </div>
                      <div className="text-right"><p className="text-xl font-bold text-gray-800">{entry.score}</p><p className="text-xs text-gray-500">活力分</p></div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card className="p-4 bg-gradient-to-r from-[#FFE5E0] to-[#FFF0ED] border-2 border-[#FF9B8A]/30">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#FF7B5F] flex-shrink-0 mt-0.5" fill="currentColor" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">提升排名小贴士 🐾</p>
                  <p className="text-sm text-gray-600">坚持每日打卡，保持健康饮食，你的小猫活力值会不断提升，排名也会上升。</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="dorm" className="space-y-6">
          <Card className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] text-white p-5 border-0 shadow-lg">
            <p className="text-sm text-white/90">第 3 赛季 · 猫咪活力宿舍赛</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-xs text-white/80">倒计时</p>
                <p className="text-2xl font-bold">还剩 5 天</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/80">我的队伍排名</p>
                <p className="text-lg font-semibold">本周楼层榜 第 {myDormRank} 名</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white/90 border-2 border-[#FF9B8A]/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">我的队伍</h3>
              {seasonStarted ? (
                <Badge variant="secondary">赛季进行中，队名锁定</Badge>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditingTeamName(!editingTeamName)} className="border-[#FF9B8A] text-[#FF7B5F]">
                  <Pencil className="w-4 h-4 mr-1" />
                  编辑队名
                </Button>
              )}
            </div>

            <div className="mb-4">
              {editingTeamName && !seasonStarted ? (
                <div className="flex gap-2">
                  <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="border-[#FF9B8A]/50" />
                  <Button onClick={() => setEditingTeamName(false)} className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]">保存</Button>
                </div>
              ) : (
                <p className="text-xl font-bold text-gray-800">{teamName}</p>
              )}
            </div>

            <div className="space-y-3 mb-4">
              {dormMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between bg-[#FFF6F3] rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-9 h-9 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]"><AvatarFallback className="text-white text-xs">{member.avatar}</AvatarFallback></Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{member.nickname}</p>
                      <p className="text-xs text-gray-500">连胜 {member.streak} 天</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#FF7B5F]">活力分 {member.vitality}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-gradient-to-r from-[#FFE5E0] to-[#FFF0ED] p-3 text-sm text-gray-700">
              <p>全队总分：<span className="font-semibold text-gray-900">3260</span></p>
              <p>楼层排名：<span className="font-semibold text-gray-900">第 {myDormRank} 名</span></p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button onClick={handleGenerateInvite} className="bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]">
                <Share2 className="w-4 h-4 mr-1" />邀请队友
              </Button>
              <Button variant="destructive" onClick={() => setShowExitConfirm(true)} disabled={!canQuitTeam}>
                <DoorOpen className="w-4 h-4 mr-1" />退出队伍
              </Button>
            </div>
            {!canQuitTeam && <p className="text-xs text-gray-500 mt-2">仅限非比赛期间退出队伍</p>}
            {inviteCode && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-[#FFF6F3] p-2">
                <span className="text-sm text-gray-700">邀请码：{inviteCode}</span>
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(inviteCode)}><Copy className="w-3 h-3 mr-1" />复制</Button>
              </div>
            )}
          </Card>

          <Card className="p-5 bg-white/90 border-2 border-[#FF9B8A]/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">宿舍赛排行榜</h3>
              <div className="flex gap-1">
                <Button size="sm" variant={activeDormScope === 'floor' ? 'default' : 'outline'} onClick={() => setActiveDormScope('floor')} className={activeDormScope === 'floor' ? 'bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]' : 'border-[#FF9B8A] text-[#FF7B5F]'}>楼层榜</Button>
                <Button size="sm" variant={activeDormScope === 'building' ? 'default' : 'outline'} onClick={() => setActiveDormScope('building')} className={activeDormScope === 'building' ? 'bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]' : 'border-[#FF9B8A] text-[#FF7B5F]'}>楼栋榜</Button>
                <Button size="sm" variant={activeDormScope === 'campus' ? 'default' : 'outline'} onClick={() => setActiveDormScope('campus')} className={activeDormScope === 'campus' ? 'bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]' : 'border-[#FF9B8A] text-[#FF7B5F]'}>全校榜</Button>
              </div>
            </div>
            <div className="space-y-2">
              {dormRankings[activeDormScope].map((entry) => (
                <div key={`${activeDormScope}-${entry.rank}-${entry.teamName}`} className="flex items-center justify-between rounded-lg border border-[#FF9B8A]/20 px-3 py-2 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-6 flex justify-center">{getDormRankBadge(entry.rank)}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{entry.teamName}</p>
                      <p className="text-xs text-gray-500">
                        {entry.members} 人 · 总分 {entry.score}
                        {activeDormScope === 'campus' && entry.buildingTag ? ` · ${entry.buildingTag}` : ''}
                      </p>
                    </div>
                  </div>
                  {getTrendNode(entry.trend)}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#FF7B5F]">确认退出队伍</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">退出后你将失去当前赛季队伍积分归属，是否继续？</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button variant="outline" onClick={() => setShowExitConfirm(false)}>取消</Button>
            <Button variant="destructive" onClick={() => setShowExitConfirm(false)}>确认退出</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
