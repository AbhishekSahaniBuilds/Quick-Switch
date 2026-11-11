# ⚡ Quick Switch

## Fast Response, Less Waiting!

### A fast, lightweight AI chatbot built for instant conversations.

Quick Switch is a lightweight, browser-based AI chatbot designed to make interacting with AI simple, fast, and accessible.

No mandatory login, no signup, and no unnecessary complexity — just open the website, select a model, and start chatting.

Powered by **Groq** and built with **React** and **FastAPI**, Quick Switch focuses on delivering a responsive AI experience without the heavyweight interface of traditional chatbot platforms.

> **Our goal:** Make AI assistance faster, lighter, and easier to access while maintaining powerful AI capabilities.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 Future Goals](#-future-goals)
- [🌐 Live Demo & Links](#-live-demo--links)
- [🛠️ Technology Stack](#️-technology-stack)
- [🏗️ Project Architecture](#️-project-architecture)
- [📂 Project Structure](#-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [📥 Installation and Setup](#-installation-and-setup)
- [🔑 Environment Variables](#-environment-variables)
- [▶️ Running Locally](#️-running-locally)
- [📦 Production Build](#-production-build)
- [☁️ Deployment](#️-deployment)
- [🔌 API Documentation](#-api-documentation)
- [📖 How to Use](#-how-to-use)
- [⚠️ Current Limitations](#️-current-limitations)
- [🔒 Security and Privacy](#-security-and-privacy)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)
- [💻 Developer](#-developer)

---

## ✨ Features

Quick Switch currently includes the following functionality:

### 💬 AI Conversations

- Real-time AI conversations.
- Interact with AI models through a simple chat interface.
- Select an available model before starting a session.

### 🧠 AI Model Selection

- Select between available Groq models.
- Retrieve available model information dynamically through the backend.
- Choose models based on their availability.

### 💾 Conversation History

- Automatically save conversation history.
- Store conversations locally in the browser using `localStorage`.
- No backend database is required for conversation history.

### 🎨 User Interface

- Lightweight and responsive interface.
- Clean and simple design.
- Light theme.
- Mobile-friendly layout.
- Markdown rendering for formatted AI responses.

### ⚙️ Customization

- Settings page for managing chatbot preferences.
- Adjust the AI model's temperature.

### 🔓 No Mandatory Account

- No login required.
- No signup required.
- Start using the chatbot without creating an account.

---

## 🚀 Future Goals

Quick Switch is continuously evolving. The following are ideas and potential improvements, not guaranteed features or delivery commitments.

- [ ] Support additional AI providers.
- [ ] Expand compatibility with more Groq models.
- [ ] Add dark mode.
- [ ] Introduce file and image uploads.
- [ ] Explore voice assistant functionality.
- [ ] Explore Whisper-based speech recognition.
- [ ] Add optional user accounts and authentication.
- [ ] Support multiple separate conversations.
- [ ] Add code syntax highlighting.
- [ ] Explore streaming AI responses.
- [ ] Improve performance and reduce loading time.
- [ ] Maintain a lightweight interface while expanding functionality.

> The main priority is to make Quick Switch faster and more capable without sacrificing its lightweight experience.

---

## 🌐 Live Demo & Links

🚀 **Live Website:** https://abhisheksahanibuilds.github.io/Quick-Switch

⚙️ **Backend API:** https://quick-switch-backend.onrender.com

💻 **GitHub Repository:** https://github.com/AbhishekSahaniBuilds/Quick-Switch

---

## 🛠️ Technology Stack

Quick Switch uses a separate frontend and backend within a single repository.

| Technology     | Purpose                            |
| -------------- | ---------------------------------- |
| React          | Frontend framework                 |
| JavaScript     | Frontend programming language      |
| HTML           | Page structure                     |
| Vanilla CSS    | Styling                            |
| Python         | Backend programming language       |
| FastAPI        | Backend framework                  |
| Axios          | HTTP requests                      |
| Groq API       | AI model integration               |
| localStorage   | Browser-based conversation history |
| GitHub Pages   | Frontend hosting                   |
| GitHub Actions | Automated frontend deployment      |
| Render         | Planned backend hosting            |

---

## 🏗️ Project Architecture

Quick Switch follows a frontend-backend architecture.

```text
                  USER
                    |
                    v
             React Frontend
                    |
                    | HTTP Requests
                    v
              FastAPI Backend
                    |
                    | Groq API
                    v
                GROQ AI
                    |
                    v
             AI Generated Response
                    |
                    v
              React Frontend
                    |
                    v
                  USER
```

### Frontend

- Built with React.
- Handles the chatbot interface and user interactions.
- Communicates with the backend using HTTP requests.
- Stores conversation history in browser `localStorage`.

### Backend

- Built with Python and FastAPI.
- Provides API endpoints for model information and AI conversations.
- Communicates with Groq.
- Keeps the Groq API key on the backend.

---

## 📂 Project Structure

The repository contains both frontend and backend code.

```text
Quick-Switch/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── frontend/
│   ├── src/
│   ├── index.html
│   └── ...
│
├── backend/
│   ├── src/
│   ├── main.py
│   └── ...
│
├── README.md
└── .gitignore
```

| Directory / File               | Description                     |
| ------------------------------ | ------------------------------- |
| `frontend/`                    | React frontend application      |
| `frontend/src/`                | Frontend source code            |
| `backend/`                     | Python backend application      |
| `backend/main.py`              | FastAPI application entry point |
| `backend/src/`                 | Additional backend source code  |
| `.github/workflows/`           | GitHub Actions workflows        |
| `.github/workflows/deploy.yml` | Frontend deployment workflow    |
| `README.md`                    | Project documentation           |
| `.gitignore`                   | Git ignored files configuration |

_This is a simplified project structure. Additional files and directories may exist._

---

## ⚙️ Prerequisites

Before running Quick Switch locally, make sure you have:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Python](https://www.python.org/)
- pip (Python package installer)
- A [Groq API key](https://console.groq.com/keys)
- Git

The exact minimum Node.js and Python versions have not yet been established.

---

## 📥 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AbhishekSahaniBuilds/Quick-Switch.git
```

### 2. Navigate to the Project

```bash
cd Quick-Switch
```

### 3. Set Up the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

### 4. Set Up the Backend

Open another terminal and navigate to the backend directory:

```bash
cd Quick-Switch/backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file in the backend directory and add your Groq API key.

See the [Environment Variables](#-environment-variables) section.

---

## 🔑 Environment Variables

Quick Switch requires a Groq API key to communicate with Groq models.

Create a `.env` file inside the backend directory:

```env
GROQ_API=your_groq_api_key_here
```

| Variable   | Description                      | Required |
| ---------- | -------------------------------- | -------- |
| `GROQ_API` | Groq API key used by the backend | Yes      |

### Important Security Notes

- Never commit your actual `.env` file.
- Never expose your Groq API key in frontend code.
- Keep API keys in backend environment variables.
- Configure environment variables separately on your hosting platform.

Get your API key from:

https://console.groq.com/keys

---

## ▶️ Running Locally

Quick Switch has two independently running applications.

### Start the Frontend

Open a terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by the frontend development server.

### Start the Backend

Open another terminal:

```bash
cd backend
uvicorn main:app --reload
```

If the command above does not work, try the fallback:

```bash
python main.py
```

The backend must be running for AI conversations and model retrieval to work.

---

## 📦 Production Build

To build the React frontend for production:

```bash
cd frontend
npm run build
```

The generated production files will be placed in the build output directory configured by the frontend project.

---

## ☁️ Deployment

Quick Switch keeps both frontend and backend in the same GitHub repository but deploys them separately.

### Frontend Deployment — GitHub Pages

The frontend is deployed using GitHub Pages.

Deployment automation is configured through:

```text
.github/workflows/deploy.yml
```

GitHub Actions automatically handles frontend deployment when code is pushed to the repository.

The workflow is located at the repository root, not inside the frontend directory.

### Backend Deployment — Render

Render is the planned hosting platform for the FastAPI backend.

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Configure the following environment variable in the Render dashboard:

```env
GROQ_API=your_groq_api_key_here
```

**Note:** Backend deployment on Render is not yet completed.

---

## 🔌 API Documentation

Quick Switch uses FastAPI to expose backend endpoints.

### Base Endpoints

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| GET    | `/`               | Basic documentation / Easter egg |
| GET    | `/bot/get_models` | Retrieves available AI models    |
| POST   | `/bot/prompt`     | Sends a prompt to an AI model    |

### 1. GET `/`

Provides basic documentation information.

This endpoint is not used by the frontend and exists as an Easter egg.

### 2. GET `/bot/get_models`

Retrieves the available AI models.

The endpoint provides model information including:

- Provider
- Owner name
- Model ID

The frontend uses this endpoint to populate the model selection interface.

### 3. POST `/bot/prompt`

Sends a prompt to the selected AI model.

#### Request Model

The endpoint uses the following Pydantic model:

```python
class PromptModel(BaseModel):
    provider: str
    model: str
    temperature: float
    owner: Optional[str] = ""
    prompt: Optional[str] = None
    sys_prompt: Optional[str] = None
    messages: Optional[List[Dict[str, Any]]] = None
```

#### Request Fields

| Field         | Type                             | Description           |
| ------------- | -------------------------------- | --------------------- |
| `provider`    | `str`                            | AI provider           |
| `model`       | `str`                            | Selected model ID     |
| `temperature` | `float`                          | Model temperature     |
| `owner`       | `Optional[str]`                  | Model owner           |
| `prompt`      | `Optional[str]`                  | User prompt           |
| `sys_prompt`  | `Optional[str]`                  | System prompt         |
| `messages`    | `Optional[List[Dict[str, Any]]]` | Conversation messages |

The exact response schema and HTTP error formats have not yet been documented.

### Authentication

API authentication is currently not implemented.

---

## 📖 How to Use

Getting started with Quick Switch is simple.

1. Open the Quick Switch website.
2. Click **Start the Session**.
3. Select an available AI model.
4. Start chatting with the AI.
5. Your conversation history is automatically saved in browser storage.
6. Open the Settings page to manage preferences.
7. Adjust the model temperature if needed.

No account creation or login is required.

---

## ⚠️ Current Limitations

Quick Switch is actively being developed. Some features are not currently available.

| Feature                         | Current Status                    |
| ------------------------------- | --------------------------------- |
| Multiple AI providers           | Only Groq is integrated           |
| All Groq models                 | Some models do not currently work |
| Multiple separate conversations | Not available                     |
| Code syntax highlighting        | Not available                     |
| Streaming responses             | Not available                     |
| Dark mode                       | Not available                     |
| File and image uploads          | Not available                     |
| Voice interaction               | Not available                     |
| User authentication             | Not available                     |
| Backend deployment              | Not completed                     |

The project may change as development continues.

---

## 🔒 Security and Privacy

Quick Switch is designed to work without mandatory user accounts.

### API Key Handling

- The Groq API key is configured on the backend.
- API credentials should never be included in frontend source code.
- Developers should use environment variables to configure secrets.

### Conversation History

- Conversation history is stored locally using browser `localStorage`.
- No backend conversation database is currently used.
- Clearing browser storage may remove saved conversations.

### AI Processing

User prompts are sent to Groq through the backend for AI processing.

Users should avoid entering sensitive personal information into AI conversations.

---

## 🤝 Contributing

Contributions to Quick Switch are welcome!

If you are a developer and want to improve the project, you can contribute.

### How to Contribute

1. Fork the repository.
2. Clone your fork.
3. Create a new branch.
4. Make your changes.
5. Test your changes.
6. Commit and push your changes.
7. Open a Pull Request.

### Example Commands

```bash
# Fork the repository on GitHub first

git clone https://github.com/YOUR_USERNAME/Quick-Switch.git

cd Quick-Switch

# Create a new branch
git checkout -b feature/your-feature-name

# Stage your changes
git add .

# Commit changes
git commit -m "Add: your feature description"

# Push your branch
git push origin feature/your-feature-name
```

Please keep contributions focused on improving performance, usability, reliability, and maintainability.

---

## 📜 License

Quick Switch is an open-source project in intent.

**No formal open-source license has currently been added to this repository.**

Until a license is selected and included, the project's reuse, modification, and redistribution permissions are not formally defined.

---

## 🙏 Acknowledgements

Quick Switch is built with the help of these technologies and services:

- [Groq](https://groq.com/) — AI inference and model access.
- [React](https://react.dev/) — Frontend library.
- [FastAPI](https://fastapi.tiangolo.com/) — Python backend framework.
- [Render](https://render.com/) — Planned backend hosting platform.

---

## 💻 Developer

**Abhishek Sahani**

Creator and developer of Quick Switch.

GitHub: [@AbhishekSahaniBuilds](https://github.com/AbhishekSahaniBuilds)

Project Repository:

[Quick Switch on GitHub](https://github.com/AbhishekSahaniBuilds/Quick-Switch)

**Personal Note:** <i>"Hi! I am Abhishek Sahani. This project took over 1.5 months to build. First, I created the backend routers and then started fetching them from my React frontend. Throughout this process, I learned how React works and how to implement it in a real-world application. I hope you love Quick Switch. It is not perfect—for example, it sometimes doesn't answer long math problems, or it uses the number 11 as a placeholder, etc. I tried my best to fix these issues and will keep working hard until they are gone."</i>

---

<p align="center">
  Made with ❤️ by Abhishek Sahani
  <br>
  <strong>Quick Switch — Fast Response, Less Waiting.</strong>
</p>
