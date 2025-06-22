from flask import Flask
import database

app = Flask(__name__)
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
