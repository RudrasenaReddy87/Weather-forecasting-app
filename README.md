# Weather Forecasting
This is a responsive, real-time Weather Forecasting Web Application built using HTML, CSS, JavaScript, and Node.js, designed to provide users with up-to-date weather information and air quality index (AQI) for any city worldwide.

The app features a clean and modern user interface where users can search for a location and instantly view current weather conditions, a 6-day forecast, temperature, humidity, wind speed, and AQI data. It fetches weather data from WeatherAPI.com, with the backend server built in Node.js and deployed on Render, while the frontend is hosted on Vercel for high availability and performance.

This project demonstrates full-stack development principles, API integration, and responsive UI design, making it a valuable learning resource and a practical tool.

[![Live Site](https://img.shields.io/badge/Live%20App-Online-green?style=for-the-badge)](https://weather-forecasting-app-7m71.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge)](https://github.com/RudrasenaReddy87/Weather-forecasting-app)
[![GitHub](https://img.shields.io/badge/GitHub-View_Profile-black?logo=github)](https://github.com/RudrasenaReddy87)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-View_Profile-blue?logo=linkedin)](https://www.linkedin.com/in/bodireddyrudrasenareddy)


---

## 🔗 Live Demo

🌐 **[Access the app here](https://weather-forecasting-app-7m71.onrender.com/)**  
Deployed using **[Vercel](https://vercel.com/)** for the frontend and **[Render](https://render.com/)** for the backend API.

---

## 📸 Preview

<img width="1920" height="1080" alt="Screenshot (74)" src="https://github.com/user-attachments/assets/dcca06e8-e155-49d1-bf18-c308b65e31eb" />
<img width="1920" height="1080" alt="Screenshot (75)" src="https://github.com/user-attachments/assets/437314a8-d4d1-4995-879d-fbaa36deefab" />

---
## 📂Folder ( Weather App)
```
📂 WEATHER APP
├── 📄 .gitignore
├── 📂 backend
│   ├── 📂 node_modules
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   └── 🟨 server.js
├── 📂 public
│   ├── 📂 images
│   ├── 📂 node_modules
│   ├── 📄 index.html
│   ├── 📄 manifest.json
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   ├── 📄 README.md
│   ├── 🟨 script.js
│   ├── 🎨 style.css
│   └── 🟨 sw.js
├── 🟢 .env
├── 📄 LICENSE
└── 📄 vercel.json
```
---

## ⚙️ Tech Stack
[![HTML](https://img.shields.io/badge/Tech-HTML-orange?style=flat-square&logo=html5)]()
[![CSS](https://img.shields.io/badge/Tech-CSS-blue?style=flat-square&logo=css3)]()
[![JavaScript](https://img.shields.io/badge/Tech-JavaScript-yellow?style=flat-square&logo=javascript)]()
[![Node.js](https://img.shields.io/badge/Tech-Node.js-brightgreen?style=flat-square&logo=node.js)]()
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **API Provider:** [WeatherAPI.com](https://www.weatherapi.com/)
- **Deployment Platforms:**
  - **Frontend:** [Vercel](https://vercel.com/)
  - **Backend/API:** [Render](https://render.com/)

---

## 📦 Features

- Real-time weather search by location
- 6-day weather forecast
- Air Quality Index (AQI) display
- Fully responsive design for all devices
- Clean and modern UI
- Error handling for invalid city names
- Custom background support


---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- Vercel or any hosting account (for deployment)
- Weather API key from [WeatherAPI.com](https://www.weatherapi.com/)

### Setup Instructions

```bash
# Clone the repo
git clone https://github.com/RudrasenaReddy87/Weather-forecasting-app

# Go to backend directory
cd Weather-forecasting-app/backend

# Install dependencies
npm install

# Create .env file
touch .env

# Add your API key to .env
WEATHERAPI_KEY=your_api_key_here
PORT=3000

# Run the server
node server.js



