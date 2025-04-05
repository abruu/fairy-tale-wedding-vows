// Wedding event configuration
export const WEDDING_CONFIG = {
  // Event dates in ISO format with timezone
  dates: {
    engagement: "2025-04-26T17:00:00+05:30", // 26th April 2025, 5:00 PM Indian time
    wedding: "2025-05-17T15:30:00+05:30",    // 17th May 2025, 3:30 PM
  },
  
  // Media configuration
  media: {
    // YouTube video ID or full embed URL
    youtubeUrl: "https://www.youtube.com/embed/jcN3MjzL4wk?autoplay=1",
    
    // Background music URL
    musicUrl: "/music/msuic1.mp3",
    
    // Fireworks configuration
    fireworks: {
      duration: 50000,      // Duration in milliseconds
      intensity: 7,        // Intensity level (1-10)
      startDelay: 500,      // Delay before starting in milliseconds
    }
  },
  
  // Feature flags to enable/disable features
  features: {
    autoPlayMusic: true,    // Auto-play music when page loads
    showFireworks: false,    // Show fireworks animation
    showVideo: false,       // Show YouTube video
    
    // Countdown completion triggers
    countdownTriggers: {
      enabled: true,        // Enable automatic triggers when countdown reaches zero
      showFireworks: true,  // Show fireworks when countdown reaches zero
      showVideo: true,      // Show video when countdown reaches zero (engagement only)
      fireworksDuration: 60000, // How long to show fireworks after countdown reaches zero
    }
  }
};
