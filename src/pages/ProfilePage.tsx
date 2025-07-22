import { useState } from 'react';
import { User, Plus } from 'lucide-react';
import { userApi } from '../lib/api';
import type { UserDTO } from '../types/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function ProfilePage() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setCreating(true);
    try {
      const newUser = await userApi.create({ nickname: nickname.trim() });
      setUser(newUser);
      setNickname('');
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleLoadUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setLoading(true);
    try {
      const loadedUser = await userApi.getById(userId.trim());
      setUser(loadedUser);
      setUserId('');
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your user profile</p>
      </div>

      {user ? (
        <div className="card text-center space-y-4">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.nickname}</h2>
            <p className="text-gray-600">User ID: {user.id}</p>
          </div>
          <button
            onClick={() => setUser(null)}
            className="btn-outline"
          >
            Switch User
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Create New User */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New User
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                  Nickname
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter your nickname"
                  className="input"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={creating || !nickname.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {creating ? <LoadingSpinner size="sm" /> : <Plus className="h-4 w-4" />}
                Create User
              </button>
            </form>
          </div>

          {/* Load Existing User */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Load Existing User
            </h2>
            <form onSubmit={handleLoadUser} className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="input"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !userId.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <User className="h-4 w-4" />}
                Load User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}