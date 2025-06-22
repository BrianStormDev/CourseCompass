import requests
import time

def get_semantic_scholar_top_papers(author_name, top_n=10):
    """Get top cited papers directly from Semantic Scholar author profile"""
    
    print(f"🔍 Searching for {author_name} on Semantic Scholar...")
    headers = {'User-Agent': 'CourseCompass/1.0 (mailto:your-email@example.com)'}
    
    # Step 1: Find the author
    search_url = "https://api.semanticscholar.org/graph/v1/author/search"
    params = {'query': author_name, 'limit': 5}
    
    try:
        response = requests.get(search_url, headers=headers, params=params, timeout=15)
        time.sleep(2)
        
        if response.status_code != 200:
            print(f"❌ Author search failed for {author_name}: HTTP {response.status_code}")
            return [], 0
        
        authors = response.json().get('data', [])
        if not authors:
            print(f"❌ Author not found: {author_name}")
            return [], 0
        
        # Find exact match or take first result
        author = None
        for a in authors:
            if a.get('name', '').lower() == author_name.lower():
                author = a
                break
        
        if not author:
            author = authors[0]
        
        author_id = author.get('authorId')
        print(f"✅ Found author: {author.get('name')} (ID: {author_id})")
        
    except Exception as e:
        print(f"❌ Error finding author {author_name}: {e}")
        return [], 0
    
    # Step 2: Get author's papers with citations
    print(f"📄 Fetching papers for {author_name}...")
    
    papers_url = f"https://api.semanticscholar.org/graph/v1/author/{author_id}/papers"
    params = {
        'fields': 'title,citationCount,year,externalIds',
        'limit': 100  # Get more papers to find the best ones
    }
    
    try:
        time.sleep(3)  # Be respectful to API
        response = requests.get(papers_url, headers=headers, params=params, timeout=20)
        
        if response.status_code != 200:
            print(f"❌ Papers fetch failed for {author_name}: HTTP {response.status_code}")
            return [], 0
        
        papers = response.json().get('data', [])
        print(f"📊 Found {len(papers)} papers for {author_name}")
        
    except Exception as e:
        print(f"❌ Error fetching papers for {author_name}: {e}")
        return [], 0
    
    # Step 3: Filter and sort by citations
    papers_with_citations = [p for p in papers if p.get('citationCount', 0) > 0]
    sorted_papers = sorted(papers_with_citations, key=lambda x: x.get('citationCount', 0), reverse=True)
    
    top_papers = sorted_papers[:top_n]
    
    # Step 4: Calculate total citations for top papers
    total_citations = sum(paper.get('citationCount', 0) for paper in top_papers)
    
    # Step 5: Display results
    print(f"\n🏆 Top {len(top_papers)} Most Cited Papers for {author_name}:")
    print("=" * 80)
    
    for i, paper in enumerate(top_papers, 1):
        citations = paper.get('citationCount', 0)
        title = paper.get('title', 'Untitled')
        year = paper.get('year', 'Unknown')
        print(f"{i:2d}. [{citations:,} citations] {title}")
        print(f"    Year: {year}")
        print()
    
    # Summary for this author
    print("=" * 80)
    print(f"📈 Summary for {author_name}:")
    print(f" - Total papers found: {len(papers)}")
    print(f" - Papers with citations: {len(papers_with_citations)}")
    print(f" - Total citations (top {len(top_papers)}): {total_citations:,}")
    if top_papers:
        print(f" - Average citations (top {len(top_papers)}): {total_citations/len(top_papers):,.0f}")
    print()
    
    return top_papers, total_citations

def analyze_multiple_scholars(scholar_list, top_n=10):
    """Analyze multiple scholars and aggregate their citation counts"""
    
    print(f"🎓 Starting analysis of {len(scholar_list)} scholars...")
    print("=" * 100)
    
    all_results = {}
    total_aggregate_citations = 0
    total_papers_analyzed = 0
    
    for i, scholar in enumerate(scholar_list, 1):
        print(f"\n📚 Processing scholar {i}/{len(scholar_list)}: {scholar}")
        print("-" * 60)
        
        papers, citations = get_semantic_scholar_top_papers(scholar, top_n)
        
        all_results[scholar] = {
            'papers': papers,
            'total_citations': citations,
            'paper_count': len(papers)
        }
        
        total_aggregate_citations += citations
        total_papers_analyzed += len(papers)
        
        print(f"✅ Completed {scholar}: {citations:,} citations from {len(papers)} top papers\n")
        
        # Add delay between scholars to be respectful to API
        if i < len(scholar_list):
            print("⏳ Waiting before next scholar...")
            time.sleep(5)
    
    # Final aggregate summary
    print("=" * 100)
    print("🎯 FINAL AGGREGATE SUMMARY")
    print("=" * 100)
    
    print(f"📊 Scholar Analysis Results:")
    for scholar, data in all_results.items():
        print(f" - {scholar}: {data['total_citations']:,} citations ({data['paper_count']} papers)")
    
    print(f"\n🏆 Overall Statistics:")
    print(f" - Total scholars analyzed: {len(scholar_list)}")
    print(f" - Total papers analyzed: {total_papers_analyzed}")
    print(f" - Total aggregate citations: {total_aggregate_citations:,}")
    print(f" - Average citations per scholar: {total_aggregate_citations/len(scholar_list):,.0f}")
    if total_papers_analyzed > 0:
        print(f" - Average citations per paper: {total_aggregate_citations/total_papers_analyzed:,.0f}")
    
    return all_results, total_aggregate_citations

if __name__ == "__main__":
    # Example usage with multiple scholars
    scholars = [
        "Yoshua Bengio",
        "Geoffrey Hinton", 
        "Yann LeCun",
        "Andrew Ng"
    ]
    
    # Analyze all scholars
    results, total_citations = analyze_multiple_scholars(scholars, top_n=10)
    
    print(f"\n🎉 Analysis complete! Total citations across all scholars: {total_citations:,}")