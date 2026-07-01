from flask import Flask, render_template, session, redirect, url_for, request

app = Flask(__name__)
app.secret_key = "gustavo_traldi_portfolio_secure_secret_key_2026"

# Projects Data List
PROJECTS = [
    {
        "title": "NYC Taxi ELT Pipeline",
        "image_filename": "logo_gestao.png",
        "link": "https://github.com/gtraldi/nyc-taxi-elt-pipeline",
        "desc_en": "Data Engineering pipeline extracting yellow taxi trip data. Integrates timezone-aware calculations, Airflow TaskFlow schedules, and dbt models loading into PostgreSQL.",
        "desc_pt": "Pipeline de engenharia de dados consumindo viagens de táxi de NYC. Integra regras de fuso horário, agendamentos com Airflow TaskFlow e modelos dbt no PostgreSQL.",
        "tags": ["Python", "Apache Airflow", "dbt", "PostgreSQL", "ETL"]
    },
    {
        "title": "Travel Assistant API",
        "image_filename": "logo_viagens.jpg",
        "link": "https://github.com/gtraldi/travel-assistant-api",
        "desc_en": "Robust travel management API built with Flask. Features request body validation, date boundary logic, automated bootstrapping, and fully containerized deployments.",
        "desc_pt": "API robusta de gerenciamento de viagens desenvolvida em Flask. Contém validação de payloads, segurança de prazos, auto-bootstrapping e containerização com Docker.",
        "tags": ["Python", "Flask", "SQLite", "Docker", "Pytest"]
    },
    {
        "title": "Project Management System",
        "image_filename": "logo_gestao.png",
        "link": "https://github.com/gtraldi/abstract-project-management-system",
        "desc_en": "Console-based project manager. Refactored to eliminate SQL injections via parameterized queries, implement transaction context managers, and secure passwords with bcrypt.",
        "desc_pt": "Gerenciador de projetos por console. Refatorado para sanar injeções de SQL via consultas parametrizadas, gerenciar sessões de banco e senhas salgadas com bcrypt.",
        "tags": ["Python", "SQLite", "Bcrypt", "Pytest", "Security"]
    },
    {
        "title": "Green Data Center Page",
        "image_filename": "logo_data_center.png",
        "link": "https://github.com/gtraldi/data-center-html-page",
        "desc_en": "A highly responsive institutional landing website built to showcase eco-friendly Green Data Centers. Designed with glassmorphic cards and structured semantic SEO metadata.",
        "desc_pt": "Site institucional responsivo sobre o conceito e relevância dos Green Data Centers. Projetado com elementos em glassmorphism e metadados estruturados para SEO.",
        "tags": ["HTML5", "CSS3", "Vanilla JS", "Tailwind CSS", "UI/UX"]
    }
]

@app.before_request
def ensure_language():
    """Ensure session has a default language set."""
    if "lang" not in session:
        session["lang"] = "pt"

@app.route("/")
def home():
    return render_template("index.html", projects=PROJECTS)

@app.route("/projects")
def projects():
    return redirect("/#projects")

@app.route("/contact")
def contact():
    return redirect("/#contact")

@app.route("/set-language/<lang>")
def set_language(lang):
    """Update session language and redirect back to referrer page."""
    if lang in ["en", "pt"]:
        session["lang"] = lang
    
    referrer = request.referrer
    if referrer and request.host in referrer:
        return redirect(referrer)
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)