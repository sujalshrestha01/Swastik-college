import { Navigate } from "react-router";
import { useSettings } from "../context/SettingsContext";

/**
 * Wrap any section/component with this to make it toggleable from the admin
 * "Page & Section Visibility" screen. Renders nothing when the admin has
 * turned that section (or its parent page) off.
 *
 *   <Section page="about" section="journey">
 *     <OurJourney />
 *   </Section>
 */
export function Section({ page, section, children }) {
  const { isSectionVisible, loading } = useSettings();
  if (loading) return children; // avoid a flash-of-hidden-content before settings load
  if (!isSectionVisible(page, section)) return null;
  return children;
}

/**
 * Wrap a whole page's route element with this to make the entire page
 * toggleable. Redirects to home when the page has been disabled.
 *
 *   <Route path="/about" element={<PageGate page="about"><About /></PageGate>} />
 */
export function PageGate({ page, children, redirectTo = "/" }) {
  const { isPageEnabled, loading } = useSettings();
  if (loading) return children;
  if (!isPageEnabled(page)) return <Navigate to={redirectTo} replace />;
  return children;
}
