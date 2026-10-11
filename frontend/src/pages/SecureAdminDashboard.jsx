import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, Shield, BookOpen, MessageSquare, Settings, BarChart3, 
  Plus, Edit, Trash2, Crown, Ban, CheckCircle, LogOut, Activity,
  Search, Eye, X
} from 'lucide-react'

const SecureAdminDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [rooms, setRooms] = useState([])
  const [labs, setLabs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [formData, setFormData] = useState({})

  useEffect(() => {
    verifyAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [activeTab, user])

  const verifyAuth = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://localhost:5000/api/admin/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('token')
          navigate('/login?redirect=/secure-admin-dashboard')
          return
        }
        throw new Error('Authentication failed')
      }

      const data = await response.json()
      if (!data.user || data.user.role !== 'admin') {
        navigate('/dashboard')
        return
      }

      setUser(data.user)
      setLoading(false)
    } catch (error) {
      console.error('Admin verification error:', error)
      navigate('/login?redirect=/secure-admin-dashboard')
    }
  }

  const fetchData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } else if (activeTab === 'users') {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } else if (activeTab === 'rooms') {
        const response = await fetch('http://localhost:5000/api/admin/rooms', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setRooms(data.rooms || [])
        }
      } else if (activeTab === 'labs') {
        const response = await fetch('http://localhost:5000/api/admin/labs', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setLabs(data.labs || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      localStorage.removeItem('adminUser')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        fetchData()
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  const deleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/rooms/${roomId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        fetchData()
      } catch (error) {
        console.error('Failed to delete room:', error)
      }
    }
  }

  const deleteLab = async (labId) => {
    if (window.confirm('Are you sure you want to delete this lab?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/labs/${labId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        fetchData()
      } catch (error) {
        console.error('Failed to delete lab:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = modalType === 'room' ? 'http://localhost:5000/api/admin/rooms' : 'http://localhost:5000/api/admin/labs'
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      setShowModal(false)
      setFormData({})
      fetchData()
    } catch (error) {
      console.error('Failed to create:', error)
    }
  }

  const openModal = (type) => {
    setModalType(type)
    setFormData(type === 'room' ? {
      name: '', description: '', difficulty: 'Beginner', category: 'Web Security',
      points: 100, estimatedTime: 30, tags: ''
    } : {
      title: '', description: '', content: '', difficulty: 'Beginner', 
      category: 'Web Security', points: 100, estimatedTime: 30, tags: ''
    })
    setShowModal(true)
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: MessageSquare },
    { id: 'labs', label: 'Labs', icon: BookOpen }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Secure Admin Panel</h1>
                <p className="text-slate-400">Professional Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white font-medium">{user?.name}</div>
                <div className="text-slate-400 text-sm">Administrator</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/20">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">{stats.activeUsers || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400">Total Rooms</p>
                  <p className="text-2xl font-bold text-white">{stats.totalRooms || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-500/20">
                  <BookOpen className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-slate-400">Total Labs</p>
                  <p className="text-2xl font-bold text-white">{stats.totalLabs || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="text-left py-3 px-6 text-slate-300">User</th>
                    <th className="text-left py-3 px-6 text-slate-300">Email</th>
                    <th className="text-left py-3 px-6 text-slate-300">Role</th>
                    <th className="text-left py-3 px-6 text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-slate-700">
                      <td className="py-4 px-6 text-white">{user.name}</td>
                      <td className="py-4 px-6 text-slate-300">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rooms Management */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Room Management</h2>
              <button
                onClick={() => openModal('room')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room._id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-white">{room.name}</h3>
                    <button
                      onClick={() => deleteRoom(room._id)}
                      className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{room.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {room.difficulty}
                    </span>
                    <span className="text-slate-400 text-sm">{room.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Labs Management */}
        {activeTab === 'labs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Lab Management</h2>
              <button
                onClick={() => openModal('lab')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Lab
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.map((lab) => (
                <div key={lab._id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-white">{lab.title}</h3>
                    <button
                      onClick={() => deleteLab(lab._id)}
                      className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{lab.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {lab.difficulty}
                    </span>
                    <span className="text-slate-400 text-sm">{lab.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Add {modalType === 'room' ? 'Room' : 'Lab'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {modalType === 'room' ? 'Room Name' : 'Lab Title'}
                </label>
                <input
                  type="text"
                  required
                  value={modalType === 'room' ? formData.name || '' : formData.title || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    [modalType === 'room' ? 'name' : 'title']: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              {modalType === 'lab' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.content || ''}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty || 'Beginner'}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Points</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={formData.points || 100}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create {modalType === 'room' ? 'Room' : 'Lab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecureAdminDashboard