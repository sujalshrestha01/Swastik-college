import Hero from '../components/Hero';
import QuickAccessCards from '../components/QuickAccessCards';
import MetricsCounter from '../components/MetricsCounter';
import ProgramsOverview from '../components/ProgramsOverview';
import EventCountdown from '../components/EventCountdown';
import NewsEvents from '../components/NewsEvents';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickAccessCards />
      <MetricsCounter />
      <ProgramsOverview />
      <EventCountdown />
      <NewsEvents />
      <Testimonials />
    </>
  );
}
