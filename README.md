# Data Engineering Control Center — Interactive Portfolio

An interactive, high-fidelity developer portfolio themed as a **Data Engineering Control Center**. This application models standard operations pipelines (Ingestion, Transformation, Storage, and Deployment/Observability) as an interactive dashboard.

Designed with a deep slate-navy corporate color system, clean relational typography, fluid SVG wire animation flows, and a CRT monitor "Operator Mode" toggle that overlays custom scanlines and terminal skins.

---

## 🚀 Key Features

* **SaaS Workspace Explorer**: A VSCode-style interactive folder explorer showing the structure of the portfolio. Files act as anchors to smooth-scroll and center specific page sections (`block: 'center'`) while rendering micro-code previews on hover.
* **Unified Operations Dashboard**:
  * **Live CLI Tab**: A fully-functional command-line interface that parses SQL queries on your skills (`SELECT * FROM dim_skills`) and experience (`SELECT * FROM fact_experience`), runs pipelines (`trigger taxi`), and displays diagnostic logs.
  * **Airflow DAG Simulator**: Simulates a live data DAG run (NYC Taxi ELT, Travel Assistant API, or Project Management System) step-by-step.
  * **Data Quality Suite**: Sequentially executes assertions (simulating Great Expectations and Pytest) after the DAG completes, automatically changing tabs to display test result logs.
* **Relational Star Schema Model**: Technical skills structured as a star schema entity diagram (`dim_languages`, `dim_tools`, `dim_cloud_ops`, `dim_devops`) centered around a `fact_experience` table. Hovering over dimensions dynamically highlights connection wires.
* **Mouse Aura Tracking**: A smooth, fluid cursor light gradient overlay that tracks coordinates with responsive easing.
* **Operator Mode HUD**: Switches the viewport into a monospaced command center with green CRT monitor scanlines, terminal skins, and custom developer logs.
* **Multilingual Engine**: Complete localized language switching supporting English (EN) and Portuguese (PT).

---

## 🛠️ Tech Stack

* **Backend**: Python (Flask)
* **Frontend**: HTML5, Vanilla CSS3 (Custom properties, grid systems, radial gradients), Modern JavaScript (ES6+, requestAnimationFrame, scroll-centering offsets)
* **Icons & Fonts**: FontAwesome, Devicons, Google Fonts (Inter, JetBrains Mono)
* **Hosting Configuration**: Ready for deployment on Vercel (via WSGI wrapper/serverless configs).

---

## 💻 Local Setup & Execution

### Prerequisites
* Python 3.8+

### Step-by-Step Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   python app.py
   ```

5. Access the site locally in your web browser:
   * **URL**: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🌐 Online Deployment (Vercel)

This project already contains a `vercel.json` configuration file set up for instant serverless deployment using the Python runtime.

### Deploying via Vercel CLI
1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Link and deploy the project:
   ```bash
   vercel
   ```
   *Follow the terminal prompts. Vercel will automatically detect the `vercel.json` file and compile the serverless Python environment.*

3. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 📁 Repository Structure

```text
├── app.py                  # Flask Application Router & localization settings
├── requirements.txt        # Python dependency manifest
├── vercel.json             # Vercel serverless functions deployment manifest
├── static/
│   ├── css/
│   │   └── global.css      # Core Design Tokens, CRT scanlines, and animations
│   ├── js/
│   │   └── main.js         # Sequenced Airflow runners, CLI parsers, and cursor glows
│   └── img/                # Staging assets and icons
└── templates/
    ├── base.html           # Structural HTML wrapper and cursor aura mount
    └── index.html          # Modular sections (Hero Explorer, Projects, Star Schema, Experience)
```
