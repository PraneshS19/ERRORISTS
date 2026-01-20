#!/usr/bin/env python3
"""
Domain Classifier - Categorize trends into business domains.

This module uses keyword matching and pattern recognition to classify
trends into relevant business domains for better analysis and visualization.
"""

import re
from typing import Dict, List, Tuple

# Domain keywords and patterns for classification
DOMAIN_KEYWORDS = {
    "Technology": [
        "ai", "artificial intelligence", "machine learning", "python", "javascript",
        "software", "app", "mobile", "web", "cloud", "aws", "azure", "google cloud",
        "api", "database", "server", "coding", "programming", "tech", "startup",
        "bitcoin", "ethereum", "crypto", "blockchain", "nft", "web3", "metaverse",
        "openai", "chatgpt", "copilot", "llm", "neural network", "gpu", "cpu",
        "apple", "microsoft", "google", "amazon", "meta", "nvidia", "tesla"
    ],
    "Entertainment": [
        "movie", "film", "show", "series", "tv", "netflix", "disney", "hollywood",
        "actor", "actress", "celebrity", "music", "song", "album", "concert",
        "gaming", "game", "esports", "twitch", "youtube", "streaming", "anime",
        "oscar", "grammy", "award", "award show", "box office", "premiere",
        "marvel", "star wars", "dc", "superhero"
    ],
    "Sports": [
        "football", "soccer", "basketball", "tennis", "cricket", "baseball",
        "nba", "nfl", "premier league", "champion", "olympics", "world cup",
        "nhl", "mls", "championship", "playoff", "match", "game", "player",
        "coach", "team", "tournament", "super bowl", "world series"
    ],
    "Business & Finance": [
        "stock", "market", "finance", "banking", "investment", "startup", "ipo",
        "earnings", "revenue", "profit", "economic", "inflation", "recession",
        "dollar", "currency", "trading", "forex", "crypto", "company", "ceo",
        "merger", "acquisition", "bankruptcy", "lawsuit", "lawsuit settlement"
    ],
    "Politics": [
        "election", "vote", "politician", "president", "congress", "senate",
        "parliament", "government", "policy", "bill", "law", "regulation",
        "trump", "biden", "democrat", "republican", "party", "campaign",
        "primary", "debate", "congress", "senate", "impeachment", "scandal"
    ],
    "Health & Science": [
        "health", "medical", "doctor", "hospital", "disease", "virus", "covid",
        "vaccine", "drug", "pharmaceutical", "research", "study", "scientist",
        "nasa", "space", "biology", "chemistry", "physics", "discovery",
        "breakthrough", "cancer", "mental health", "fitness", "nutrition"
    ],
    "Business Leaders": [
        "elon musk", "steve jobs", "bill gates", "mark zuckerberg", "jeff bezos",
        "sundar pichai", "satya nadella", "tim cook", "jensen huang", "sam altman",
        "jack dorsey", "parag agrawal", "sundar pichai", "sheryl sandberg"
    ],
    "Science & Innovation": [
        "innovation", "invention", "patent", "research", "laboratory", "experiment",
        "breakthrough", "discovery", "science", "technology", "ai", "quantum",
        "renewable energy", "solar", "wind", "electric vehicle", "battery"
    ],
    "Lifestyle": [
        "fashion", "style", "beauty", "luxury", "designer", "brand", "lifestyle",
        "travel", "vacation", "restaurant", "food", "cooking", "recipe",
        "wedding", "engagement", "baby", "home", "furniture", "design"
    ]
}

# Special case overrides - exact matches take priority
SPECIAL_CASES = {
    "elon musk": "Business Leaders",
    "steve jobs": "Business Leaders",
    "bill gates": "Business Leaders",
    "mark zuckerberg": "Business Leaders",
    "jeff bezos": "Business Leaders",
    "sundar pichai": "Business Leaders",
    "satya nadella": "Business Leaders",
    "tim cook": "Business Leaders",
    "jensen huang": "Business Leaders",
    "sam altman": "Business Leaders",
    "trump": "Politics",
    "biden": "Politics",
    "musk": "Business Leaders",
}


def classify_topic(topic: str) -> Tuple[str, float]:
    """
    Classify a topic into a domain and return confidence score.
    
    Args:
        topic: The trend topic to classify
        
    Returns:
        Tuple of (domain, confidence_score)
    """
    topic_lower = topic.lower().strip()
    
    # Check special cases first (100% confidence)
    for special_topic, domain in SPECIAL_CASES.items():
        if special_topic.lower() in topic_lower:
            return domain, 1.0
    
    # Check domain keywords
    best_match = None
    best_score = 0.0
    
    for domain, keywords in DOMAIN_KEYWORDS.items():
        # Count keyword matches
        matches = 0
        for keyword in keywords:
            if keyword.lower() in topic_lower:
                matches += 1
        
        if matches > 0:
            # Confidence based on number of matches
            confidence = min(1.0, (matches * 0.3) + 0.1)
            
            if confidence > best_score:
                best_match = domain
                best_score = confidence
    
    # Default to "Other" if no match found
    if best_match is None:
        return "Other", 0.0
    
    return best_match, best_score


def classify_batch(topics: List[str]) -> Dict[str, Dict]:
    """
    Classify multiple topics into domains.
    
    Args:
        topics: List of trend topics
        
    Returns:
        Dictionary mapping topic to {domain, confidence}
    """
    results = {}
    for topic in topics:
        domain, confidence = classify_topic(topic)
        results[topic] = {
            "domain": domain,
            "confidence": confidence
        }
    return results


def get_domain_distribution(topics: List[str]) -> Dict[str, int]:
    """
    Get distribution of topics across domains.
    
    Args:
        topics: List of trend topics
        
    Returns:
        Dictionary with domain counts
    """
    distribution = {}
    
    for topic in topics:
        domain, _ = classify_topic(topic)
        distribution[domain] = distribution.get(domain, 0) + 1
    
    # Sort by count descending
    return dict(sorted(distribution.items(), key=lambda x: x[1], reverse=True))


def get_all_domains() -> List[str]:
    """Get list of all available domains"""
    domains = list(DOMAIN_KEYWORDS.keys())
    domains.append("Other")
    return sorted(domains)


if __name__ == "__main__":
    # Test the classifier
    test_topics = [
        "ChatGPT Update",
        "Donald Trump News",
        "Apple iPhone Release",
        "World Cup 2026",
        "Stock Market Crash",
        "COVID-19 Vaccine"
    ]
    
    print("Domain Classification Test")
    print("=" * 60)
    
    results = classify_batch(test_topics)
    for topic, info in results.items():
        print(f"{topic:30} -> {info['domain']:20} ({info['confidence']:.0%})")
    
    print("\n" + "=" * 60)
    distribution = get_domain_distribution(test_topics)
    print("Domain Distribution:")
    for domain, count in distribution.items():
        print(f"  {domain:25}: {count}")
