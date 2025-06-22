import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Send, Calendar, TrendingUp } from 'lucide-react';
import './App.css';
// import Chart from './Chart.js';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('2024-06-21');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! Ask me anything about the recent ML research papers and trends.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  // Sample data - in real implementation, this would come from Python backend
  const [trendData, setTrendData] = useState([
  {
    "date": "2025-03-24",
    "AI Security and Adversarial Defense": 11,
    "Causal Inference and Treatment Effects": 3,
    "Cross-lingual Reasoning and SQL Tasks": 28,
    "Emotion and Voice Recognition": 21,
    "Graph Representations and Network Analysis": 3,
    "Neuromorphic and Chemical Modeling": 8,
    "Non-Euclidean Clustering and Learning": 1,
    "Optimization and Scheduling Algorithms": 3,
    "Reinforcement Learning and Bandits": 3,
    "Topic -1": 33,
    "Weather Prediction and Renewable Energy": 3,
    "Wireless Communication and Signal Processing": 1
  },
  {
    "date": "2025-03-25",
    "AI Security and Adversarial Defense": 13,
    "Causal Inference and Treatment Effects": 6,
    "Cross-lingual Reasoning and SQL Tasks": 56,
    "Emotion and Voice Recognition": 71,
    "Graph Representations and Network Analysis": 5,
    "Neuromorphic and Chemical Modeling": 23,
    "Non-Euclidean Clustering and Learning": 1,
    "Optimization and Scheduling Algorithms": 1,
    "Reinforcement Learning and Bandits": 8,
    "Topic -1": 95,
    "Weather Prediction and Renewable Energy": 9,
    "Wireless Communication and Signal Processing": 2
  },
  {
    "date": "2025-03-26",
    "AI Security and Adversarial Defense": 13,
    "Causal Inference and Treatment Effects": 3,
    "Cross-lingual Reasoning and SQL Tasks": 36,
    "Emotion and Voice Recognition": 28,
    "Graph Representations and Network Analysis": 2,
    "Neuromorphic and Chemical Modeling": 7,
    "Non-Euclidean Clustering and Learning": 2,
    "Optimization and Scheduling Algorithms": 1,
    "Reinforcement Learning and Bandits": 3,
    "Topic -1": 55,
    "Weather Prediction and Renewable Energy": 2,
    "Wireless Communication and Signal Processing": 2
  },
  {
    "date": "2025-03-27",
    "AI Security and Adversarial Defense": 2,
    "Causal Inference and Treatment Effects": 2,
    "Cross-lingual Reasoning and SQL Tasks": 11,
    "Emotion and Voice Recognition": 12,
    "Graph Representations and Network Analysis": 3,
    "Neuromorphic and Chemical Modeling": 6,
    "Non-Euclidean Clustering and Learning": 2,
    "Optimization and Scheduling Algorithms": 1,
    "Reinforcement Learning and Bandits": 3,
    "Topic -1": 14,
    "Weather Prediction and Renewable Energy": 1,
    "Wireless Communication and Signal Processing": 2
  },
  {
    "date": "2025-03-28",
    "AI Security and Adversarial Defense": 5,
    "Causal Inference and Treatment Effects": 4,
    "Cross-lingual Reasoning and SQL Tasks": 28,
    "Emotion and Voice Recognition": 14,
    "Graph Representations and Network Analysis": 1,
    "Neuromorphic and Chemical Modeling": 9,
    "Non-Euclidean Clustering and Learning": 1,
    "Optimization and Scheduling Algorithms": 1,
    "Reinforcement Learning and Bandits": 2,
    "Topic -1": 30,
    "Weather Prediction and Renewable Energy": 5,
    "Wireless Communication and Signal Processing": 1
  },
  {
    "date": "2025-03-29",
    "AI Security and Adversarial Defense": 2,
    "Causal Inference and Treatment Effects": 3,
    "Cross-lingual Reasoning and SQL Tasks": 1,
    "Emotion and Voice Recognition": 4,
    "Graph Representations and Network Analysis": 2,
    "Neuromorphic and Chemical Modeling": 1,
    "Non-Euclidean Clustering and Learning": 1,
    "Optimization and Scheduling Algorithms": 2,
    "Reinforcement Learning and Bandits": 12,
    "Topic -1": 7,
    "Weather Prediction and Renewable Energy": 1,
    "Wireless Communication and Signal Processing": 1
  },
  {
    "date": "2025-03-30",
    "AI Security and Adversarial Defense": 11,
    "Causal Inference and Treatment Effects": 3,
    "Cross-lingual Reasoning and SQL Tasks": 33,
    "Emotion and Voice Recognition": 35,
    "Graph Representations and Network Analysis": 1,
    "Neuromorphic and Chemical Modeling": 19,
    "Non-Euclidean Clustering and Learning": 1,
    "Optimization and Scheduling Algorithms": 1,
    "Reinforcement Learning and Bandits": 1,
    "Topic -1": 63,
    "Weather Prediction and Renewable Energy": 3,
    "Wireless Communication and Signal Processing": 5
  },
  {
    "date": "2025-03-31",
    "AI Security and Adversarial Defense": 9,
    "Causal Inference and Treatment Effects": 1,
    "Cross-lingual Reasoning and SQL Tasks": 27,
    "Emotion and Voice Recognition": 15,
    "Graph Representations and Network Analysis": 1,
    "Neuromorphic and Chemical Modeling": 6,
    "Non-Euclidean Clustering and Learning": 1,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 5,
    "Topic -1": 38,
    "Weather Prediction and Renewable Energy": 1,
    "Wireless Communication and Signal Processing": 1
  },
  {
    "date": "2025-04-01",
    "AI Security and Adversarial Defense": 7,
    "Causal Inference and Treatment Effects": 3,
    "Cross-lingual Reasoning and SQL Tasks": 19,
    "Emotion and Voice Recognition": 16,
    "Graph Representations and Network Analysis": 4,
    "Neuromorphic and Chemical Modeling": 11,
    "Non-Euclidean Clustering and Learning": 1,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 10,
    "Topic -1": 39,
    "Weather Prediction and Renewable Energy": 2,
    "Wireless Communication and Signal Processing": 1
  },
  {
    "date": "2025-04-02",
    "AI Security and Adversarial Defense": 5,
    "Causal Inference and Treatment Effects": 1,
    "Cross-lingual Reasoning and SQL Tasks": 17,
    "Emotion and Voice Recognition": 15,
    "Graph Representations and Network Analysis": 4,
    "Neuromorphic and Chemical Modeling": 8,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 20,
    "Topic -1": 34,
    "Weather Prediction and Renewable Energy": 4,
    "Wireless Communication and Signal Processing": 1
  },
  {
    "date": "2025-04-03",
    "AI Security and Adversarial Defense": 4,
    "Causal Inference and Treatment Effects": 4,
    "Cross-lingual Reasoning and SQL Tasks": 1,
    "Emotion and Voice Recognition": 2,
    "Graph Representations and Network Analysis": 2,
    "Neuromorphic and Chemical Modeling": 1,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 8,
    "Topic -1": 10,
    "Weather Prediction and Renewable Energy": 1,
    "Wireless Communication and Signal Processing": 1
  },
  {
    "date": "2025-04-04",
    "AI Security and Adversarial Defense": 15,
    "Causal Inference and Treatment Effects": 4,
    "Cross-lingual Reasoning and SQL Tasks": 55,
    "Emotion and Voice Recognition": 54,
    "Graph Representations and Network Analysis": 2,
    "Neuromorphic and Chemical Modeling": 33,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 15,
    "Topic -1": 91,
    "Weather Prediction and Renewable Energy": 4,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-05",
    "AI Security and Adversarial Defense": 10,
    "Causal Inference and Treatment Effects": 2,
    "Cross-lingual Reasoning and SQL Tasks": 37,
    "Emotion and Voice Recognition": 32,
    "Graph Representations and Network Analysis": 1,
    "Neuromorphic and Chemical Modeling": 21,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 5,
    "Topic -1": 73,
    "Weather Prediction and Renewable Energy": 6,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-06",
    "AI Security and Adversarial Defense": 14,
    "Causal Inference and Treatment Effects": 1,
    "Cross-lingual Reasoning and SQL Tasks": 43,
    "Emotion and Voice Recognition": 34,
    "Graph Representations and Network Analysis": 2,
    "Neuromorphic and Chemical Modeling": 12,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 3,
    "Topic -1": 70,
    "Weather Prediction and Renewable Energy": 5,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-07",
    "AI Security and Adversarial Defense": 2,
    "Causal Inference and Treatment Effects": 3,
    "Cross-lingual Reasoning and SQL Tasks": 14,
    "Emotion and Voice Recognition": 25,
    "Graph Representations and Network Analysis": 4,
    "Neuromorphic and Chemical Modeling": 2,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 2,
    "Topic -1": 24,
    "Weather Prediction and Renewable Energy": 1,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-08",
    "AI Security and Adversarial Defense": 2,
    "Causal Inference and Treatment Effects": 7,
    "Cross-lingual Reasoning and SQL Tasks": 25,
    "Emotion and Voice Recognition": 26,
    "Graph Representations and Network Analysis": 2,
    "Neuromorphic and Chemical Modeling": 15,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 10,
    "Topic -1": 47,
    "Weather Prediction and Renewable Energy": 3,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-09",
    "AI Security and Adversarial Defense": 4,
    "Causal Inference and Treatment Effects": 0,
    "Cross-lingual Reasoning and SQL Tasks": 24,
    "Emotion and Voice Recognition": 23,
    "Graph Representations and Network Analysis": 3,
    "Neuromorphic and Chemical Modeling": 8,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 9,
    "Topic -1": 38,
    "Weather Prediction and Renewable Energy": 3,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-10",
    "AI Security and Adversarial Defense": 17,
    "Causal Inference and Treatment Effects": 0,
    "Cross-lingual Reasoning and SQL Tasks": 45,
    "Emotion and Voice Recognition": 37,
    "Graph Representations and Network Analysis": 6,
    "Neuromorphic and Chemical Modeling": 15,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 5,
    "Topic -1": 73,
    "Weather Prediction and Renewable Energy": 5,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-11",
    "AI Security and Adversarial Defense": 8,
    "Causal Inference and Treatment Effects": 0,
    "Cross-lingual Reasoning and SQL Tasks": 42,
    "Emotion and Voice Recognition": 52,
    "Graph Representations and Network Analysis": 2,
    "Neuromorphic and Chemical Modeling": 18,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 10,
    "Topic -1": 57,
    "Weather Prediction and Renewable Energy": 4,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-12",
    "AI Security and Adversarial Defense": 10,
    "Causal Inference and Treatment Effects": 0,
    "Cross-lingual Reasoning and SQL Tasks": 49,
    "Emotion and Voice Recognition": 32,
    "Graph Representations and Network Analysis": 2,
    "Neuromorphic and Chemical Modeling": 13,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 13,
    "Topic -1": 77,
    "Weather Prediction and Renewable Energy": 3,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-13",
    "AI Security and Adversarial Defense": 22,
    "Causal Inference and Treatment Effects": 0,
    "Cross-lingual Reasoning and SQL Tasks": 71,
    "Emotion and Voice Recognition": 62,
    "Graph Representations and Network Analysis": 9,
    "Neuromorphic and Chemical Modeling": 17,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 6,
    "Topic -1": 105,
    "Weather Prediction and Renewable Energy": 2,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-14",
    "AI Security and Adversarial Defense": 14,
    "Causal Inference and Treatment Effects": 0,
    "Cross-lingual Reasoning and SQL Tasks": 45,
    "Emotion and Voice Recognition": 44,
    "Graph Representations and Network Analysis": 0,
    "Neuromorphic and Chemical Modeling": 17,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 28,
    "Topic -1": 82,
    "Weather Prediction and Renewable Energy": 14,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-15",
    "AI Security and Adversarial Defense": 11,
    "Causal Inference and Treatment Effects": 0,
    "Cross-lingual Reasoning and SQL Tasks": 45,
    "Emotion and Voice Recognition": 34,
    "Graph Representations and Network Analysis": 0,
    "Neuromorphic and Chemical Modeling": 12,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 0,
    "Topic -1": 60,
    "Weather Prediction and Renewable Energy": 0,
    "Wireless Communication and Signal Processing": 0
  },
  {
    "date": "2025-04-16",
    "AI Security and Adversarial Defense": 21,
    "Causal Inference and Treatment Effects": 0,
    "Cross-lingual Reasoning and SQL Tasks": 105,
    "Emotion and Voice Recognition": 96,
    "Graph Representations and Network Analysis": 0,
    "Neuromorphic and Chemical Modeling": 54,
    "Non-Euclidean Clustering and Learning": 0,
    "Optimization and Scheduling Algorithms": 0,
    "Reinforcement Learning and Bandits": 0,
    "Topic -1": 163,
    "Weather Prediction and Renewable Energy": 0,
    "Wireless Communication and Signal Processing": 0
  }
]);

  const [arxivLinks, setArxivLinks] = useState([
    { title: 'Attention Is All You Need: A Comprehensive Survey', id: '2406.12345', url: 'https://arxiv.org/abs/2406.12345' },
    { title: 'Scaling Laws for Neural Language Models in 2024', id: '2406.12346', url: 'https://arxiv.org/abs/2406.12346' },
    { title: 'Diffusion Models: Theory and Applications', id: '2406.12347', url: 'https://arxiv.org/abs/2406.12347' },
    { title: 'Reinforcement Learning with Human Feedback', id: '2406.12348', url: 'https://arxiv.org/abs/2406.12348' },
    { title: 'Vision Transformers: The Next Generation', id: '2406.12349', url: 'https://arxiv.org/abs/2406.12349' }
  ]);

  const [blogPost, setBlogPost] = useState(`# ML Research Trends - June 21, 2024

## Weekly Summary

This week has shown remarkable growth in transformer-based research, with a 15% increase in publications compared to last week. The surge is primarily driven by new architectural innovations and efficiency improvements.

**Key Highlights:**

Transformer research continues to dominate the landscape with 282 new papers, focusing heavily on efficiency improvements and novel attention mechanisms. The community is particularly excited about sparse attention patterns and their applications to longer sequences.
Diffusion models have seen steady growth with 228 publications, with particular emphasis on controllable generation and faster sampling techniques. Several breakthrough papers have introduced novel noise scheduling approaches.

**Looking Ahead:**

The upcoming ICML conference submissions are likely driving increased publication activity. We expect to see continued growth in multimodal research and practical applications of recent theoretical advances.

## Detailed Analysis

### Transformer Architecture Innovations

The transformer architecture continues to evolve at a rapid pace, with researchers exploring new attention mechanisms, positional encodings, and efficiency improvements. Recent papers have focused on:

### Diffusion Model Breakthroughs

Diffusion models have established themselves as a cornerstone of generative AI, with significant improvements in both quality and efficiency:

### Computer Vision Advances

The computer vision field continues to benefit from transformer architectures while exploring new paradigms:

### Natural Language Processing Evolution

NLP research shows remarkable diversity in applications and methodologies:

### Reinforcement Learning Progress

Though smaller in volume, RL research demonstrates significant quality improvements:

- Sample-efficient algorithms for real-world deployment
- Multi-agent systems for complex coordination tasks
- Integration with large language models for enhanced decision-making
- Applications in robotics and autonomous systems`);

  // Auto-scroll effect
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, loading]);

  // API Integration functions - these would connect to your Python backend
  const fetchDataForDate = async (date) => {
    setLoading(true);
    try {
      // Replace with actual API call to Python backend
      const response = await fetch(`/api/trends?date=${date}`);
      const data = await response.json();
      
      setTrendData(data.trends);
      setArxivLinks(data.articles);
      setBlogPost(data.blogPost);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setLoading(true);

    console.log(userMessage);

    try {
      // Replace with actual API call to Python backend
      const response = await fetch('/api/claudeChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: chatInput,
          context: { date: selectedDate, articles: arxivLinks, initial: "Don't use Markdown in your responses. Start with short response and expand if requested"}
        })
      });
      
      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSubmit = () => {
    fetchDataForDate(selectedDate);
  };

  // useEffect(() => {
  //   const fetchTrendData = async () => {
  //     try {
  //       const response = await fetch('/api/trend_data', {
  //         method: 'GET'
  //       });

  //       const arrayFromBackend = await response.json();  // get JSON array
  //       console.log('Received:', arrayFromBackend);
  //       setTrendData(arrayFromBackend);  // store it in state
  //     } catch (err) {
  //       console.error('Failed to fetch trend data:', err);
  //     }
  //   };

  //   fetchTrendData();
  // }, []);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#14B8A6', '#6366F1', '#E11D48', '#22C55E'];
  const keywords = [
    "AI Security and Adversarial Defense",
    "Causal Inference and Treatment Effects",
    "Cross-lingual Reasoning and SQL Tasks",
    "Emotion and Voice Recognition",
    "Graph Representations and Network Analysis",
    "Neuromorphic and Chemical Modeling",
    "Non-Euclidean Clustering and Learning",
    "Optimization and Scheduling Algorithms",
    "Reinforcement Learning and Bandits",
  ];

  return (
    <div className="ml-tracker">
      {/* Header */}
      <div className="ml-tracker-header">
        <div className="ml-tracker-header-content">
          <h1 className="ml-tracker-title">
            <TrendingUp color="#60a5fa" size={42} />
            ML Research Trend Tracker
          </h1>
          <p className="ml-tracker-subtitle">
            Real-time analysis of machine learning research trends
          </p>
        </div>
      </div>

      <div className="ml-tracker-main">
        {/* Top Section - Three Equal Columns */}
        <div className="ml-tracker-top-section">
          
          {/* Left Column - ArXiv Links */}
          <div className="ml-tracker-card ml-tracker-papers-column">
            <h2 className="ml-tracker-section-title ml-tracker-papers-title">
              Featured Papers
            </h2>
            <div className="ml-tracker-papers-list">
              {arxivLinks.map((paper, index) => (
                <div key={paper.id}>
                  <a 
                    href={paper.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-tracker-paper-link"
                  >
                    <div className="ml-tracker-paper-title">
                      {paper.title}
                    </div>
                    <div className="ml-tracker-paper-id">
                      arXiv:{paper.id}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - Chart */}
          <div className="ml-tracker-card ml-tracker-chart-column">
            <h2 className="ml-tracker-section-title ml-tracker-chart-title">
              Research Trends
            </h2>

            {/* Set a fixed height to make ResponsiveContainer work */}
            <div className="ml-tracker-chart-container" style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    }
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{
                      value: 'Papers Published',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#9CA3AF' }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  {keywords.map((keyword, index) => (
                    <Line
                      key={keyword}
                      type="monotone"
                      dataKey={keyword}
                      stroke={colors[index]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Right Column - Chat */}
          <div className="ml-tracker-card ml-tracker-chat-column">
            <h2 className="ml-tracker-section-title ml-tracker-chat-title">
              Research Assistant
            </h2>
            
            {/* Chat Messages */}
            <div className="ml-tracker-chat-messages" ref={chatMessagesRef}>
              {chatMessages.map((message, index) => (
                <div 
                  key={index} 
                  className={`ml-tracker-message-container ${message.role}`}
                >
                  <div className={`ml-tracker-message ${message.role}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="ml-tracker-message-container assistant">
                  <div className="ml-tracker-message assistant">
                    <div className="ml-tracker-typing-indicator">
                      <div className="ml-tracker-typing-dot"></div>
                      <div className="ml-tracker-typing-dot"></div>
                      <div className="ml-tracker-typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="ml-tracker-chat-input-container">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask about the research..."
                className="ml-tracker-chat-input"
              />
              <button
                onClick={sendChatMessage}
                disabled={loading || !chatInput.trim()}
                className="ml-tracker-send-button"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Daily Research Summary - Full Width */}
        <div className="ml-tracker-summary-section">
          <h2 className="ml-tracker-summary-title">
            Daily Research Summary
          </h2>
          <div className="ml-tracker-summary-content">
            <pre className="ml-tracker-summary-text">{blogPost}</pre>
          </div>
        </div>

        {/* Time Travel - Centered */}
        <div className="ml-tracker-time-travel-container">
          <div className="ml-tracker-time-travel">
            <h2 className="ml-tracker-time-travel-title">
              <Calendar size={24} />
              Time Travel
            </h2>
            <div className="ml-tracker-time-travel-form">
              <div>
                <label className="ml-tracker-date-label">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="ml-tracker-date-input"
                />
              </div>
              <button
                onClick={handleDateSubmit}
                disabled={loading}
                className="ml-tracker-date-button"
              >
                {loading ? 'Loading...' : 'Go to Date'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
