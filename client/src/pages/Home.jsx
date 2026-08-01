import Hero from '../components/Hero';
import QuickAccessCards from '../components/QuickAccessCards';
import MetricsCounter from '../components/MetricsCounter';
import ProgramsOverview from '../components/ProgramsOverview';
import SwastikExperience from '../components/SwastikExperience';
import EventCountdown from '../components/EventCountdown';
import NewsEvents from '../components/NewsEvents';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import TakeATour from './TakeATour';
import PlacementPartners from './PlacementPartners';
import SisterInstitutes from './SisterInstitutes';
import WhyChooseUs from './WhyChooseUs';
import { Section } from '../components/Visibility';

export default function Home() {
  return (
    <>
      <Section page="home" section="hero"><Hero /></Section>
      <Section page="home" section="quickAccess"><QuickAccessCards /></Section>
      <Section page="home" section="whyChooseUs"><WhyChooseUs /></Section>
      <Section page="home" section="programsOverview"><ProgramsOverview /></Section>
      <Section page="home" section="swastikExperience"><SwastikExperience /></Section>

      <Section page="home" section="eventCountdown"><EventCountdown /></Section>
      <Section page="home" section="newsEvents"><NewsEvents /></Section>
      <Section page="home" section="takeATour"><TakeATour /></Section>
      <Section page="home" section="placementPartners"><PlacementPartners /></Section>
      <Section page="home" section="sisterInstitutes"><SisterInstitutes /></Section>
      <Section page="home" section="blog"><BlogSection /></Section>
    </>
  );
}
