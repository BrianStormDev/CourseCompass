import json
import anthropic as Anthropic
from flask import Flask, request, jsonify
from flask_cors import CORS
import database

with open('config.json', 'r') as f:
    config = json.load(f)
    
client = Anthropic.Anthropic(api_key=config['anthropic_api_key'])

app = Flask(__name__)
CORS(app)
# Init the db
database.init_db()

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
    print("I am processing")
    # Get the json data from the request
    if request.method == "POST":
        data = request.get_json()

        print(data)

        # Access the data
        prompt = data.get('message')
        context = data.get('context', {})

        # print(f"Received message: {message}")
        # print(f"Context: {context}")

        response = client.messages.create(
            model="claude-sonnet-4-20250514", #"",
            max_tokens=2048,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            tools=[{
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 5
            }]
        )
        
        # Process and return response
        return jsonify({
            "response": response.content[0].text,
            "received_context": context
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
