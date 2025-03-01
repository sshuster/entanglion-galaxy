
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import json
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app, supports_credentials=True)

# Initialize database
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')
    
    # Create portfolio table
    c.execute('''
    CREATE TABLE IF NOT EXISTS portfolios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create portfolio stocks table
    c.execute('''
    CREATE TABLE IF NOT EXISTS portfolio_stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolio_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        shares REAL NOT NULL,
        purchase_price REAL NOT NULL,
        purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
    )
    ''')
    
    # Create watchlist table
    c.execute('''
    CREATE TABLE IF NOT EXISTS watchlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, symbol)
    )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# User Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    hashed_password = generate_password_hash(password)
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                 (username, email, hashed_password))
        conn.commit()
        user_id = c.lastrowid
        
        # Create a default portfolio for the user
        c.execute("INSERT INTO portfolios (user_id, name) VALUES (?, ?)",
                 (user_id, "My Portfolio"))
        conn.commit()
        conn.close()
        
        session['user_id'] = user_id
        return jsonify({"message": "Registration successful", "user_id": user_id}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username or email already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("SELECT id, username, password FROM users WHERE email = ?", (email,))
        user = c.fetchone()
        conn.close()
        
        if user and check_password_hash(user[2], password):
            session['user_id'] = user[0]
            return jsonify({"message": "Login successful", "user_id": user[0], "username": user[1]}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logout successful"}), 200

@app.route('/api/user', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("SELECT id, username, email FROM users WHERE id = ?", (user_id,))
        user = c.fetchone()
        conn.close()
        
        if user:
            return jsonify({
                "id": user[0],
                "username": user[1],
                "email": user[2]
            }), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Market Data Routes
@app.route('/api/market/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    period = request.args.get('period', '1mo')
    interval = request.args.get('interval', '1d')
    
    try:
        # Fetch data from Yahoo Finance
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period, interval=interval)
        
        # Get company info
        info = stock.info
        company_info = {
            'name': info.get('shortName', 'Unknown'),
            'sector': info.get('sector', 'Unknown'),
            'industry': info.get('industry', 'Unknown'),
            'marketCap': info.get('marketCap', 0),
            'currentPrice': info.get('currentPrice', 0) or info.get('regularMarketPrice', 0),
            'dayHigh': info.get('dayHigh', 0),
            'dayLow': info.get('dayLow', 0),
            'volume': info.get('volume', 0),
            'averageVolume': info.get('averageVolume', 0),
            'fiftyTwoWeekHigh': info.get('fiftyTwoWeekHigh', 0),
            'fiftyTwoWeekLow': info.get('fiftyTwoWeekLow', 0),
            'trailingPE': info.get('trailingPE', 0),
            'forwardPE': info.get('forwardPE', 0),
            'dividendYield': info.get('dividendYield', 0) * 100 if info.get('dividendYield') else 0,
            'beta': info.get('beta', 0),
            'earningsDate': info.get('earningsDate', [0])[0] if isinstance(info.get('earningsDate', []), list) and len(info.get('earningsDate', [])) > 0 else 0
        }
        
        # Format historical data
        if not hist.empty:
            historical_data = []
            for date, row in hist.iterrows():
                historical_data.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'open': float(row['Open']),
                    'high': float(row['High']),
                    'low': float(row['Low']),
                    'close': float(row['Close']),
                    'volume': float(row['Volume'])
                })
            
            return jsonify({
                'symbol': symbol,
                'company_info': company_info,
                'historical_data': historical_data
            }), 200
        else:
            return jsonify({"error": "No data available for this symbol"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/market/search', methods=['GET'])
def search_stocks():
    query = request.args.get('query', '')
    if not query or len(query) < 2:
        return jsonify({"error": "Query too short"}), 400
    
    try:
        # Use a predefined list of top stocks for this demo
        top_stocks = [
            {"symbol": "AAPL", "name": "Apple Inc."},
            {"symbol": "MSFT", "name": "Microsoft Corporation"},
            {"symbol": "GOOGL", "name": "Alphabet Inc."},
            {"symbol": "AMZN", "name": "Amazon.com, Inc."},
            {"symbol": "META", "name": "Meta Platforms, Inc."},
            {"symbol": "TSLA", "name": "Tesla, Inc."},
            {"symbol": "NVDA", "name": "NVIDIA Corporation"},
            {"symbol": "JPM", "name": "JPMorgan Chase & Co."},
            {"symbol": "BAC", "name": "Bank of America Corporation"},
            {"symbol": "DIS", "name": "The Walt Disney Company"}
        ]
        
        results = []
        for stock in top_stocks:
            if query.upper() in stock["symbol"] or query.lower() in stock["name"].lower():
                results.append(stock)
        
        return jsonify(results), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Portfolio Routes
@app.route('/api/portfolio', methods=['GET'])
def get_portfolios():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        # Get user's portfolios
        c.execute("SELECT id, name, created_at FROM portfolios WHERE user_id = ?", (user_id,))
        portfolios = [dict(row) for row in c.fetchall()]
        
        # Get stocks for each portfolio
        for portfolio in portfolios:
            c.execute("""
                SELECT symbol, shares, purchase_price, purchase_date 
                FROM portfolio_stocks 
                WHERE portfolio_id = ?
            """, (portfolio['id'],))
            
            stocks = []
            for stock_row in c.fetchall():
                stock_dict = dict(stock_row)
                
                # Get current price (simplified for demo)
                try:
                    ticker = yf.Ticker(stock_dict['symbol'])
                    current_price = ticker.info.get('currentPrice', 0) or ticker.info.get('regularMarketPrice', 0)
                except:
                    current_price = 0
                
                stock_dict['current_price'] = current_price
                stock_dict['current_value'] = current_price * stock_dict['shares']
                stock_dict['purchase_value'] = stock_dict['purchase_price'] * stock_dict['shares']
                stock_dict['gain_loss'] = stock_dict['current_value'] - stock_dict['purchase_value']
                stock_dict['gain_loss_percent'] = (stock_dict['gain_loss'] / stock_dict['purchase_value']) * 100 if stock_dict['purchase_value'] > 0 else 0
                
                stocks.append(stock_dict)
            
            portfolio['stocks'] = stocks
            portfolio['total_value'] = sum(stock['current_value'] for stock in stocks)
            portfolio['total_gain_loss'] = sum(stock['gain_loss'] for stock in stocks)
            portfolio['total_investment'] = sum(stock['purchase_value'] for stock in stocks)
        
        conn.close()
        return jsonify(portfolios), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio/<int:portfolio_id>/add', methods=['POST'])
def add_stock_to_portfolio(portfolio_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.get_json()
    symbol = data.get('symbol')
    shares = data.get('shares')
    purchase_price = data.get('purchase_price')
    
    if not symbol or not shares or not purchase_price:
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        
        # Verify portfolio belongs to user
        c.execute("SELECT id FROM portfolios WHERE id = ? AND user_id = ?", (portfolio_id, user_id))
        portfolio = c.fetchone()
        
        if not portfolio:
            return jsonify({"error": "Portfolio not found or not authorized"}), 404
        
        # Add stock to portfolio
        c.execute("""
            INSERT INTO portfolio_stocks (portfolio_id, symbol, shares, purchase_price)
            VALUES (?, ?, ?, ?)
        """, (portfolio_id, symbol.upper(), shares, purchase_price))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Stock added to portfolio successfully"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        
        c.execute("SELECT id, symbol, added_at FROM watchlists WHERE user_id = ? ORDER BY added_at DESC", (user_id,))
        watchlist_items = [dict(row) for row in c.fetchall()]
        
        # Get current prices
        for item in watchlist_items:
            try:
                ticker = yf.Ticker(item['symbol'])
                info = ticker.info
                item['company_name'] = info.get('shortName', 'Unknown')
                item['current_price'] = info.get('currentPrice', 0) or info.get('regularMarketPrice', 0)
                item['change_percent'] = info.get('regularMarketChangePercent', 0) * 100
            except:
                item['company_name'] = 'Unknown'
                item['current_price'] = 0
                item['change_percent'] = 0
        
        conn.close()
        return jsonify(watchlist_items), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/watchlist/add', methods=['POST'])
def add_to_watchlist():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.get_json()
    symbol = data.get('symbol')
    
    if not symbol:
        return jsonify({"error": "Symbol is required"}), 400
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        
        c.execute("SELECT id FROM watchlists WHERE user_id = ? AND symbol = ?", (user_id, symbol.upper()))
        existing = c.fetchone()
        
        if existing:
            return jsonify({"error": "Symbol already in watchlist"}), 409
        
        c.execute("INSERT INTO watchlists (user_id, symbol) VALUES (?, ?)", (user_id, symbol.upper()))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Added to watchlist successfully"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/watchlist/remove/<int:item_id>', methods=['DELETE'])
def remove_from_watchlist(item_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        
        c.execute("DELETE FROM watchlists WHERE id = ? AND user_id = ?", (item_id, user_id))
        conn.commit()
        
        if c.rowcount == 0:
            return jsonify({"error": "Item not found or not authorized"}), 404
        
        conn.close()
        return jsonify({"message": "Removed from watchlist successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Trading Recommendations
@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        # Get a list of recommended stocks (simplified for demo)
        recommendations = [
            {
                "symbol": "AAPL",
                "name": "Apple Inc.",
                "price": 175.50,
                "recommendation": "Buy",
                "target_price": 200.00,
                "analyst_consensus": "Strong Buy",
                "reason": "Strong product lineup, consistent revenue growth, and expanding services segment."
            },
            {
                "symbol": "MSFT",
                "name": "Microsoft Corporation",
                "price": 350.20,
                "recommendation": "Buy",
                "target_price": 400.00,
                "analyst_consensus": "Strong Buy",
                "reason": "Cloud computing dominance, AI integration, and recurring revenue streams."
            },
            {
                "symbol": "GOOGL",
                "name": "Alphabet Inc.",
                "price": 140.30,
                "recommendation": "Hold",
                "target_price": 155.00,
                "analyst_consensus": "Buy",
                "reason": "Advertising revenue concerns balanced by growth in cloud and AI initiatives."
            },
            {
                "symbol": "META",
                "name": "Meta Platforms, Inc.",
                "price": 310.75,
                "recommendation": "Buy",
                "target_price": 350.00,
                "analyst_consensus": "Buy",
                "reason": "Engagement metrics improving and strategic pivot to AI and metaverse technologies."
            },
            {
                "symbol": "AMZN",
                "name": "Amazon.com, Inc.",
                "price": 145.20,
                "recommendation": "Buy",
                "target_price": 170.00,
                "analyst_consensus": "Strong Buy",
                "reason": "AWS growth, improved e-commerce margins, and advertising segment expansion."
            }
        ]
        
        return jsonify(recommendations), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
