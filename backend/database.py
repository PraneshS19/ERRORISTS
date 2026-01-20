"""
Local SQLite database setup and management for TrendLytix
Replaces Supabase with local database for academic use
"""

import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Optional
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "trendlytix.db")


def init_database():
    """Initialize SQLite database with all required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create trend_snapshot table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trend_snapshot (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            domain TEXT DEFAULT 'Other',
            trend_score REAL DEFAULT 0,
            trend_direction TEXT DEFAULT 'stable',
            google_score INTEGER DEFAULT 0,
            wiki_score INTEGER DEFAULT 0,
            news_score INTEGER DEFAULT 0,
            num_sources INTEGER DEFAULT 1,
            sources TEXT DEFAULT '',
            domain_confidence REAL DEFAULT 0,
            computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create trend_history table for ML training
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trend_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            domain TEXT DEFAULT 'Other',
            trend_score REAL DEFAULT 0,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(topic, recorded_at)
        )
    """)
    
    # Create trend_predictions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trend_predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            domain TEXT,
            prediction_tomorrow REAL DEFAULT 0,
            prediction_week REAL DEFAULT 0,
            prediction_month REAL DEFAULT 0,
            r_squared REAL DEFAULT 0,
            confidence TEXT DEFAULT 'low',
            momentum REAL DEFAULT 0,
            volatility REAL DEFAULT 0,
            trend TEXT DEFAULT 'stable',
            data_points INTEGER DEFAULT 0,
            trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(topic)
        )
    """)
    
    # Create trending_topics table (raw data from collectors)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trending_topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            title TEXT,
            source TEXT NOT NULL,
            views INTEGER DEFAULT 0,
            fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_trend_snapshot_topic ON trend_snapshot(topic)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_trend_snapshot_computed_at ON trend_snapshot(computed_at DESC)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_trend_history_topic ON trend_history(topic)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_trend_predictions_topic ON trend_predictions(topic)")
    
    conn.commit()
    conn.close()
    print(f"[OK] Database initialized at {DB_PATH}")


@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Enable dict-like access
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def dict_factory(cursor, row):
    """Convert SQLite row to dictionary"""
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


def get_trend_snapshots(limit: int = 48) -> List[Dict]:
    """Get latest trend snapshots"""
    with get_db() as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM trend_snapshot 
            ORDER BY computed_at DESC 
            LIMIT ?
        """, (limit,))
        return [dict(row) for row in cursor.fetchall()]


def get_trend_by_topic(topic: str) -> Optional[Dict]:
    """Get latest trend snapshot for a specific topic"""
    with get_db() as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM trend_snapshot 
            WHERE topic = ? 
            ORDER BY computed_at DESC 
            LIMIT 1
        """, (topic,))
        row = cursor.fetchone()
        return dict(row) if row else None


def get_trend_by_id(trend_id: int) -> Optional[Dict]:
    """Get trend snapshot by ID"""
    with get_db() as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM trend_snapshot WHERE id = ?", (trend_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def get_trends_by_topics(topics: List[str], limit: int = 48) -> List[Dict]:
    """Get trends for multiple topics"""
    if not topics:
        return []
    
    placeholders = ','.join(['?'] * len(topics))
    with get_db() as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute(f"""
            SELECT * FROM trend_snapshot 
            WHERE topic IN ({placeholders})
            ORDER BY computed_at DESC 
            LIMIT ?
        """, (*topics, limit))
        return [dict(row) for row in cursor.fetchall()]


def get_trend_history(topic: str, days: int = 30) -> List[Dict]:
    """Get historical trend data for ML training"""
    with get_db() as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute("""
            SELECT topic, trend_score, recorded_at as timestamp
            FROM trend_history 
            WHERE topic = ? 
            AND recorded_at >= datetime('now', '-' || ? || ' days')
            ORDER BY recorded_at ASC
        """, (topic, days))
        return [dict(row) for row in cursor.fetchall()]


def insert_trend_snapshot(trend_data: Dict) -> int:
    """Insert or update trend snapshot"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO trend_snapshot 
            (topic, domain, trend_score, trend_direction, google_score, 
             wiki_score, news_score, num_sources, sources, domain_confidence)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            trend_data.get('topic'),
            trend_data.get('domain', 'Other'),
            trend_data.get('trend_score', 0),
            trend_data.get('trend_direction', 'stable'),
            trend_data.get('google_score', 0),
            trend_data.get('wiki_score', 0),
            trend_data.get('news_score', 0),
            trend_data.get('num_sources', 1),
            trend_data.get('sources', ''),
            trend_data.get('domain_confidence', 0)
        ))
        return cursor.lastrowid


def insert_trend_history(topic: str, trend_score: float, domain: str = 'Other'):
    """Insert historical trend data point"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR IGNORE INTO trend_history 
            (topic, domain, trend_score, recorded_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        """, (topic, domain, trend_score))


def insert_prediction(prediction_data: Dict):
    """Insert or update trend prediction"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO trend_predictions
            (topic, domain, prediction_tomorrow, prediction_week, prediction_month,
             r_squared, confidence, momentum, volatility, trend, data_points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            prediction_data.get('topic'),
            prediction_data.get('domain', 'Other'),
            prediction_data.get('prediction_tomorrow', 0),
            prediction_data.get('prediction_week', 0),
            prediction_data.get('prediction_month', 0),
            prediction_data.get('r_squared', 0),
            prediction_data.get('confidence', 'low'),
            prediction_data.get('momentum', 0),
            prediction_data.get('volatility', 0),
            prediction_data.get('trend', 'stable'),
            prediction_data.get('data_points', 0)
        ))


def get_prediction(topic: str) -> Optional[Dict]:
    """Get latest prediction for a topic"""
    with get_db() as conn:
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM trend_predictions 
            WHERE topic = ? 
            ORDER BY prediction_date DESC 
            LIMIT 1
        """, (topic,))
        row = cursor.fetchone()
        return dict(row) if row else None


# Initialize database on import
if not os.path.exists(DB_PATH):
    init_database()
