import sqlite3
conn = sqlite3.connect("db.db", check_same_thread=False)

# Decorator function to skip duplicates entries when inserting into the db
def unique_skip(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except sqlite3.IntegrityError as e:
            if "UNIQUE constraint failed" not in str(e):
                raise e
    return wrapper

def init_db():
    """Creates all the tables in the db"""
    cur = conn.cursor()
    # Each blog corresponds to a single article
    # Pick the paper with the highest `score` to write a blog post about
    # The score is based on num of citations, how goated is the author, recency, and maybe similarity to the most popular topic found in the trend analysis
    cur.execute("""
        CREATE TABLE IF NOT EXISTS blogs(
            blog_id INTEGER PRIMARY KEY UNIQUE
            blog TEXT
            score INTEGER
            article_id INTEGER REFERENCES articles(article_id) ON DELETE CASCADE
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS articles(
            article_id INTEGER PRIMARY KEY UNIQUE
            article_text TEXT
            published_date TEXT
        )
    """)

    # Table for the trends
    # Feed to to BERTopic, which is a semantic analysis tool
    # We want to plot the popularity of the trends
    # FINISH THIS TABLE
    cur.execute("""
        CREATE TABLE IF NOT EXISTS trends(

        )
    """)
    cur.close()


def select_article_text_via_blog_id(blog_id):
    cur = conn.cursor()
    cur.execute("SELECT art.article_text FROM articles AS art INNER JOIN blogs ON art.article_id = blog.article_id WHERE art.article_id = ?", (blog_id,));
    res = cur.fetchall()
    cur.close()
    return res


