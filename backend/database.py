import sqlite3
conn = sqlite3.connect("db.db", check_same_thread=False)

from helper_classes import Blog, Article

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
        CREATE TABLE IF NOT EXISTS articles(
            article_id TEXT PRIMARY KEY UNIQUE,
            article_title TEXT,
            published_date TEXT,
            url TEXT,
            popularity INTEGER
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS blogs(
            blog_id INTEGER PRIMARY KEY UNIQUE,
            blog_content TEXT,
            score INTEGER,
            article_id INTEGER REFERENCES articles(article_id) ON DELETE CASCADE
        )
    """)

    # Table for the trends
    # Feed to to BERTopic, which is a semantic analysis tool
    # We want to plot the popularity of the trends
    # FINISH THIS TABLE
    # cur.execute("""
    #     CREATE TABLE IF NOT EXISTS trends(
    #
    #     )
    # """)
    cur.close()

# The 5 articles that we display on the sidebar are based on popularity
def select_honorable_article_shoutouts():
    cur = conn.cursor()
    cur.execute("SELECT article_title, article_id, url FROM articles ORDER BY popularity DESC");
    res = cur.fetchall()
    cur.close()
    return res

@unique_skip
def insert_new_article(a: Article):
    cur = conn.cursor()
    cur.execute("INSERT INTO articles(article_id, article_title, published_date, url, popularity) VALUES(?, ?, ?, ?, ?)", (a.article_id, a.article_title, a.published_date, a.url, a.popularity))
    conn.commit()
    cur.close()

@unique_skip
def insert_new_blog(b: Blog):
    cur = conn.cursor()
    cur.execute("INSERT INTO blogs(blog_id, blog_content, score, article_id) VALUES(?, ?, ?, ?)", (b.blog_id, b.blog_content, b.score, b.article_id))
    conn.commit()
    cur.close()
