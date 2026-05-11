import { StaticPage, Section } from './StaticPageHelpers';
import pageIcon from '../../../assets/icons/page-privacy.png';

export default function PrivacyPage() {
  return (
    <StaticPage icon={pageIcon} title="Privacy Policy" subtitle="Last updated: January 2026">
      <Section title="Information We Collect">
        We collect only the information you provide when creating an account (name, email)
        and the actions you take on the platform (recipes viewed, saved, rated).
        We do not sell your data to third parties.
      </Section>
      <Section title="How We Use Your Data">
        Your data is used solely to personalize your experience — such as recipe recommendations
        based on your browsing history and favorite categories.
      </Section>
      <Section title="Cookies">
        We use minimal cookies to keep you logged in and remember your preferences.
        No advertising cookies are used.
      </Section>
      <Section title="Your Rights">
        You can request deletion of your account and all associated data at any time
        by contacting us at hello@sweetandtreat.com.
      </Section>
    </StaticPage>
  );
}
