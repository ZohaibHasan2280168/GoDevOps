import { memo, useState, useEffect } from "react"
import { ModernButton } from "../components/ui/modern-button"
import { Badge } from "../components/ui/badge"
import { 
  Award, 
  Download, 
  Share2, 
  Calendar,
  CheckCircle,
  Lock,
  Trophy,
  Star,
  ExternalLink
} from "lucide-react"

const CertificateCard = memo(({ certificate }) => {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    // Simulate download
    setTimeout(() => {
      setDownloading(false)
      alert(`Downloading certificate: ${certificate.title}`)
    }, 1500)
  }

  const handleShare = () => {
    alert(`Share certificate: ${certificate.title}`)
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-primary-500/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${
            certificate.earned 
              ? 'bg-gradient-to-br from-primary-500/20 to-teal-500/20' 
              : 'bg-slate-700/50'
          }`}>
            {certificate.earned ? (
              <Award className="h-6 w-6 text-primary-400" />
            ) : (
              <Lock className="h-6 w-6 text-slate-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{certificate.title}</h3>
            <p className="text-sm text-slate-400">{certificate.category}</p>
          </div>
        </div>
        {certificate.earned && (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Earned
          </Badge>
        )}
      </div>

      <p className="text-slate-400 text-sm mb-4">{certificate.description}</p>

      <div className="flex items-center gap-4 mb-4 text-sm">
        {certificate.earned ? (
          <>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{certificate.earnedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Score: {certificate.score}%</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="h-4 w-4" />
            <span>Complete {certificate.requirement} to unlock</span>
          </div>
        )}
      </div>

      {certificate.earned ? (
        <div className="flex gap-2">
          <ModernButton
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </ModernButton>
          <ModernButton
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </ModernButton>
        </div>
      ) : (
        <ModernButton
          variant="glass"
          size="sm"
          className="w-full"
          disabled
        >
          <Lock className="mr-2 h-4 w-4" />
          Locked
        </ModernButton>
      )}
    </div>
  )
})

CertificateCard.displayName = 'CertificateCard'

const CertificatesPage = memo(() => {
  const [filter, setFilter] = useState('all') // all, earned, locked

  const [certificates, setCertificates] = useState([]) // This will be populated by API call

  // Placeholder for fetching certificates from an API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Replace with actual API call: const fetchedCertificates = await getCertificates();
        // For now, an empty array to remove dummy data
        const mockCertificates = []; 
        setCertificates(mockCertificates);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
        // Handle error state
      }
    };
    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'earned') return cert.earned
    if (filter === 'locked') return !cert.earned
    return true
  })

  const stats = {
    total: certificates.length,
    earned: certificates.filter(c => c.earned).length,
    locked: certificates.filter(c => !c.earned).length
  }

  return (
    
    <div className="page-container bg-[rgb(17,24,39)] text-text">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-500/10 border border-primary-500/20 px-4 py-2 text-sm">
            <Trophy className="h-4 w-4 text-primary-400" />
            <span className="text-primary-300">Achievement Certificates</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Certificates
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Showcase your cybersecurity expertise with professional certificates
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Certificates</p>
                <p className="text-3xl font-bold text-slate-100">{stats.total}</p>
              </div>
              <Award className="h-10 w-10 text-slate-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">Earned</p>
                <p className="text-3xl font-bold text-green-400">{stats.earned}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Locked</p>
                <p className="text-3xl font-bold text-slate-100">{stats.locked}</p>
              </div>
              <Lock className="h-10 w-10 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          <ModernButton
            variant={filter === 'all' ? 'primary' : 'glass'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </ModernButton>
          <ModernButton
            variant={filter === 'earned' ? 'primary' : 'glass'}
            size="sm"
            onClick={() => setFilter('earned')}
          >
            Earned ({stats.earned})
          </ModernButton>
          <ModernButton
            variant={filter === 'locked' ? 'primary' : 'glass'}
            size="sm"
            onClick={() => setFilter('locked')}
          >
            Locked ({stats.locked})
          </ModernButton>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {filteredCertificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>

        {/* Share Section */}
        <div className="bg-gradient-to-r from-primary-500/10 to-teal-500/10 border border-primary-500/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Share Your Achievements
          </h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Add your certificates to LinkedIn, share on social media, or include them in your resume to showcase your cybersecurity expertise.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <ModernButton variant="primary" size="lg">
              <ExternalLink className="mr-2 h-5 w-5" />
              Add to LinkedIn
            </ModernButton>
            <ModernButton variant="outline" size="lg">
              <Share2 className="mr-2 h-5 w-5" />
              Share on Twitter
            </ModernButton>
            <ModernButton variant="glass" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download All
            </ModernButton>
          </div>
        </div>
      </div>
    </div>
  )
})

CertificatesPage.displayName = 'CertificatesPage'
export default CertificatesPage