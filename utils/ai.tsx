// Simulated AI services
export const aiService = {
  generateSummary: async (content: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple summary generation (in real app, this would call OpenAI/Hugging Face)
    const sentences = content.split('. ').slice(0, 3);
    return sentences.join('. ') + (sentences.length === 3 ? '.' : '');
  },

  generateSeoTitles: async (content: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const firstWords = content.split(' ').slice(0, 5).join(' ');
    return [
      `${firstWords}: A Complete Guide`,
      `Master ${firstWords} in 2025`,
      `Everything You Need to Know About ${firstWords}`,
      `${firstWords}: Best Practices and Tips`
    ];
  },

  generateTags: async (content: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const commonTags = ['JavaScript', 'React', 'Node.js', 'Web Development', 'Frontend', 'Backend', 'API', 'Database', 'CSS', 'HTML'];
    const contentLower = content.toLowerCase();
    
    return commonTags.filter(tag => 
      contentLower.includes(tag.toLowerCase())
    ).slice(0, 5);
  },

  generateKeywords: async (content: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  },

  calculateReadTime: (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  },

  moderateContent: async (content: string): Promise<{ isAppropriate: boolean; flags: string[] }> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const inappropriateWords = ['spam', 'hate', 'offensive'];
    const flags = inappropriateWords.filter(word => 
      content.toLowerCase().includes(word)
    );
    
    return {
      isAppropriate: flags.length === 0,
      flags
    };
  }
};