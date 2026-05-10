# URL Shortener with Click Analytics 📊

A backend URL shortener service built with **Node.js, Express.js, and MongoDB**, featuring real-time click tracking and GeoIP-based analytics.

---

## 🚀 Project Overview

This project allows users to shorten long URLs into compact links and tracks every click on those links for analytics purposes. It captures useful metadata such as IP address, location (country and city), and click history.

The system is designed with scalability in mind and demonstrates core backend engineering concepts such as API design, database modeling, and request tracking.

---

## ✨ Features

- 🔗 Generate unique short URLs from long links  
- 🔁 Redirect users from short URLs to original URLs  
- 📈 Track total clicks per short link  
- 🕒 Store recent click history  
- 🌍 Geo-location tracking using IP address (country & city)  
- 🧠 IP extraction using `request-ip`  
- 📡 GeoIP lookup using `geoip-lite`  
- 🗄️ MongoDB schema design for URLs and click events  
- ⚠️ Error handling for invalid or missing short codes  
- 🔒 Duplicate prevention using indexed fields  

---

## 🧰 Tech Stack

- Node.js  
- Express.js  
- MongoDB + Mongoose  
- geoip-lite  
- request-ip  

---

## 📊 How It Works

1. User submits a long URL  
2. System generates a unique short code  
3. Short URL is stored in MongoDB  
4. When the short URL is accessed:
   - Original URL is retrieved  
   - Click is recorded  
   - IP address is captured  
   - Geo-location is resolved (country, city)  
   - User is redirected  

---

## 📌 Example Click Data

```json
{
  "ipAddress": "102.90.xxx.xxx",
  "country": "NG",
  "city": "Port Harcourt",
  "clickedAt": "2026-05-10T00:00:00.000Z"
}


🛠️ Installation & Setup

git clone https://github.com/emmygrammy/url_shortener.git
cd url_shortener
npm install
npm run dev

🔮 Future Improvements

User authentication system
Dashboard for analytics visualization
Rate limiting & security enhancements
QR code generation for short links
Advanced analytics (device, browser tracking)

👨‍💻 Author

Built by Emmanuel
Backend Developer | Node.js | Express | MongoDB