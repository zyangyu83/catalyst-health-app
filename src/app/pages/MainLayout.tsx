import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, Dumbbell, UtensilsCrossed, Users } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { path: '/app', icon: Home, label: '家园' },
  { path: '/app/exercise', icon: Dumbbell, label: '运动' },
  { path: '/app/diet', icon: UtensilsCrossed, label: '饮食' },
  { path: '/app/social', icon: Users, label: '社交' },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E0] via-[#FFF0ED] to-[#FFE5E0] pb-20">
      <Outlet />

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t-2 border-[#FF9B8A]/20 shadow-lg z-50"
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F]'
                        : 'bg-transparent'
                    }`}
                  >
                    <item.icon
                      className={`w-6 h-6 ${
                        isActive ? 'text-white' : 'text-gray-500'
                      }`}
                    />
                  </motion.div>
                  <span
                    className={`text-xs ${
                      isActive
                        ? 'text-[#FF7B5F] font-semibold'
                        : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-[#FF9B8A] to-[#FF7B5F] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}