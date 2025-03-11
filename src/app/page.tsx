import AddressSection from './components/AddressSection';
import PromotionSection from './components/PromotionSection';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/BenefitsSection';
import { NewProductsSection } from './components/NewProductsSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BenefitsSection />
      <NewProductsSection />
      <PromotionSection />
      <AddressSection />
    </main>
  );
}
