# TrendLytix - Trend Analysis & Insights Platform

A modern, full-stack web application for analyzing global trends, providing real-time insights, predictive analytics, and actionable intelligence for tracking emerging patterns across multiple domains.

## 🚀 Features

### Core Functionality
- **📊 Trend Dashboard** - Real-time trend tracking with KPI cards and trend strength indicators
- **🔍 Advanced Search & Filtering** - Search trends by name and filter by category
- **📈 Analytics Dashboard** - Multi-dimensional trend analysis with interactive charts
  - Category filtering with dynamic chart updates
  - Time range selection (24h, 7d, 30d, 90d)
  - Strength, sentiment, and pattern analysis
- **🌍 Geographic Analysis** - Regional trend distribution with intensity heatmaps
- **💡 AI-Powered Insights** - Persona-based recommendations (Student, Investor, Creator)
- **📄 PDF Report Generation** - Individual trend reports and batch trend analysis
- **🔐 User Authentication** - Secure login/signup with persistent credentials
- **⚙️ Trend Predictions** - Growth probability, peak window forecasting, confidence scoring

### Advanced Features
- Dark mode support with theme persistence
- Responsive design for mobile, tablet, and desktop
- Real-time data visualization with Recharts
- Local storage for credentials (secure, password not stored)
- Comprehensive trend database with 40+ pre-seeded trends
- ML-powered domain classification

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 16.x or higher
- **Python** 3.9+ 
- **npm** (comes with Node.js)
- **pip** (comes with Python)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FRONTEND
```

### 2. Frontend Setup

#### Install Dependencies
```bash
npm install
```

#### Configure Environment (Optional)
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

#### Start Development Server
```bash
npm run dev
```

The frontend will be available at **http://localhost:8080**

#### Build for Production
```bash
npm run build
```

### 3. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Python Virtual Environment
```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Run Database Initialization
```bash
python setup_database.py
```

#### Seed Sample Data (Optional)
```bash
python seed_data.py
```

#### Start Backend Server
```bash
python api_server.py
```

The backend API will be available at **http://localhost:8000**

Check API status:
```bash
curl http://localhost:8000/api/trends
```

## 🎯 Usage Guide

### Login & Authentication

1. **First Time Users:**
   - Click "Sign Up" on the login page
   - Enter email, name, and password
   - Credentials automatically save for future logins
   - Redirected to dashboard after signup

2. **Returning Users:**
   - If you previously checked "Remember Me", your email auto-fills
   - Simply enter your password and login

3. **Credential Management:**
   - Passwords are **never** stored locally (security best practice)
   - Only email is cached for convenience
   - Clear browser cache to remove saved credentials

### Dashboard

**View All Trends Modal**
1. Click "View All Trends" button in the trends section
2. Search trends by name in real-time
3. Filter by category using the dropdown
4. Click any trend to view detailed analysis
5. Modal closes when you navigate to a trend

**Smart Alerts Section**
- View top alerts by category
- See trending pattern alerts
- Check high-risk trends

**Quick Actions**
- Generate PDF reports
- View analytics
- Compare trends
- Access settings

### Analytics Page

1. **Filter Trends:**
   - Select a category from the dropdown
   - Use "Reset Filters" to view all trends
   - Charts update dynamically

2. **Time Range Analysis:**
   - Choose from: 24 hours, 7 days, 30 days, or 90 days
   - View trend evolution over time

3. **Data Visualization:**
   - **Trend by Category** - Pie chart of category distribution
   - **Strength Metrics** - Bar chart of top trends by strength
   - **Sentiment Analysis** - Percentage breakdown
   - **Pattern Distribution** - Radar chart of emerging patterns

### Trend Details Page

**Analysis Tab**
- Trend name, category, and description
- Current strength score (0-100)
- Growth rate and risk assessment
- Key patterns and keywords

**Predictions Tab**
- Growth probability percentage
- Decline risk assessment
- Peak activity window (next 7-30 days)
- Confidence score

**Geography Tab**
- Regional distribution map
- Intensity levels (0-100) for each region
- Top performing regions

**Insights Tab**
- Persona-specific recommendations:
  - **🎓 Student:** Learning opportunities and research topics
  - **📈 Investor:** Investment potential and opportunities
  - **🎬 Creator:** Content creation ideas and strategies

### Reports

**Generate Individual Report**
1. On a trend's detail page, click "Download Report"
2. PDF automatically downloads with trend analysis
3. Includes: overview, patterns, predictions, geography, risks

**Generate Batch Report**
1. Go to Reports page
2. Select date range
3. Choose report sections:
   - Executive Summary
   - Trend Analysis
   - Growth Metrics
   - Risk Assessment
