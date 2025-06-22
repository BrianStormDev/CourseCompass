from dataclasses import dataclass

@dataclass
class Blog:
    blog_id: str
    blog_content: str
    score: int
    article_id: int

@dataclass
class Article:
    article_id: str
    article_title: str
    published_date: str
    url: str
    popularity: int
