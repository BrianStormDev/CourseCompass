import json
import anthropic as Anthropic
from flask import Flask, request, jsonify
from flask_cors import CORS
import database
from ManualSlidingWindowChat import ManualSlidingWindowChat 

# Get the appropriate API Key
with open('config.json', 'r') as f:
    config = json.load(f)

# Configure the app
app = Flask(__name__)
CORS(app)

# Init the db
database.init_db()

# Initialize the chat
chat_instance = ManualSlidingWindowChat(config['anthropic_api_key'])

@app.route("/api/chat")
def chat():
    # RAG STUFF GOES HERE
    pass

@app.route("/api/getArxivLinks")
def getArxivLinks():
    title, id, url = database.select_honorable_article_shoutouts()
    return { title: title, id: id, url:url }

@app.route("/api/claudeChat", methods=['POST'])
def claudeChat():
    # Get the json data from the request
    if request.method == "POST":
        # Get the data from the request
        data = request.get_json()

        # Access the data
        message = data.get('message')

        # See if we can get the appropriate chat history
        context = data.get('context', {})
        
        # Unpack context
        date = context.get("date")
        articles = context.get("articles", [])
        initial = context.get("initial", "")

        # Build the prompt string
        prompt_parts = []

        if initial:
            prompt_parts.append(f"Instruction: {initial}")

        if date:
            prompt_parts.append(f"Date: {date}")

        if articles:
            prompt_parts.append("Relevant Articles:")
            for i, article in enumerate(articles, 1):
                prompt_parts.append(f"{i}. {article}")

        if message:
            prompt_parts.append(f"User Message: {message}")

        # Final prompt to pass to Claude
        prompt = "\n\n".join(prompt_parts)

        # Send the client messages
        response = chat_instance.get_response(prompt)
        # Gets the response as a string
        
        # Process and return response
        response_json = jsonify({
            "response": response
        })
        return response_json

@app.route("/api/chart")
def chart():
    # TODO: Put the chart generation here

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