4. Click "Generate Report"
5. PDF downloads with all selected sections

**Quick Actions**
- **Last 7 Days** - Auto-fills date range for past week
- **Last 30 Days** - Auto-fills date range for past month
- **Today's Report** - Generates report for current date

**Report History**
- View last 5 generated reports
- Download previously generated reports
- Delete reports as needed

## 📁 Project Structure

```
TrendLytix/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Analytics.tsx
│   │   ├── Report.tsx
│   │   ├── TrendDetail.tsx
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   ├── lib/                # Utility functions
│   ├── data/               # Mock data
│   └── App.tsx
├── backend/
│   ├── api_server.py       # FastAPI server
│   ├── database.py         # Database operations
│   ├── enhanced_analysis.py # Advanced analytics
│   ├── domain_classifier.py # ML domain classification
│   ├── requirements.txt    # Python dependencies
│   ├── trendlytix.db       # SQLite database
│   └── ml/                 # Machine learning models
├── public/                 # Static assets
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind CSS config
└── README.md              # This file
```

## 🛠️ Development

### Frontend Tech Stack
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Recharts** - Data visualization
- **React Router** - Routing
- **Lucide Icons** - Icons

### Backend Tech Stack
- **FastAPI** - Web framework
- **SQLite** - Database
- **Pandas** - Data analysis
- **Scikit-learn** - Machine learning
- **Statsmodels** - Statistical modeling
- **Uvicorn** - ASGI server

### Running Tests

#### Frontend
```bash
npm run lint
```

#### Backend
```bash
cd backend
python verify_data.py  # Check database integrity
```

### Building for Production

#### Frontend
```bash
npm run build
# Output in dist/
```

#### Backend
Deploy with your preferred platform (Heroku, AWS, etc.):
```bash
# Ensure .venv is created in production
# Set PYTHONUNBUFFERED=1 for proper logging
python api_server.py --host 0.0.0.0 --port 8000
```

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (backend/.env - Optional)
```env
DATABASE_URL=sqlite:///trendlytix.db
API_PORT=8000
CORS_ORIGINS=http://localhost:8080,http://localhost:3000
```

## 📊 Database Schema

### trend_snapshot Table
- `id` - Unique identifier
- `name` - Trend name
- `category` - Domain category (Tech, Business, Health, etc.)
- `strength_score` - Current strength (0-100)
- `growth_rate` - Growth percentage
- `risk_level` - Risk assessment (Low, Medium, High)
- `description` - Trend description
- `keywords` - Associated keywords
- `geoDistribution` - Regional data
- `patterns` - Detected patterns
- `predictions` - Forecast data
- `actionInsights` - Persona-based insights

## 🐛 Troubleshooting

### Frontend Issues

**Port 8080 already in use:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9  # macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process  # Windows
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Vite build fails:**
```bash
npm run build -- --debug
```

### Backend Issues

**Port 8000 already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
```

**Database errors:**
```bash
cd backend
rm trendlytix.db  # Remove old database
python setup_database.py  # Reinitialize
python seed_data.py  # Reseed data
```

**Python module not found:**
```bash
# Verify virtual environment activation
pip list  # Should show installed packages

# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

**API not responding:**
```bash
# Check if backend is running
curl http://localhost:8000/api/trends

# Test with verbose output
python api_server.py  # Remove background flag to see logs
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder
```

### Backend (Heroku)
```bash
heroku create your-app-name
git push heroku main
heroku config:set DATABASE_URL=your_database_url
```

### Docker Deployment
Create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:5173"
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
```

Run with:
```bash
docker-compose up
```

## 📝 API Endpoints

### Trends
- `GET /api/trends` - Get all trends
- `GET /api/trends/<id>` - Get specific trend
- `GET /api/trends/search?q=keyword` - Search trends

### Analytics
- `GET /api/analytics/by-category` - Trends by category
- `GET /api/analytics/strength` - Strength metrics
- `GET /api/analytics/sentiment` - Sentiment analysis

### Predictions
- `GET /api/predictions/<trend_id>` - Get trend predictions
- `GET /api/predictions/growth` - Growth probability

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push branch: `git push origin feature/feature-name`
4. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Provide detailed error messages and reproduction steps

## 🎉 Acknowledgments

- Built with React, TypeScript, and Tailwind CSS
- UI components from Shadcn/ui
- Data visualization by Recharts
- Backend powered by FastAPI
- Icons by Lucide Icons

---

**Last Updated:** January 2026  
**Version:** 1.0.0
