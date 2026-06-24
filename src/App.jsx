import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#f1ede4', color: '#1b1a17', overflowX: 'hidden' }}>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:modelId" element={<ModelDetailPage />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/datasets/:datasetId" element={<DatasetDetailPage />} />
          <Route path="/benchmarks" element={<BenchmarksPage />} />
          <Route path="/benchmarks/:benchmarkId" element={<BenchmarkDetailPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/apps/:appId" element={<AppDetailPage />} />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
