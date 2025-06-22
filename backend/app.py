import anthropic
from flask import Flask, request, jsonify
from flask_cors import CORS
import database

# api_key = 'API_KEY'
# client = anthropic.Anthropic(api_key=api_key)
#
# prompt = ""
#
# response = client.messages.create(
#     model="claude-sonnet-4-20250514", #"",
#     max_tokens=2048,
#     messages=[
#         {
#             "role": "user",
#             "content": prompt
#         }
#     ],
#     tools=[{
#         "type": "web_search_20250305",
#         "name": "web_search",
#         "max_uses": 5
#     }]
# )

# text_parts = [block.text for block in response.content if block.type == 'text']
# full_response = ''.join(text_parts)
# print(full_response)

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
    # Get the json data from the request
    if request.method == "POST":
        data = request.get_json()

        # Access the data
        message = data.get('message')
        context = data.get('context', {})

        print(f"Received message: {message}")
        print(f"Context: {context}")
        
        # Process and return response
        return jsonify({
            "response": f"You said: {message}",
            "received_context": context
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
