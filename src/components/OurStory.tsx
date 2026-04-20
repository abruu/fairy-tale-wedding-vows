
import React from 'react';
import { Heart } from 'lucide-react';

interface StoryItem {
  date: string;
  content: string;
}

interface OurStoryProps {
  items: StoryItem[];
}

const OurStory: React.FC<OurStoryProps> = ({ items }) => {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="relative">
        {/* Central line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(183,110,121,0.35) 10%, rgba(183,110,121,0.35) 90%, transparent)',
            transform: 'translateX(-50%)',
          }}
          aria-hidden="true"
        />
        {/* Mobile left line */}
        <div
          className="absolute left-5 top-0 bottom-0 w-px md:hidden"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(183,110,121,0.35) 10%, rgba(183,110,121,0.35) 90%, transparent)',
          }}
          aria-hidden="true"
        />

        <div className="space-y-8 md:space-y-10">
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                className="relative flex items-start"
                data-aos={isLeft ? 'fade-right' : 'fade-left'}
                data-aos-delay={80 + index * 60}
                data-aos-duration="700"
              >
                {/* Desktop: alternating layout */}
                <div className="hidden md:grid grid-cols-2 gap-8 w-full items-center">
                  {/* Left column */}
                  <div className={isLeft ? 'text-right' : 'flex justify-end'}>
                    {isLeft ? (
                      <div className="wedding-card p-5 inline-block text-left max-w-xs">
                        <span
                          className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                          style={{ color: '#B76E79' }}
                        >
                          {item.date}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: '#5A3E3E' }}>
                          {item.content}
                        </p>
                      </div>
                    ) : (
                      <span
                        className="text-sm font-semibold text-right"
                        style={{ color: '#B76E79' }}
                      >
                        {item.date}
                      </span>
                    )}
                  </div>

                  {/* Center dot */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
                    style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="timeline-dot flex items-center justify-center" style={{ width: 28, height: 28 }}>
                      <Heart size={12} fill="#fff" stroke="none" />
                    </div>
                  </div>

                  {/* Right column */}
                  <div className={!isLeft ? 'text-left' : 'flex items-center'}>
                    {!isLeft ? (
                      <div className="wedding-card p-5 inline-block max-w-xs">
                        <span
                          className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                          style={{ color: '#B76E79' }}
                        >
                          {item.date}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: '#5A3E3E' }}>
                          {item.content}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold" style={{ color: '#B76E79' }}>
                        {item.date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mobile: stacked layout */}
                <div className="md:hidden flex items-start gap-4 w-full pl-10">
                  {/* Mobile dot */}
                  <div
                    className="timeline-dot absolute left-[10px] flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ width: 24, height: 24, top: '0.15rem' }}
                  >
                    <Heart size={10} fill="#fff" stroke="none" />
                  </div>

                  <div className="wedding-card p-4 flex-1">
                    <span
                      className="block text-xs font-semibold uppercase tracking-widest mb-1"
                      style={{ color: '#B76E79' }}
                    >
                      {item.date}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: '#5A3E3E' }}>
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurStory;

