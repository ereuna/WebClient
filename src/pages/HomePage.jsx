import Hero from '../components/Hero'
import EnergyGraph from '../components/EnergyGraph'
import ModelZoo from '../components/ModelZoo'
import FlagshipApps from '../components/FlagshipApps'
import TechnicalPositioning from '../components/TechnicalPositioning'
import RegionalContext from '../components/RegionalContext'
import Pipeline from '../components/Pipeline'
import CTA from '../components/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FlagshipApps />
      <EnergyGraph />
      <TechnicalPositioning />
      <RegionalContext />
      <ModelZoo />
      <Pipeline />
      <CTA />
    </>
  )
}
