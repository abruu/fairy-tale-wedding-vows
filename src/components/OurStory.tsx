
import React from 'react';

interface StoryItem {
  date: string;
  content: string;
}

interface OurStoryProps {
  items: StoryItem[];
}

const OurStory: React.FC<OurStoryProps> = ({ items }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative pl-8">
        {/* Removed space-y-8 to eliminate gaps */}
        {items.map((item, index) => (
          <div 
            key={index} 
            className="relative border-l-2 border-accent/40 pl-6 pb-2"
            data-aos="fade-up"
            data-aos-delay={100 + index * 50}
            data-aos-duration="900"
          >
            {/* Adjusted dot position and added connecting line styling */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-2 border-background z-10"></div>
            <div className="text-primary font-medium mb-1">{item.date}</div>
            <p className="text-text mb-4">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurStory;
