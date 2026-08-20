import type { Metadata } from 'next';
import { Award, Layers, Target, Compass } from 'lucide-react';
import { ImageContainer } from '@/components/shared/ImageContainer';

export const metadata: Metadata = {
  title: 'About Our Plant | Twinplast Polymers',
  description: 'Twinplast Polymers Private Limited was established in 2021 in Thoothukudi, Tamil Nadu, as a dedicated polypropylene (PP) sheets manufacturer.',
};

export default function AboutPage() {
  const companyStrengths = [
    { title: 'Modern Extrusion', desc: 'Operating advanced polymer extrusion machines to achieve accurate sheet finishes.', icon: Layers },
    { title: 'Quality Controls', desc: 'Consistent testing procedures safeguarding structural and visual parameters.', icon: Award },
  ];

  return (
    <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-4xl space-y-12">
        
        {/* Section Header */}
        <div className="text-center sm:text-left space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Twinplast Story
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            About Twinplast Polymers
          </h1>
          <p className="text-base text-muted max-w-2xl">
            Established in 2021 &bull; Plant Location in Thoothukudi, Tamil Nadu, India
          </p>
        </div>

        {/* Plant Facade image with locking aspect */}
        <ImageContainer
          src="brand/twinplast-plant-facade"
          alt="Twinplast Polymers Manufacturing plant in Thoothukudi"
          aspectRatio="video"
          priority
        />

        {/* Factual Narrative Panels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Our Extrusion History</h2>
            <p className="text-sm text-muted leading-relaxed">
              Twinplast Polymers Private Limited commenced manufacturing operations in 2021 in the industrial hub of Thoothukudi, Tamil Nadu. Our core focus centers on fabricating robust polypropylene (PP) sheets designed to support commercial packaging, stack warehousing partitions, and heavy floor guard shields.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Operating with an customer-centric model, our engineering departments custom-calibrate GSM weights, dimensions, colors, and thicknesses to align with B2B shipping or material handling specifications. We serve key logistics, construction, and advertising entities across local and national channels.
            </p>
          </div>

          <div className="md:col-span-5 bg-surface border border-surface-border p-6 rounded-xl shadow-sm space-y-6">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Plant Values</h3>
            <div className="space-y-4">
              {companyStrengths.map((str) => (
                <div key={str.title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <str.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{str.title}</h4>
                    <p className="text-xs text-muted mt-1 leading-normal">{str.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-secondary/50 pt-12">
          <div className="bg-surface border border-surface-border p-8 rounded-xl shadow-sm space-y-4 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center">
              <Compass className="w-5 h-5 text-accent-green" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Our Vision</h3>
            <p className="text-sm text-muted leading-relaxed flex-1">
              To become a trusted and leading PP sheet manufacturing company in India, recognised for quality products, customer satisfaction, innovation and dependable service.
            </p>
          </div>
          <div className="bg-surface border border-surface-border p-8 rounded-xl shadow-sm space-y-4 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Our Mission</h3>
            <p className="text-sm text-muted leading-relaxed flex-1">
              To manufacture and supply high-performance PP sheet products that provide value, durability and reliability to customers while continuously improving manufacturing capabilities and product range.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
