import { Film, Gamepad2, Star, User, Monitor, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Header() {
  const location = useLocation();

  const navigation = [
    { name: 'All Media', href: '/all-media', icon: Monitor },
    { name: 'Movies', href: '/movies', icon: Film },
    { name: 'Games', href: '/games', icon: Gamepad2 },
    { name: 'Ratings', href: '/ratings', icon: Star },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">CritiCloud</span>
                <p className="text-xs text-slate-500 -mt-1">Media Rating Platform</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'nav-link',
                    isActive ? 'nav-link-active' : 'nav-link-inactive'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className={cn(
                'nav-link',
                location.pathname === '/profile' ? 'nav-link-active' : 'nav-link-inactive'
              )}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}