import arxiv
from datetime import datetime, timezone

search = arxiv.Search(
    query="cat:cs.LG OR cat:cs.CL",
    max_results=100,
    sort_by=arxiv.SortCriterion.SubmittedDate,
)

start_date = datetime(2024, 6, 1, tzinfo=timezone.utc)
end_date = datetime(2024, 6, 21, tzinfo=timezone.utc)

filtered_results = []
for result in search.results():
    if start_date <= result.published <= end_date:
        filtered_results.append(result)

print(f"Found {len(filtered_results)} papers")
for paper in filtered_results:
    print(paper.title, paper.published)
