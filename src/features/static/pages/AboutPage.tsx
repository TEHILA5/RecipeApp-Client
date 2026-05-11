import { StaticPage, Section } from './StaticPageHelpers';
import pageIcon from '../../../assets/icons/page-about.png';

export default function AboutPage() {
  return (
    <StaticPage icon={pageIcon} title="About Us" subtitle="The story behind Sweet&Treat">
      <Section title="Who We Are">
        Sweet&Treat is a passion project born from a love of baking and sharing.
        We believe every dessert tells a story — and we're here to help you tell yours.
        Whether you're a seasoned pastry chef or a curious beginner, there's a recipe here for you.
      </Section>
      <Section title="Our Mission">
        To make the art of dessert-making accessible, joyful, and delicious for everyone.
        We curate recipes with care, test every technique, and celebrate every sweet creation.
      </Section>
      <Section title="The Team">
        We're a small team of dessert enthusiasts, home bakers, and flavor chasers.
        United by one belief: life is sweeter with a good recipe.
      </Section>
    </StaticPage>
  );
}
