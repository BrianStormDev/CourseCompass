import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Send, Calendar, TrendingUp } from 'lucide-react';

const MLResearchTracker = () => {
  const [selectedDate, setSelectedDate] = useState('2024-06-21');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! Ask me anything about the recent ML research papers and trends.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

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

Computer vision research maintains strong momentum at 225 papers, with vision transformers leading the charge. The integration of multimodal approaches is becoming increasingly prevalent.

Natural language processing shows robust activity with 264 papers, driven by advancements in large language models and their applications to specialized domains.

Reinforcement learning, while showing the smallest volume at 181 papers, demonstrates quality over quantity with several high-impact publications on sample efficiency and real-world applications.

**Looking Ahead:**

The upcoming ICML conference submissions are likely driving increased publication activity. We expect to see continued growth in multimodal research and practical applications of recent theoretical advances.

## Detailed Analysis

### Transformer Architecture Innovations

The transformer architecture continues to evolve at a rapid pace, with researchers exploring new attention mechanisms, positional encodings, and efficiency improvements. Recent papers have focused on:

- Sparse attention patterns for handling longer sequences
- Novel positional encoding schemes for better generalization
- Efficient implementations for resource-constrained environments
- Hybrid architectures combining transformers with other neural network types

### Diffusion Model Breakthroughs

Diffusion models have established themselves as a cornerstone of generative AI, with significant improvements in both quality and efficiency:

- Advanced noise scheduling techniques for better sample quality
- Controllable generation methods for precise content creation
- Faster sampling algorithms reducing inference time
- Applications beyond image generation to text, audio, and 3D content

### Computer Vision Advances

The computer vision field continues to benefit from transformer architectures while exploring new paradigms:

- Vision transformers achieving state-of-the-art results across multiple benchmarks
- Multimodal approaches combining vision and language understanding
- Self-supervised learning methods reducing dependency on labeled data
- Real-time applications in autonomous systems and robotics

### Natural Language Processing Evolution

NLP research shows remarkable diversity in applications and methodologies:

- Large language models becoming more specialized for domain-specific tasks
- Improved reasoning capabilities through better training techniques
- Multilingual models serving global communities
- Ethical AI considerations in language model development

### Reinforcement Learning Progress

Though smaller in volume, RL research demonstrates significant quality improvements:

- Sample-efficient algorithms for real-world deployment
- Multi-agent systems for complex coordination tasks
- Integration with large language models for enhanced decision-making
- Applications in robotics and autonomous systems`);

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

    try {
      // Replace with actual API call to Python backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: chatInput,
          context: { date: selectedDate, articles: arxivLinks }
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.3)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px 32px'
        }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: 0
          }}>
            <TrendingUp color="#60a5fa" size={42} />
            ML Research Trend Tracker
          </h1>
          <p style={{
            color: '#cbd5e1',
            fontSize: '18px',
            marginTop: '12px',
            margin: '12px 0 0 0'
          }}>Real-time analysis of machine learning research trends</p>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 32px'
      }}>
        {/* Top Section - Three Equal Columns */}
        <div style={{
          display: 'flex',
          gap: '32px',
          marginBottom: '32px',
          height: '600px'
        }}>
          
          {/* Left Column - ArXiv Links */}
          <div style={{
            width: '320px',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            padding: '28px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#f87171',
              margin: '0 0 24px 0'
            }}>
              Featured Papers
            </h2>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              flex: 1,
              overflowY: 'auto'
            }}>
              {arxivLinks.map((paper, index) => (
                <div key={paper.id}>
                  <a 
                    href={paper.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(51, 65, 85, 0.3)',
                      border: '1px solid rgba(71, 85, 105, 0.3)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(71, 85, 105, 0.4)';
                      e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.3)';
                      e.target.style.borderColor = 'rgba(71, 85, 105, 0.3)';
                    }}
                  >
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#93c5fd',
                      lineHeight: '1.4',
                      marginBottom: '8px'
                    }}>
                      {paper.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#94a3b8'
                    }}>arXiv:{paper.id}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - Chart */}
          <div style={{
            flex: 1,
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            padding: '28px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#6ee7b7',
              margin: '0 0 24px 0'
            }}>Research Trends</h2>
            <div style={{
              flex: 1
            }}>
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
          <div style={{
            width: '340px',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            padding: '28px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#c084fc',
              margin: '0 0 24px 0'
            }}>Research Assistant</h2>
            
            {/* Chat Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {chatMessages.map((message, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    backgroundColor: message.role === 'user' ? '#2563eb' : '#374151',
                    color: message.role === 'user' ? 'white' : '#e2e8f0'
                  }}>
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    backgroundColor: '#374151',
                    color: '#e2e8f0',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#94a3b8',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#94a3b8',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite 0.2s'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#94a3b8',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite 0.4s'
                      }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask about the research..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  boxSizing: 'border-box',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '10px',
                  color: 'white',
                  outline: 'none',
                  fontSize: '14px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                onBlur={(e) => e.target.style.borderColor = '#4b5563'}
              />
              <button
                onClick={sendChatMessage}
                disabled={loading || !chatInput.trim()}
                style={{
                  padding: '12px 16px',
                  backgroundColor: loading || !chatInput.trim() ? '#4b5563' : '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading || !chatInput.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading && chatInput.trim()) {
                    e.target.style.backgroundColor = '#6d28d9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && chatInput.trim()) {
                    e.target.style.backgroundColor = '#7c3aed';
                  }
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Daily Research Summary - Full Width */}
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          padding: '40px',
          marginTop: '100px',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '32px',
            color: '#fbbf24',
            margin: '0 0 32px 0'
          }}>Daily Research Summary</h2>
          <div style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#e2e8f0'
          }}>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              margin: 0
            }}>{blogPost}</pre>
          </div>
        </div>

        {/* Time Travel - Centered */}
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '400px',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            padding: '28px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#fb923c',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '0 0 24px 0'
            }}>
              <Calendar size={24} />
              Time Travel
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#cbd5e1',
                  marginBottom: '12px'
                }}>
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    boxSizing: 'border-box',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '10px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fb7185'}
                  onBlur={(e) => e.target.style.borderColor = '#4b5563'}
                />
              </div>
              <button
                onClick={handleDateSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  backgroundColor: loading ? '#4b5563' : '#ea580c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#c2410c';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#ea580c';
                  }
                }}
              >
                {loading ? 'Loading...' : 'Go to Date'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
};

export default MLResearchTracker;
