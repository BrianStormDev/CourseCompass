import urllib, urllib.request
import xml.etree.ElementTree as ET
import pandas as pd
import matplotlib as plt
import anthropic
import ast
import json
import flask
from transformers import pipeline
from bertopic import BERTopic
from datetime import datetime, timedelta
from sklearn.feature_extraction.text import CountVectorizer

# Create extensive stopword list for academic papers
academic_stopwords = [
    # Generic words (NLTK)
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", 
    "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", 
    "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", 
    "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", 
    "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", 
    "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", 
    "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", 
    "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", 
    "can", "will", "just", "don", "should", "now"
    # Academic terms
    'paper', 'study', 'research', 'work', 'approach', 'method', 'methods', 'technique', 'techniques',
    'model', 'models', 'framework', 'system', 'systems', 'analysis', 'results', 'performance', 'evaluation', 
    'experiments', 'experimental', 'propose', 'proposed', 'show', 'shows', 'demonstrate', 'demonstrates', 
    'present', 'presents', 'introduce', 'novel', 'new', 'based', 'using', 'used', 'can', 'also', 'our', 
    'their', 'these', 'such', 'different', 'various', 'data', 'test', 'testing', 'compared', 'comparison', 'state', 'art'
]

def populate_dataframe():
    window_length, curr, step = 90, 0, 2000
    documents, timestamps, ids, author_lst  = [], [], [], []

    while True:
        url = f'http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cs.CL+OR+cs.HC+OR+cs.LG+OR+cs.MA+OR+cs.NE+OR+cs.IR+OR+stat.ML&sortBy=submittedDate&sortOrder=descending&start={curr}&max_results={step}'
        curr += step

        with urllib.request.urlopen(url) as response:
            xml_data = response.read()

        # Parse XML
        root = ET.fromstring(xml_data)

        # The namespace used in ArXiv Atom XML
        ns = {'atom': 'http://www.w3.org/2005/Atom'}

        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns).text.strip()
            summary = entry.find('atom:summary', ns).text.strip()
            published = entry.find('atom:published', ns).text.strip()
            arxiv_id = entry.find('atom:id', ns).text.strip()
            authors = [author.find('atom:name', ns).text.strip() for author in entry.findall('atom:author', ns)]

            text = f"{title}. {summary}"
            documents.append(text)

            published_datetime = datetime.strptime(published, "%Y-%m-%dT%H:%M:%SZ")
            timestamps.append(published_datetime)

            ids.append(arxiv_id)
            author_lst.append(authors)

        if min(timestamps) < datetime.now() - timedelta(days=window_length):
            break

    df = pd.DataFrame({'text': documents, 'timestamp': timestamps, 'ids': ids, 'authors': author_lst})
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Custom vectorizer focusing on meaningful terms
    vectorizer = CountVectorizer(
        ngram_range=(1, 3),  # Include phrases up to 4 words
        stop_words=academic_stopwords,
        min_df=2,  # Must appear in at least 2 documents
        max_df=0.33,  # Ignore if appears in more than 75% of docs
        token_pattern=r'\b[a-zA-Z][a-zA-Z0-9]*\b',
        lowercase=True
    )

    topic_model = BERTopic(
        vectorizer_model=vectorizer,
        nr_topics=12,
        min_topic_size=10, 
        calculate_probabilities='False'
    )

    topics, probs = topic_model.fit_transform(df['text'])

    df['topic'] = topics

    return df, topic_model

def get_trend_viz(api_key):
    df, topic_model = populate_dataframe()
    label_dict = generate_topic_labels_claude(topic_model, api_key)
    topic_model.set_topic_labels(label_dict)

    # Time-based trend analysis:
    topics_over_time = topic_model.topics_over_time(df['text'], df['timestamp'], nr_bins=30)
    fig = topic_model.visualize_topics_over_time(topics_over_time, custom_labels=True)
    graph_json = json.loads(fig.to_json())
    return flask.jsonify(graph_json)

def generate_topic_labels_claude(topic_model, api_key, verbose=False):
    topic_info = topic_model.get_topic_info()
    topic_titles = ""

    for topic_id in range(len(topic_info)-1):  # Skip outliers (-1)
        keywords = topic_model.get_topic(topic_id)
        topic_titles += f"Topic {topic_id} - Keywords: {[word for word, _ in keywords[:10]]}"
    
    prompt = "Please generate a set of topic labels for the following topic groups based on the listed keywords: " + topic_titles + " and format your output as a dictionary where the key represents the topic ID and the value is the topic label string that you determine for the group based on the keywords. ENSURE THAT THE ONLY OUTPUT IS THIS LIST AND MAKE SURE THAT THERE ARE NO NEW LINE OR TAB CHARACTERS."
    label_dict_str = call_claude(prompt, api_key)

    # if verbose:
    #     print(topic_titles)
    #     print(label_dict_str)

    label_dict = ast.literal_eval(label_dict_str) #dict(label_dict_str)
    
    return label_dict

def call_claude(prompt, api_key):
    client = anthropic.Anthropic(api_key=api_key)

    response = client.messages.create(
        model="claude-3-5-haiku-latest", #"claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    text_parts = [block.text for block in response.content if block.type == 'text']
    full_response = ''.join(text_parts)
    return full_response

