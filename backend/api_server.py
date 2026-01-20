"""
FastAPI server for TrendLytix
Local-only implementation with SQLite database and ML integration
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from database import (
    init_database, get_trend_snapshots, get_trend_by_topic, get_trend_by_id,
    get_trends_by_topics, get_trend_history, get_prediction
)
from ml.predictor import TrendPredictor
from enhanced_analysis import fetch_prioritized_trends
from domain_classifier import classify_topic

app = FastAPI(title="TrendLytix API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
init_database()

# Initialize ML predictor
predictor = TrendPredictor()


def enrich_trend_with_ml(trend_data: Dict) -> Dict:
    """Enrich trend data with ML predictions and analysis"""
    topic = trend_data.get('topic', '')
    if not topic:
        return trend_data
    
    # Get historical data for ML
    history = get_trend_history(topic, days=30)
    
    # Prepare historical data for ML
    historical_data = [
        {
            'timestamp': row['timestamp'],
            'trend_score': row['trend_score']
        }
        for row in history
    ]
    
    # Generate predictions if we have enough data
    predictions = {
        'growthProbability': 50,
        'peakWindow': 'N/A',
        'declineProbability': 50,
        'confidence': 'low'
    }
    
    if len(historical_data) >= 2:
        try:
            # Train model
            train_result = predictor.train(historical_data)
            
            if train_result.get('status') == 'success':
                # Generate predictions
                pred_result = predictor.predict_batch(historical_data)
                
                if pred_result.get('status') == 'success':
                    # Extract 7-day prediction
                    pred_7day = pred_result.get('predictions_7day', [])
                    if pred_7day:
                        latest_pred = pred_7day[-1]
                        predicted_score = latest_pred.get('predicted_score', 50)
                        current_score = trend_data.get('trend_score', 0) * 100
                        
                        # Calculate growth probability
                        if predicted_score > current_score:
                            growth_prob = min(95, int((predicted_score - current_score) / current_score * 100) + 50)
                            decline_prob = 100 - growth_prob
                        else:
                            decline_prob = min(95, int((current_score - predicted_score) / current_score * 100) + 50)
                            growth_prob = 100 - decline_prob
                        
                        predictions = {
                            'growthProbability': max(5, min(95, growth_prob)),
                            'peakWindow': latest_pred.get('date', 'N/A'),
                            'declineProbability': max(5, min(95, decline_prob)),
                            'confidence': pred_result.get('confidence', 'low')
                        }
        except Exception as e:
            print(f"ML prediction error for {topic}: {e}")
    
    # Enrich with additional fields expected by frontend
    enriched = {
        **trend_data,
        'id': str(trend_data.get('id', '')),
        'name': trend_data.get('topic', ''),
        'category': trend_data.get('domain', 'Other'),
        'strengthScore': int(trend_data.get('trend_score', 0) * 100),
        'growthRate': trend_data.get('trend_score', 0) * 10,  # Approximate growth rate
        'mentionVelocity': trend_data.get('num_sources', 1) * 10,
        'timeConsistency': 70,  # Placeholder
        'sentiment': {
            'positive': 60,
            'negative': 20,
            'neutral': 20
        },
        'patterns': _get_patterns(trend_data),
        'sources': _get_sources(trend_data),
        'riskLevel': _get_risk_level(trend_data),
        'riskReasons': _get_risk_reasons(trend_data),
        'predictions': predictions,
        'topKeywords': [topic],
        'triggeringEvents': [],
        'sourceDominance': trend_data.get('sources', ''),
        'geoDistribution': [],
        'actionInsights': {
            'contentIdeas': [],
            'startupIdeas': [],
            'researchOpportunities': []
        },
        'alerts': _get_alerts(trend_data),
        'mentionsTimeline': [],
        'description': f"Trending topic: {topic}",
        'confidence': predictions.get('confidence', 'low'),
        'dataSources': trend_data.get('sources', '').split(',') if trend_data.get('sources') else []
    }
    
    return enriched


def _get_patterns(trend_data: Dict) -> List[Dict]:
    """Determine trend patterns"""
    direction = trend_data.get('trend_direction', 'stable')
    score = trend_data.get('trend_score', 0)
    
    patterns = []
    if direction == 'rising':
        if score > 0.7:
            patterns.append({
                'type': 'sustained',
                'label': 'Sustained Growth',
                'color': '#10B981',
                'description': 'Consistent upward trend'
            })
        else:
            patterns.append({
                'type': 'flash',
                'label': 'Emerging',
                'color': '#3B82F6',
                'description': 'Recent spike in interest'
            })
    elif direction == 'falling':
        patterns.append({
            'type': 're-emerging',
            'label': 'Declining',
            'color': '#EF4444',
            'description': 'Trend is losing momentum'
        })
    else:
        patterns.append({
            'type': 'seasonal',
            'label': 'Stable',
            'color': '#6B7280',
            'description': 'Consistent interest level'
        })
    
    return patterns


def _get_sources(trend_data: Dict) -> List[Dict]:
    """Format sources for frontend"""
    sources_str = trend_data.get('sources', '')
    sources_list = sources_str.split(',') if sources_str else []
    
    source_map = {
        'google_trends': {'name': 'Google Trends', 'color': '#4285F4', 'icon': '🔍'},
        'news': {'name': 'News API', 'color': '#FF6B6B', 'icon': '📰'},
        'wiki_trending': {'name': 'Wikipedia', 'color': '#4ECDC4', 'icon': '📚'}
    }
    
    sources = []
    total_score = (trend_data.get('google_score', 0) + 
                   trend_data.get('wiki_score', 0) + 
                   trend_data.get('news_score', 0))
    
    if total_score > 0:
        for source in sources_list:
            if source in source_map:
                score = trend_data.get(f'{source.replace("_trending", "")}_score', 0)
                contribution = (score / total_score * 100) if total_score > 0 else 0
                sources.append({
                    'name': source_map[source]['name'],
                    'contribution': round(contribution, 1),
                    'color': source_map[source]['color'],
                    'icon': source_map[source]['icon']
                })
    
    return sources if sources else [
        {'name': 'Multiple Sources', 'contribution': 100, 'color': '#6B7280', 'icon': '📊'}
    ]


def _get_risk_level(trend_data: Dict) -> str:
    """Determine risk level"""
    score = trend_data.get('trend_score', 0)
    num_sources = trend_data.get('num_sources', 1)
    
    if score > 0.8 and num_sources >= 2:
        return 'low'
    elif score > 0.5:
        return 'medium'
    else:
        return 'high'


def _get_risk_reasons(trend_data: Dict) -> List[str]:
    """Get risk reasons"""
    reasons = []
    score = trend_data.get('trend_score', 0)
    num_sources = trend_data.get('num_sources', 1)
    
    if score < 0.3:
        reasons.append('Low trend score indicates weak signal')
    if num_sources == 1:
        reasons.append('Single source confirmation - limited validation')
    if score > 0.85:
        reasons.append('High saturation - trend may be peaking')
    
    return reasons if reasons else ['No significant risks detected']


def _get_alerts(trend_data: Dict) -> List[Dict]:
    """Generate alerts based on trend data"""
    alerts = []
    direction = trend_data.get('trend_direction', 'stable')
    score = trend_data.get('trend_score', 0)
    
    if direction == 'rising' and score > 0.7:
        alerts.append({
            'type': 'spike',
            'message': f"Rapid growth detected for {trend_data.get('topic', 'trend')}",
            'timestamp': datetime.utcnow().isoformat(),
            'priority': 'high'
        })
    elif direction == 'falling' and score < 0.3:
        alerts.append({
            'type': 'decline',
            'message': f"Declining interest in {trend_data.get('topic', 'trend')}",
            'timestamp': datetime.utcnow().isoformat(),
            'priority': 'medium'
        })
    
    return alerts


@app.get("/")
def root():
    """API root endpoint"""
    return {
        "message": "TrendLytix API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/api/home/trending")
def get_home_trending():
    """Get trending topics for home page"""
    try:
        trends = get_trend_snapshots(limit=10)
        enriched_trends = [enrich_trend_with_ml(trend) for trend in trends]
        
        return {
            "trends": enriched_trends,
            "confidence": "medium",
            "dataSources": ["Local SQLite Database"],
            "disclaimer": "Trends are based on statistical analysis. Predictions are probabilistic and not absolute."
        }
    except Exception as e:
        # Return mock data on error
        return {
            "trends": _get_mock_trends(10),
            "confidence": "low",
            "dataSources": ["Mock Data"],
            "disclaimer": "Using mock data due to database error",
            "error": str(e)
        }


@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    """Get dashboard summary data"""
    try:
        trends = get_trend_snapshots(limit=48)
        enriched_trends = [enrich_trend_with_ml(trend) for trend in trends]
        
        return {
            "summary": enriched_trends,
            "confidence": "medium",
            "dataSources": ["Local SQLite Database"],
            "disclaimer": "Summary data is based on recent trend snapshots. Use for decision support, not absolute truth."
        }
    except Exception as e:
        return {
            "summary": _get_mock_trends(48),
            "confidence": "low",
            "dataSources": ["Mock Data"],
            "disclaimer": "Using mock data due to database error",
            "error": str(e)
        }


@app.get("/api/trends")
def get_trends():
    """Get all trends"""
    try:
        trends = get_trend_snapshots(limit=48)
        enriched_trends = [enrich_trend_with_ml(trend) for trend in trends]
        
        return {
            "trends": enriched_trends,
            "confidence": "medium",
            "dataSources": ["Local SQLite Database"],
            "disclaimer": "Trend data is probabilistic. Confidence levels indicate model reliability."
        }
    except Exception as e:
        return {
            "trends": _get_mock_trends(48),
            "confidence": "low",
            "dataSources": ["Mock Data"],
            "error": str(e)
        }


@app.get("/api/trends/{id}")
def get_trend_detail(id: str):
    """Get trend detail by ID or topic"""
    try:
        # Try as ID first
        try:
            trend_id = int(id)
            trend = get_trend_by_id(trend_id)
        except ValueError:
            # Treat as topic
            trend = get_trend_by_topic(id)
        
        if not trend:
            raise HTTPException(status_code=404, detail="Trend not found")
        
        enriched = enrich_trend_with_ml(trend)
        
        return {
            "trend": enriched,
            "confidence": enriched.get('confidence', 'low'),
            "dataSources": enriched.get('dataSources', []),
            "disclaimer": "Predictions are based on linear regression models. External factors may significantly impact outcomes."
        }
    except HTTPException:
        raise
    except Exception as e:
        # Return mock trend on error
        mock_trend = _get_mock_trends(1)[0]
        mock_trend['id'] = id
        mock_trend['name'] = id
        return {
            "trend": mock_trend,
            "confidence": "low",
            "dataSources": ["Mock Data"],
            "disclaimer": "Using mock data due to error",
            "error": str(e)
        }


@app.get("/api/compare")
def compare_trends(topics: Optional[str] = Query(None)):
    """Compare multiple trends"""
    if not topics:
        raise HTTPException(status_code=400, detail="No topics provided. Use ?topics=topic1,topic2")
    
    try:
        topic_list = [t.strip() for t in topics.split(",")]
        trends = get_trends_by_topics(topic_list, limit=48)
        enriched_trends = [enrich_trend_with_ml(trend) for trend in trends]
        
        return {
            "compare": enriched_trends,
            "confidence": "medium",
            "dataSources": ["Local SQLite Database"],
            "disclaimer": "Comparisons are based on current trend scores. Historical context may vary."
        }
    except Exception as e:
        return {
            "compare": _get_mock_trends(min(len(topic_list) if topics else 2, 10)),
            "confidence": "low",
            "dataSources": ["Mock Data"],
            "error": str(e)
        }


@app.get("/api/alerts")
def get_alerts():
    """Get trend alerts"""
    try:
        trends = get_trend_snapshots(limit=10)
        all_alerts = []
        
        for trend in trends:
            enriched = enrich_trend_with_ml(trend)
            alerts = enriched.get('alerts', [])
            all_alerts.extend(alerts)
        
        # Filter for rising trends with high score
        filtered_alerts = [
            alert for alert in all_alerts
            if alert.get('priority') in ['high', 'medium']
        ]
        
        return {
            "alerts": filtered_alerts[:10],
            "confidence": "medium",
            "dataSources": ["Local SQLite Database"],
            "disclaimer": "Alerts are generated based on trend patterns. Verify with additional sources."
        }
    except Exception as e:
        return {
            "alerts": [],
            "confidence": "low",
            "dataSources": ["Mock Data"],
            "error": str(e)
        }


@app.post("/api/reports/generate")
def generate_report(topics: List[str]):
    """Generate report for specified topics"""
    if not topics:
        raise HTTPException(status_code=400, detail="No topics provided")
    
    try:
        trends = get_trends_by_topics(topics, limit=48)
        enriched_trends = [enrich_trend_with_ml(trend) for trend in trends]
        
        return {
            "report": enriched_trends,
            "confidence": "medium",
            "dataSources": ["Local SQLite Database"],
            "disclaimer": "Report data is based on statistical models. Use for academic and research purposes only."
        }
    except Exception as e:
        return {
            "report": _get_mock_trends(len(topics)),
            "confidence": "low",
            "dataSources": ["Mock Data"],
            "error": str(e)
        }


def _get_mock_trends(count: int) -> List[Dict]:
    """Generate mock trend data for fallback"""
    mock_topics = [
        "Artificial Intelligence", "Climate Change", "Space Exploration",
        "Renewable Energy", "Quantum Computing", "Biotechnology",
        "Electric Vehicles", "Cryptocurrency", "Virtual Reality",
        "Sustainable Living", "Data Science", "Machine Learning"
    ]
    
    trends = []
    for i in range(min(count, len(mock_topics))):
        topic = mock_topics[i % len(mock_topics)]
        domain, _ = classify_topic(topic)
        
        trends.append({
            'id': str(i + 1),
            'name': topic,
            'topic': topic,
            'category': domain,
            'domain': domain,
            'strengthScore': 50 + (i * 5),
            'trend_score': 0.5 + (i * 0.05),
            'growthRate': 10 + (i * 2),
            'mentionVelocity': 100 + (i * 10),
            'timeConsistency': 70,
            'sentiment': {'positive': 60, 'negative': 20, 'neutral': 20},
            'patterns': [{'type': 'sustained', 'label': 'Stable', 'color': '#3B82F6', 'description': 'Consistent interest'}],
            'sources': [{'name': 'Multiple Sources', 'contribution': 100, 'color': '#6B7280', 'icon': '📊'}],
            'riskLevel': 'medium',
            'riskReasons': ['Mock data - verify with real sources'],
            'predictions': {
                'growthProbability': 50,
                'peakWindow': 'N/A',
                'declineProbability': 50,
                'confidence': 'low'
            },
            'topKeywords': [topic],
            'triggeringEvents': [],
            'sourceDominance': 'mock',
            'geoDistribution': [],
            'actionInsights': {
                'contentIdeas': [],
                'startupIdeas': [],
                'researchOpportunities': []
            },
            'alerts': [],
            'mentionsTimeline': [],
            'description': f"Mock trend data for {topic}",
            'confidence': 'low',
            'dataSources': ['Mock Data']
        })
    
    return trends


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
