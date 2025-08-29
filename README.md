# 🌌 Stargate Dual Portal Simulation System

[![WebSocket Status](https://img.shields.io/badge/WebSocket-Stable-green)](https://github.com/nbbulk-dotcom/Stargate_Simulation)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/nbbulk-dotcom/Stargate_Simulation)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A comprehensive real-time simulation system for dual portal stargate operations, featuring advanced physics calculations, 3D visualizations, and WebSocket-powered live monitoring across multiple display screens.

![Stargate Simulation Interface](screenshots/stargate_interface.png)

## 🚀 Live Demo

**🌐 [Access the Live Stargate Simulation System](https://deployment-url-will-be-updated)**

*Experience the full 3-screen monitoring interface with real-time physics calculations and WebSocket connectivity.*

## ✨ Features

### 🔬 **Advanced Physics Engine**
- **Real-world calculations** - No shortcuts or assumptions
- **Quantum field dynamics** with proper mathematical models
- **Energy conservation** across portal operations
- **Frequency synchronization** between dual portals
- **Bridge stability** calculations with real-time monitoring

### 🖥️ **Multi-Screen Interface**
- **Monitor 1: Stargate 1** - Primary portal control and status
- **Monitor 2: Stargate 2** - Secondary portal control and status  
- **Monitor 3: Bridge & System** - Central command and bridge formation

### 📡 **Real-Time Connectivity**
- **WebSocket integration** for live data streaming
- **Stable connection management** with automatic reconnection
- **Real-time parameter updates** across all displays
- **Live event logging** and system monitoring

### 🎛️ **Interactive Controls**
- **Initialize Simulation** - Start portal operations
- **Parameter adjustment** - Real-time physics tuning
- **Bridge formation** - Establish inter-portal connections
- **Payload transfer** - Manage matter/energy transport

### 📊 **Comprehensive Monitoring**
- **3D Portal Visualization** - Six-sphere geometric configurations
- **Energy flow tracking** - Real-time power consumption
- **Frequency stability** - Harmonic resonance monitoring
- **Safety systems** - Automated protection protocols

## 🛠️ Technology Stack

### Backend
- **FastAPI** - High-performance async web framework
- **WebSocket** - Real-time bidirectional communication
- **Python 3.12** - Advanced physics calculations
- **Uvicorn** - ASGI server with WebSocket support

### Frontend
- **React 18** - Modern component-based UI
- **TypeScript** - Type-safe development
- **Vite** - Fast build tooling and dev server
- **Tailwind CSS** - Utility-first styling
- **Three.js** - 3D portal visualizations

### Infrastructure
- **Docker** - Containerized deployment
- **Fly.io** - Cloud hosting platform
- **Git** - Version control with branch management

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm/pnpm**
- **Python 3.12+** with **pip**
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/nbbulk-dotcom/Stargate_Simulation.git
cd stargate_backend_render
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload --ws websockets
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd web_frontend

# Install dependencies
npm install

# Start development server
npm run dev -- --host 0.0.0.0 --port 5173
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **WebSocket**: ws://localhost:8080/ws

## 📖 Documentation

### 📚 **Comprehensive Guides**
The system includes four detailed documentation files accessible directly from the interface:

1. **[Stargate Operating Manual](docs/STARGATE_OPERATING_MANUAL.md)**
   - Complete system overview and physics parameters
   - Visual display explanations and safety protocols
   - Step-by-step operation procedures

2. **[Parameter Guide](docs/PARAMETER_GUIDE.md)**
   - Detailed explanations of all adjustable parameters
   - Energy, frequency, payload, and optimization settings
   - Real-world physics correlations

3. **[Display Systems Guide](docs/DISPLAY_SYSTEMS_GUIDE.md)**
   - Complete guide to all visual displays and 3D screens
   - Monitoring dashboard explanations
   - Status indicator meanings

4. **[Central Command Guide](docs/CENTRAL_COMMAND_GUIDE.md)**
   - Operation guide for central command screen
   - Bridge formation controls and transfer operations
   - Emergency procedures and safety systems

### 🔧 **API Documentation**
- **GET /api/status** - System health check
- **POST /api/initialize** - Initialize simulation with parameters
- **POST /api/load_payload** - Configure payload parameters
- **POST /api/apply_optimal_params** - Apply optimized settings
- **WebSocket /ws** - Real-time data streaming

## 🎮 Usage Instructions

### 🚀 **Starting a Simulation**
1. **Access the interface** at the live demo link
2. **Click "Initialize Simulation"** to start portal operations
3. **Monitor the three screens** for real-time data updates
4. **Observe WebSocket status** (should show "Connected" in green)

### 📊 **Reading the Displays**

#### **Portal Monitors (1 & 2)**
- **Frequency**: Portal resonance frequency (Hz)
- **Stability**: Portal field stability coefficient
- **Power**: Energy consumption (Watts)
- **Energy Delivered**: Total energy output (Joules)
- **Floor Temperature**: Ambient temperature (°C)
- **Floor Contact**: Physical connection status
- **Safety Status**: Automated safety system status

#### **Bridge & System Monitor (3)**
- **Bridge Strength**: Inter-portal connection stability
- **Transfer Energy**: Energy available for payload transport
- **Detune**: Frequency synchronization offset
- **Payload Transfer Direction**: Matter/energy flow visualization
- **Real-Time Monitoring Dashboard**: Live system metrics
- **Event Log**: Chronological system events

### 🔧 **Advanced Operations**
- **Parameter Optimization**: Use automated parameter sweeps
- **Manual Adjustments**: Fine-tune individual parameters
- **Safety Monitoring**: Watch for automated safety triggers
- **Bridge Formation**: Establish stable inter-portal connections

## 🏗️ Architecture

### 🔄 **Data Flow**
```
Frontend (React) ←→ WebSocket ←→ Backend (FastAPI) ←→ Physics Engine
     ↓                                    ↓
3D Visualizations                  Real-time Calculations
     ↓                                    ↓
User Interface                     Database/State Management
```

### 🧩 **Component Structure**
- **App.tsx** - Main application with WebSocket management
- **PortalDisplay.tsx** - Individual portal monitoring components
- **BridgeDisplay.tsx** - Central command and bridge controls
- **3D Components** - Three.js portal visualizations

### 🔌 **WebSocket Implementation**
- **Stable connection management** with 3000ms reconnection delay
- **Error handling** with try-catch wrappers
- **Real-time data streaming** for all simulation parameters
- **Connection status monitoring** with visual indicators

## 🚀 Deployment

### 🐳 **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

### ☁️ **Cloud Deployment**
The system is deployed on **Fly.io** with:
- **Backend**: Containerized FastAPI application
- **Frontend**: Static site deployment
- **WebSocket**: Persistent connection support
- **Auto-scaling**: Based on traffic demands

## 🔧 Development

### 🛠️ **Local Development**
```bash
# Backend development
python -m uvicorn main:app --reload --ws websockets

# Frontend development  
npm run dev

# Build for production
npm run build
```

### 🧪 **Testing**
```bash
# Run backend tests
python -m pytest

# Run frontend tests
npm test

# WebSocket connection test
python test_websocket.py
```

### 📝 **Code Quality**
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Git hooks** for pre-commit checks

## 🤝 Contributing

### 🔀 **Development Workflow**
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### 📋 **Contribution Guidelines**
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation for API changes
- Ensure WebSocket stability in all changes

## 🐛 Troubleshooting

### 🔌 **WebSocket Issues**
- **Connection Failed**: Check backend server is running on port 8080
- **Rapid Reconnections**: Verify 3000ms delay implementation
- **Data Not Updating**: Check browser console for WebSocket errors

### 🖥️ **Display Issues**
- **Blank Screens**: Click "Initialize Simulation" to start data flow
- **Missing Data**: Verify WebSocket connection status (should be green)
- **3D Not Loading**: Check browser WebGL support

### 🚀 **Performance Issues**
- **Slow Loading**: Check network connection and server status
- **High CPU Usage**: Monitor physics calculation complexity
- **Memory Leaks**: Restart browser tab if issues persist

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Physics Calculations**: Based on real-world quantum field theory
- **3D Visualizations**: Powered by Three.js community
- **WebSocket Implementation**: FastAPI and modern web standards
- **UI Design**: Inspired by sci-fi command interfaces

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/nbbulk-dotcom/Stargate_Simulation/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nbbulk-dotcom/Stargate_Simulation/discussions)
- **Email**: support@stargate-simulation.com

---

**🌌 Experience the future of portal technology with real-time physics simulation and advanced monitoring systems.**

*Built with ❤️ by the Stargate Simulation Team*
