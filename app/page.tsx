import { createClient } from '@/lib/supabase/server'
import { AuthButton } from '@/components/AuthButton'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tight">
            Smart <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Bookmarks</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-lg mx-auto">
            Your personal bookmark manager with real-time sync across all your devices
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 pt-8">
          <AuthButton user={user} />

          <div className="flex gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Real-time sync
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Private & secure
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Lightning fast
            </div>
          </div>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
            <div className="text-sm text-gray-400">Unlimited Bookmarks</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-pink-400 mb-2">⚡</div>
            <div className="text-sm text-gray-400">Instant Updates</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">🔒</div>
            <div className="text-sm text-gray-400">Your Data Only</div>
          </div>
        </div>
      </div>
    </main>
  )
}
