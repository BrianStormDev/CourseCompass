import anthropic

class ManualSlidingWindowChat:
    def __init__(self, api_key, window_size=10, max_tokens=1024):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.chat_history = []
        self.window_size = window_size
        self.model = "claude-sonnet-4-20250514"
        self.max_tokens = max_tokens
    
    def add_message_with_sliding(self, role, content):
        """Add message and manually maintain sliding window"""
        self.chat_history.append({
            "role": role,
            "content": content
        })
        
        # Keep only the last window_size messages
        if len(self.chat_history) > self.window_size:
            self.chat_history = self.chat_history[-self.window_size:]
    
    def get_response(self, user_message):
        """Get response with manual sliding window management"""
        # Add user message
        self.add_message_with_sliding("user", user_message)
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                messages=self.chat_history
            )
            
            assistant_message = response.content[0].text
            
            # Add assistant response
            self.add_message_with_sliding("assistant", assistant_message)
            
            print(assistant_message)

            return assistant_message
            
        except anthropic.APIError as e:
            print(f"Anthropic API Error: {e}")
            return f"API Error: {str(e)}"
        except Exception as e:
            print(f"Error: {e}")
            return None