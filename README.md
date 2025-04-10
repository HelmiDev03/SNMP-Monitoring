# 📡 SNMP Monitoring Dashboard

This project is a real-time SNMP monitoring dashboard that:

- 🐍 Uses **FastAPI (Python)** to request SNMP data from `localhost`
- ⚛️ Uses **React + Vite** for the frontend to display system and network interface data
- 📥 Supports exporting logs and graphing stats post-capture

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/SNMP-Monitoring.git
cd SNMP-Monitoring
```

### 🐍 Backend Setup (FastAPI + SNMP)

#### 📦 Install Dependencies

```bash
cd fastapi
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### ▶️ Run the API Server

```bash
uvicorn main:app --reload
```

Server will run at [http://localhost:8000](http://localhost:8000)

> **Note**: Make sure the SNMP agent is active and accessible on your machine.

### ⚛️ Frontend Setup (React + Vite)

#### 📦 Install Node Modules

```bash
cd frontend
npm install
```

#### ▶️ Start the Frontend App

```bash
npm run dev
```

App will be available at [http://localhost:5173](http://localhost:5173)



---

## 🛠️ Features

### 🔧 System Info

- Shows hostname, OS type, and basic system specs.
![](/screens/systemsettings.png)

### 🌐 Network Interfaces

- Lists all active interfaces found on the machine 
![](/screens/interfaces.png)

### 📶 Focus: Interface 15 (Wi-Fi)

- Live tracking of:
    - **Bytes Sent**
    - **Bytes Received**
    - **Delta Sent** (change over last 5s)
    - **Delta Received**
- Repeats every 5 seconds.
- Data stops when the user clicks **Stop**.

### 📊 Graphs After Stop
![](/screens/interfacedetail1.png)
![](/screens/interfacedetail2.png)
![](/screens/interfacedetail3.png)
![](/screens/interfacedetail4.png)

- **X-axis**: time (timestamps of SNMP requests).
- **Y-axis**: each of the 4 values (sent, received, deltas).

### 📥 Log Export

- User can download full monitoring logs in txt File.
![System Settings](/screens/interfacedetail5.png)

### 🌐 IP Info Display

- Similar to `ipconfig`/`ifconfig`, but formatted and labeled for clarity.
![System Settings](/screens/ipadresses.png)


