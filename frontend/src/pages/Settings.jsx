import { useState, memo, useMemo, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../contexts/app-context"
import { updateProfile } from "../services/profile"
import { User, Bell, Shield, Palette, Globe, Key, Trash2, Save, Upload } from "lucide-react"
import TwoFactorSettings from '../components/TwoFactorSettings'

// Memoized tab button component
const TabButton = memo(({ tab, isActive, onClick }) => {
  const Icon = tab.icon
  return (
    <button
      onClick={() => onClick(tab.id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
        isActive
          ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
          : "text-slate-300 hover:bg-slate-800/50"
      }`}
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      <Icon className="w-4 h-4" />
      {tab.label}
    </button>
  )
})

// Memoized toggle switch component
const ToggleSwitch = memo(({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between" style={{ transform: 'translateZ(0)' }}>
    <div>
      <div className="font-medium text-white">{label}</div>
      <div className="text-sm text-slate-400">{description}</div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
    </label>
  </div>
))

// Memoized input field component
const InputField = memo(({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
      style={{ transform: 'translateZ(0)' }}
    />
  </div>
))

const Settings = memo(() => {
  const { user, updateProfile: updateUserProfile, refreshUser } = useApp()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [settings, setSettings] = useState({
    username: user?.name || "",
    email: user?.email || "",
    notifications: {
      email: true,
      push: false,
      labComplete: true,
      roomInvites: true
    },
    privacy: {
      profilePublic: true,
      showProgress: true,
      showRank: false
    },
    theme: "dark",
    language: "en"
  })

  // Memoized tabs data
  const tabs = useMemo(() => [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Key }
  ], [])

  // Memoized callbacks
  const updateSetting = useCallback((category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }, [])

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId)
  }, [])

  const saveSettings = useCallback(async () => {
    setIsSaving(true)
    try {
      await updateProfile({ name: settings.username, email: settings.email })
      await updateUserProfile({ name: settings.username, email: settings.email })
      alert("Settings saved successfully!")
      navigate('/profile')
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }, [settings, updateUserProfile, navigate])

  const handleCancel = useCallback(() => {
    navigate('/profile')
  }, [navigate])

  const handleUsernameChange = useCallback((e) => {
    setSettings(prev => ({ ...prev, username: e.target.value }))
  }, [])

  const handleEmailChange = useCallback((e) => {
    setSettings(prev => ({ ...prev, email: e.target.value }))
  }, [])

  const handleAvatarUpload = useCallback(async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      alert('Only JPEG, PNG, and GIF files are allowed')
      return
    }

    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/users/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      console.log('Upload response:', data)
      
      if (response.ok && data.avatar) {
        // Update global user state immediately
        await updateUserProfile({ avatar: data.avatar })
        await refreshUser()
        alert('Avatar updated successfully!')
      } else {
        alert(data.message || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      alert('Failed to upload avatar')
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [refreshUser])

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Memoized notification settings
  const notificationSettings = useMemo(() => [
    {
      key: 'email',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      checked: settings.notifications.email
    },
    {
      key: 'labComplete',
      label: 'Lab Completion',
      description: 'Notify when labs are completed',
      checked: settings.notifications.labComplete
    },
    {
      key: 'roomInvites',
      label: 'Room Invites',
      description: 'Notify when invited to rooms',
      checked: settings.notifications.roomInvites
    }
  ], [settings.notifications])

  return (
    <div className="bg-slate-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-300">Manage your account preferences and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <TabButton
                      key={tab.id}
                      tab={tab}
                      isActive={activeTab === tab.id}
                      onClick={handleTabChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="p-6 border-b border-slate-700/50">
                  <h2 className="text-lg font-bold text-white">Profile Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                      {user?.avatar ? (
                        <img 
                          src={`http://localhost:5000${user.avatar}?t=${Date.now()}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Avatar load error:', e.target.src)
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <button 
                        onClick={handleAvatarClick}
                        disabled={isUploadingAvatar}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                      </button>
                      <p className="text-sm text-slate-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Username"
                      value={settings.username}
                      onChange={handleUsernameChange}
                    />
                    <InputField
                      label="Email"
                      type="email"
                      value={settings.email}
                      onChange={handleEmailChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="p-6 border-b border-slate-700/50">
                  <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    {notificationSettings.map((setting) => (
                      <ToggleSwitch
                        key={setting.key}
                        checked={setting.checked}
                        onChange={(e) => updateSetting('notifications', setting.key, e.target.checked)}
                        label={setting.label}
                        description={setting.description}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="card rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="p-6 border-b border-slate-700/50">
                  <h2 className="text-lg font-bold text-white">Security Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <InputField label="Current Password" type="password" />
                      <InputField label="New Password" type="password" />
                      <InputField label="Confirm New Password" type="password" />
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <TwoFactorSettings user={user} onUpdate={refreshUser} />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveSettings} 
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

Settings.displayName = 'Settings'
export default Settings