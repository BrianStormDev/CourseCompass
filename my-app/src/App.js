import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Send, Calendar, TrendingUp } from 'lucide-react';
import './App.css';

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
    { date: '2024-06-15', 'Transformers': 245, 'Diffusion Models': 189, 'Reinforcement Learning': 156, 'Computer Vision': 201, 'NLP': 234 },
    { date: '2024-06-16', 'Transformers': 251, 'Diffusion Models': 195, 'Reinforcement Learning': 163, 'Computer Vision': 198, 'NLP': 241 },
    { date: '2024-06-17', 'Transformers': 248, 'Diffusion Models': 203, 'Reinforcement Learning': 171, 'Computer Vision': 205, 'NLP': 238 },
    { date: '2024-06-18', 'Transformers': 263, 'Diffusion Models': 198, 'Reinforcement Learning': 158, 'Computer Vision': 212, 'NLP': 245 },
    { date: '2024-06-19', 'Transformers': 270, 'Diffusion Models': 215, 'Reinforcement Learning': 174, 'Computer Vision': 208, 'NLP': 252 },
    { date: '2024-06-20', 'Transformers': 275, 'Diffusion Models': 221, 'Reinforcement Learning': 169, 'Computer Vision': 219, 'NLP': 258 },
    { date: '2024-06-21', 'Transformers': 282, 'Diffusion Models': 228, 'Reinforcement Learning': 181, 'Computer Vision': 225, 'NLP': 264 }
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

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
  const keywords = ['Transformers', 'Diffusion Models', 'Reinforcement Learning', 'Computer Vision', 'NLP'];

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
            <div className="ml-tracker-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{ value: 'Papers Published', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
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
