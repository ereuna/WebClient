import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Nav from './components/Nav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ModelsPage from './pages/ModelsPage'
import ModelDetailPage from './pages/ModelDetailPage'
import DatasetsPage from './pages/DatasetsPage'
import DatasetDetailPage from './pages/DatasetDetailPage'
import BenchmarksPage from './pages/BenchmarksPage'
import BenchmarkDetailPage from './pages/BenchmarkDetailPage'
import AppsPage from './pages/AppsPage'
import AppDetailPage from './pages/AppDetailPage'
import DocsPage from './pages/DocsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NewRepositoryPage from './pages/NewRepositoryPage'
import UploadFilesPage from './pages/UploadFilesPage'
import DashboardPage from './pages/DashboardPage'
import SearchPage from './pages/SearchPage'
import RepositoriesPage from './pages/RepositoriesPage'
import RepositoryDetailPage from './pages/RepositoryDetailPage'
import PipelinesPage from './pages/PipelinesPage'
import PipelineDetailPage from './pages/PipelineDetailPage'
import ExperimentsPage from './pages/ExperimentsPage'
import ExperimentDetailPage from './pages/ExperimentDetailPage'
import DeploymentsPage from './pages/DeploymentsPage'
import DeploymentDetailPage from './pages/DeploymentDetailPage'
import InferenceStudioPage from './pages/InferenceStudioPage'
import OrganizationsPage from './pages/OrganizationsPage'
import OrganizationDetailPage from './pages/OrganizationDetailPage'
import SettingsPage from './pages/SettingsPage'
import NotificationsPage from './pages/NotificationsPage'
import UserProfilePage from './pages/UserProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth pages — no Nav/Footer chrome */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* All other pages share the shell */}
          <Route path="*" element={
            <div style={{ background: '#f1ede4', color: '#1b1a17', overflowX: 'hidden' }}>
              <Nav />
              <Routes>
                <Route path="/" element={<HomePage />} />

                {/* Core platform */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/new" element={<NewRepositoryPage />} />

                {/* Models */}
                <Route path="/models" element={<ModelsPage />} />
                <Route path="/models/:modelId" element={<ModelDetailPage />} />
                <Route path="/models/:slug/upload" element={<UploadFilesPage />} />

                {/* Datasets */}
                <Route path="/datasets" element={<DatasetsPage />} />
                <Route path="/datasets/:datasetId" element={<DatasetDetailPage />} />
                <Route path="/datasets/:slug/upload" element={<UploadFilesPage />} />

                {/* Benchmarks */}
                <Route path="/benchmarks" element={<BenchmarksPage />} />
                <Route path="/benchmarks/:benchmarkId" element={<BenchmarkDetailPage />} />

                {/* Spaces (Apps) */}
                <Route path="/apps" element={<AppsPage />} />
                <Route path="/apps/:appId" element={<AppDetailPage />} />

                {/* Docs */}
                <Route path="/docs" element={<DocsPage />} />

                {/* Repositories */}
                <Route path="/repositories" element={<RepositoriesPage />} />

                {/* Pipelines */}
                <Route path="/pipelines" element={<PipelinesPage />} />
                <Route path="/pipelines/:pipelineId" element={<PipelineDetailPage />} />

                {/* Experiments */}
                <Route path="/experiments" element={<ExperimentsPage />} />
                <Route path="/experiments/:expId" element={<ExperimentDetailPage />} />

                {/* Deployments */}
                <Route path="/deployments" element={<DeploymentsPage />} />
                <Route path="/deployments/:deployId" element={<DeploymentDetailPage />} />

                {/* Inference Studio */}
                <Route path="/inference" element={<InferenceStudioPage />} />

                {/* Organizations */}
                <Route path="/organizations" element={<OrganizationsPage />} />
                <Route path="/organizations/:orgSlug" element={<OrganizationDetailPage />} />

                {/* Owner/repo pattern — must come after all named top-level routes */}
                <Route path="/:owner/:repo" element={<RepositoryDetailPage />} />

                {/* User profile — catch-all, must be very last */}
                <Route path="/:username" element={<UserProfilePage />} />
              </Routes>
              <Footer />
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
