'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function BookmarkForm({ userId, onBookmarkAdded }: { userId: string; onBookmarkAdded?: () => void }) {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url || !title) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('bookmarks')
                .insert([{ url, title, user_id: userId }])

            if (error) throw error

            setUrl('')
            setTitle('')

            // Call the callback to manually refresh if provided
            if (onBookmarkAdded) {
                onBookmarkAdded()
            }
        } catch (error) {
            console.error('Error adding bookmark:', error)
            alert('Failed to add bookmark')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Bookmark</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Awesome Website"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                        URL
                    </label>
                    <input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Adding...' : 'Add Bookmark'}
                </button>
            </div>
        </form>
    )
}
