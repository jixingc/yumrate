import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/api';

export const LoginView: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // 获取原本想访问的页面，默认是首页
  const from = location.state?.from?.pathname || '/';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarBase64(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLoginMode) {
        // 登录
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        // 注册
        let avatarUrl = null;
        if (avatarBase64) {
          avatarUrl = await uploadImage(avatarBase64);
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              avatar_url: avatarUrl
            }
          }
        });

        if (error) throw error;
        alert('注册成功！(如果您在 Supabase 中开启了邮箱验证，请先前往邮箱验证链接后再登录)');
        setIsLoginMode(true); // 注册成功切回登录
      }
    } catch (err: any) {
      setError(err.message || (isLoginMode ? '登录失败' : '注册失败'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f8f9fa] to-gray-50 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.05)] p-8 sm:p-12 relative z-10 border border-gray-100">

        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-baseline justify-center gap-2 mb-2">
              <span>探店笔记</span>
              <span className="text-xl font-serif text-gray-400 font-bold">Yumrate.</span>
            </h1>
          </Link>
          <p className="text-gray-500 font-bold tracking-widest text-sm uppercase">
            {isLoginMode ? 'Collaborator Login' : 'Join as Collaborator'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLoginMode && (
              <div className="flex flex-col items-center justify-center mb-6">
                <label className="cursor-pointer group relative">
                  <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${avatarBase64 ? 'border-transparent' : 'border-gray-300 group-hover:border-gray-900 bg-gray-50'}`}>
                    {avatarBase64 ? (
                      <img src={avatarBase64} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Avatar</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <div className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Upload Profile Picture</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white rounded-xl py-3.5 font-bold tracking-widest text-sm uppercase hover:bg-black transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (isLoginMode ? '登录 Login' : '注册 Sign Up')}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(null);
              }}
              disabled={isLoading}
              className="w-full bg-white text-gray-500 border-none rounded-xl py-3.5 font-bold tracking-widest text-xs uppercase hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              {isLoginMode ? '没有账号？去注册 Sign Up' : '已有账号？去登录 Login'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
