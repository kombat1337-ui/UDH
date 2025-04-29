# UDH
🌌 Quantum LOL
🚀 Quantum LOL - remote device management
Quantum LOL is a cross-platform application to connect, transfer files and manage screens between all your devices over a local network.

Everything happens over unique tokens.
Secure. Instantly. Local.

📸 Screenshots

🛠 How to install
Download Openssl 3.5 and Node.js into ur project.
after: 
git clone https://github.com/your-username/QuantumLOL.git
cd QuantumLOL
npm install
npm start
⚙️ How to use
Open the application - a device token will be generated.

Click Connect Device ➔ enter another device token.

Use Sync Devices to synchronise files.

View the other device's screen via View Screen.

🧠 Technologies used
Electron - for cross-platform GUI.

Node.js + Express + WebSocket - backend.

FastAPI - for token generation.

HTML5 Canvas - for beautiful background animations.

CSS3 - neon theme and effects.

📂 Project structure
bash
Copy
Edit
/QuantumLOL
 |- index.html # GUI
 |- main.js # Electron launcher
 |- server.js # WebSocket server + HTTP API
 |- package.json # npm scripts and dependencies
 |- /assets # (optional) images, icons
📜 Licence
The project is distributed under MIT License.
