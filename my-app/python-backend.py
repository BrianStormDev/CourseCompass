import urllib, urllib.request
import xml.etree.ElementTree as ET
import pandas as pd
from bertopic import BERTopic
from datetime import datetime, timedelta
from sklearn.feature_extraction.text import CountVectorizer
import matplotlib as plt

days = 30
day_timestamps = [(datetime.now() - timedelta(days=i)).strftime('%Y%m%d') for i in range(1, days)]

BASE_URL = 'http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cs.CL+OR+cs.HC+OR+cs.LG+OR+cs.MA+OR+cs.NE+OR+cs.IR+OR+stat.ML&submittedDate:[{day}0000+TO+{day}2359]&start=0&max_results=100'

documents = []
timestamps = []
ids = []
author_lst = []

for date in day_timestamps:
    url = BASE_URL.format(day=date)

    with urllib.request.urlopen(url) as response:
        xml_data = response.read()

    # Parse XML
    root = ET.fromstring(xml_data)

    # The namespace used in ArXiv Atom XML
    ns = {'atom': 'http://www.w3.org/2005/Atom'%7D

    for entry in root.findall('atom:entry', ns):
        title = entry.find('atom:title', ns).text.strip()
        summary = entry.find('atom:summary', ns).text.strip()
        published = entry.find('atom:updated', ns).text.strip()
        arxiv_id = entry.find('atom:id', ns).text.strip()
        authors = [author.find('atom:name', ns).text.strip() for author in entry.findall('atom:author', ns)]

        text = f"{title}. {summary}"
        documents.append(text)
        timestamps.append(published)
        ids.append(arxiv_id)
        author_lst.append(authors)

df = pd.DataFrame({'text': documents, 'timestamp': timestamps, 'ids': ids, 'authors': author_lst})
df['timestamp'] = pd.to_datetime(df['timestamp'])

print(df.size)
Create extensive stopword list for academic papers
academic_stopwords = [
    # Generic words
    'the', 'and', 'to', 'of', 'for', 'in', 'we', 'with', 'on', 'that', 'this', 'are', 'is', 'be', 'by',
    # Academic terms
    'paper', 'study', 'research', 'work', 'approach', 'method', 'methods', 'technique', 'techniques',
    'model', 'models', 'framework', 'system', 'systems', 'algorithm', 'algorithms',
    'analysis', 'results', 'performance', 'evaluation', 'experiments', 'experimental', 'propose', 'proposed',
    'show', 'shows', 'demonstrate', 'demonstrates', 'present', 'presents', 'introduce', 'novel', 'new',
    'based', 'using', 'used', 'can', 'also', 'our', 'their', 'these', 'such', 'different', 'various',
    'data', 'dataset', 'datasets', 'training', 'test', 'testing', 'compared', 'comparison', 'state', 'art'
]

Custom vectorizer focusing on meaningful terms
vectorizer = CountVectorizer(
    ngram_range=(1, 4),  # Include phrases up to 3 words
    stop_words=academic_stopwords,
    min_df=2,  # Must appear in at least 2 documents
    max_df=0.75,  # Ignore if appears in more than 70% of docs
    token_pattern=r'\b[a-zA-Z][a-zA-Z0-9]*\b',
    lowercase=True
)

topic_model = BERTopic(
    vectorizer_model=vectorizer,
    nr_topics=10,
    min_topic_size=10
)

topics, probs = topic_model.fit_transform(df['text'])

For time-based trend analysis:
topics_over_time = topic_model.topics_over_time(df['text'], df['timestamp'])
topic_model.visualize_topics_over_time(topics_over_time)