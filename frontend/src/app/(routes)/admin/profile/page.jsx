'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, setCredentials } from '@/redux/features/auth/authSlice'
import { useUpdateProfileMutation } from '@/redux/services/authApi'
import { User, Mail, Shield, Save, Loader2, Camera } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
    const currentUser = useSelector(selectCurrentUser)
    const dispatch = useDispatch()
    const [updateProfile, { isLoading }] = useUpdateProfileMutation()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
    })

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
            })
        }
    }, [currentUser])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await updateProfile(formData).unwrap()
            dispatch(setCredentials({
                user: result.user,
                token: localStorage.getItem('token') // Keep existing token
            }))
            toast.success('Profile updated successfully!')
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update profile')
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600">View and update your personal information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Card: Avatar & Overview */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                                {currentUser?.avatar ? (
                                    <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    currentUser?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-blue-600 hover:text-blue-700 transition-colors">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{currentUser?.name}</h2>
                        <p className="text-gray-500 text-sm mb-4">{currentUser?.email}</p>
                        <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                            <Shield size={14} className="mr-1" />
                            {currentUser?.role}
                        </div>
                    </div>
                </div>

                {/* Right Card: Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <User size={16} className="mr-2 text-gray-400" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Your Full Name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Mail size={16} className="mr-2 text-gray-400" />
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
