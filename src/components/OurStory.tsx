
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
      <div className="relative pl-8 space-y-8">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="relative border-l-2 border-accent/40 pl-6 pb-8 last:pb-0"
            data-aos="fade-up"
            data-aos-delay={100 + index * 50}
            data-aos-duration="900"
          >
            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-accent border-2 border-background"></div>
            <div className="text-primary font-medium mb-2">{item.date}</div>
            <p className="text-text">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurStory;
