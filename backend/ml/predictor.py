"""
Linear Regression based Trend Predictor
Predicts future trend scores using historical data
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional
import warnings

warnings.filterwarnings('ignore')


class TrendPredictor:
    """Linear regression predictor for trend forecasting"""
    
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.is_trained = False
        self.training_data_points = 0
        self.r_squared = 0.0
        
    def prepare_data(self, historical_data: List[Dict]) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepare data for training.
        
        Args:
            historical_data: List of dicts with 'timestamp' and 'trend_score'
            
        Returns:
            X: Time indices (days from start)
            y: Trend scores
        """
        if len(historical_data) < 2:
            raise ValueError("Need at least 2 data points to train")
        
        # Sort by timestamp
        sorted_data = sorted(historical_data, key=lambda x: x['timestamp'])
        
        # Calculate days from first data point
        first_time = datetime.fromisoformat(sorted_data[0]['timestamp'])
        X = []
        y = []
        
        for point in sorted_data:
            current_time = datetime.fromisoformat(point['timestamp'])
            days_elapsed = (current_time - first_time).total_seconds() / (24 * 3600)
            X.append([days_elapsed])  # 2D array required for sklearn
            y.append(point['trend_score'])
        
        X = np.array(X)
        y = np.array(y)
        
        return X, y
    
    def train(self, historical_data: List[Dict]) -> Dict:
        """
        Train the linear regression model.
        
        Args:
            historical_data: List of historical trend data points
            
        Returns:
            Dictionary with training metrics
        """
        try:
            X, y = self.prepare_data(historical_data)
            
            # Scale the features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train the model
            self.model.fit(X_scaled, y)
            
            # Calculate R² score
            self.r_squared = self.model.score(X_scaled, y)
            self.training_data_points = len(historical_data)
            self.is_trained = True
            
            # Get coefficients
            slope = self.model.coef_[0]
            intercept = self.model.intercept_
            
            # Determine trend direction
            trend_direction = "rising" if slope > 0 else ("falling" if slope < 0 else "stable")
            
            return {
                "status": "success",
                "data_points": len(historical_data),
                "r_squared": round(self.r_squared, 4),
                "slope": round(slope, 4),
                "intercept": round(intercept, 2),
                "trend_direction": trend_direction,
                "confidence": self._get_confidence_level(self.r_squared)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def predict(self, historical_data: List[Dict], days_ahead: int = 7) -> Dict:
        """
        Predict trend score for days ahead.
        
        Args:
            historical_data: Historical data used to determine the reference point
            days_ahead: Number of days to predict (1, 7, or 30)
            
        Returns:
            Dictionary with predictions and confidence intervals
        """
        if not self.is_trained:
            raise ValueError("Model must be trained first")
        
        if len(historical_data) < 2:
            raise ValueError("Need at least 2 data points to make predictions")
        
        try:
            # Get the last timestamp from historical data
            sorted_data = sorted(historical_data, key=lambda x: x['timestamp'])
            last_time = datetime.fromisoformat(sorted_data[-1]['timestamp'])
            first_time = datetime.fromisoformat(sorted_data[0]['timestamp'])
            
            # Calculate days elapsed up to last point
            last_days_elapsed = (last_time - first_time).total_seconds() / (24 * 3600)
            
            # Predict for future dates
            predictions = []
            
            for day_offset in range(1, days_ahead + 1):
                future_days_elapsed = last_days_elapsed + day_offset
                X_future = np.array([[future_days_elapsed]])
                X_future_scaled = self.scaler.transform(X_future)
                
                predicted_score = self.model.predict(X_future_scaled)[0]
                
                # Clamp to 0-100 range
                predicted_score = max(0, min(100, predicted_score))
                
                # Calculate confidence interval (±5% adjustment based on R²)
                confidence = self._get_confidence_level(self.r_squared)
                margin = 5 * (1 - self.r_squared)  # Wider margin for lower R²
                
                future_date = last_time + timedelta(days=day_offset)
                
                predictions.append({
                    "date": future_date.date().isoformat(),
                    "predicted_score": round(predicted_score, 2),
                    "upper_bound": round(min(100, predicted_score + margin), 2),
                    "lower_bound": round(max(0, predicted_score - margin), 2),
                    "confidence": confidence
                })
            
            return {
                "status": "success",
                "predictions": predictions,
                "model_r_squared": round(self.r_squared, 4),
                "days_ahead": days_ahead
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def predict_batch(self, historical_data: List[Dict]) -> Dict:
        """
        Generate predictions for 1-day, 7-day, and 30-day horizons.
        
        Args:
            historical_data: Historical trend data
            
        Returns:
            Dictionary with all predictions
        """
        if not self.is_trained:
            raise ValueError("Model must be trained first")
        
        all_predictions = {
            "status": "success",
            "predictions_1day": self.predict(historical_data, days_ahead=1)["predictions"],
            "predictions_7day": self.predict(historical_data, days_ahead=7)["predictions"],
            "predictions_30day": self.predict(historical_data, days_ahead=30)["predictions"],
            "model_r_squared": round(self.r_squared, 4),
            "confidence": self._get_confidence_level(self.r_squared)
        }
        
        return all_predictions
    
    @staticmethod
    def _get_confidence_level(r_squared: float) -> str:
        """
        Determine confidence level based on R² score.
        
        Args:
            r_squared: R² value from model training
            
        Returns:
            Confidence level string
        """
        if r_squared >= 0.8:
            return "high"
        elif r_squared >= 0.5:
            return "medium"
        else:
            return "low"
    
    def get_model_stats(self) -> Dict:
        """Get current model statistics"""
        if not self.is_trained:
            return {"status": "not_trained"}
        
        return {
            "status": "trained",
            "data_points": self.training_data_points,
            "r_squared": round(self.r_squared, 4),
            "confidence": self._get_confidence_level(self.r_squared)
        }
