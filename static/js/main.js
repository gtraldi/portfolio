document.addEventListener('DOMContentLoaded', () => {
    // ── Mobile Menu Toggle ──
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav-links');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show');
            const icon = toggle.querySelector('i');
            if (icon) icon.className = nav.classList.contains('show')
                ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
        nav.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => {
                nav.classList.remove('show');
                const icon = toggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            })
        );
    }

    // ── Tab Switcher System ──
    const tabs = document.querySelectorAll('.dashboard-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab-target');
            
            tabs.forEach(t => t.classList.remove('active-tab'));
            contents.forEach(c => c.classList.remove('active-content'));
            
            tab.classList.add('active-tab');
            const targetContent = document.getElementById(target);
            if (targetContent) targetContent.classList.add('active-content');
        });
    });

    function switchTab(tabId) {
        const tabBtn = document.querySelector(`.dashboard-tab[data-tab-target="${tabId}"]`);
        if (tabBtn) tabBtn.click();
    }

    // ── Star Schema Hover Highlights ──
    const erTables = document.querySelectorAll('.er-table');
    erTables.forEach(table => {
        const wireId = table.getAttribute('data-wire');
        if (wireId) {
            const wire = document.getElementById(wireId);
            table.addEventListener('mouseenter', () => {
                if (wire) wire.classList.add('highlighted');
            });
            table.addEventListener('mouseleave', () => {
                if (wire) wire.classList.remove('highlighted');
            });
        }
    });

    // ── Simulated Terminal & Shell Parser ──
    const bodyTerminal = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-query-input');
    
    function logToTerminal(linesToWrite, clear = false) {
        if (!bodyTerminal) return;
        if (clear) bodyTerminal.innerHTML = '';
        
        let lineIdx = 0;
        
        function writeLine() {
            if (lineIdx >= linesToWrite.length) {
                const cursor = document.createElement('span');
                cursor.className = 'terminal-cursor';
                cursor.innerHTML = '&nbsp;';
                bodyTerminal.appendChild(cursor);
                bodyTerminal.scrollTop = bodyTerminal.scrollHeight;
                return;
            }
            
            const line = linesToWrite[lineIdx];
            
            if (line.blank) {
                bodyTerminal.appendChild(document.createElement('br'));
                lineIdx++;
                writeLine();
                return;
            }
            
            const el = document.createElement('div');
            el.className = 'terminal-line';
            
            if (line.prompt) {
                const promptSpan = document.createElement('span');
                promptSpan.className = 'terminal-prompt';
                promptSpan.textContent = 'gtraldi@local-dev:~$ ';
                el.appendChild(promptSpan);
                
                const cmdSpan = document.createElement('span');
                cmdSpan.className = 'terminal-cmd';
                cmdSpan.textContent = line.text;
                el.appendChild(cmdSpan);
            } else {
                if (line.success) el.className += ' terminal-success';
                else if (line.info) el.className += ' terminal-info';
                else el.className += ' terminal-output';
                
                el.textContent = line.text;
            }
            
            bodyTerminal.appendChild(el);
            lineIdx++;
            bodyTerminal.scrollTop = bodyTerminal.scrollHeight;
            setTimeout(writeLine, line.prompt ? 150 : 15);
        }
        
        writeLine();
    }

    // Default startup animation
    const startupLines = [
        { prompt: true, text: 'whoami' },
        { output: true, text: 'gustavo-traldi-pereira  ·  lead data platform engineer' },
        { blank: true },
        { prompt: true, text: 'help;' },
        { output: true, text: 'Interactive SQL Query Parser v2 online.' },
        { output: true, text: 'Available query tables: dim_skills, fact_experience' },
        { output: true, text: 'Available commands: TRIGGER <pipeline_name>;, HELP;, CLEAR;' },
        { success: true, text: 'Ready. Select a project dropdown on the right or type SQL.' }
    ];
    logToTerminal(startupLines);

    // ── Pipelines & Orchestrator Config (Aligned to actual GitHub projects) ──
    const pipelines = {
        taxi: {
            name: "nyc-taxi-elt-pipeline",
            key: "taxi",
            nodes: [
                { id: "extract", label: "Extract (API)", icon: "fa-solid fa-cloud-arrow-down" },
                { id: "load", label: "Stage (Load)", icon: "fa-solid fa-database" },
                { id: "transform", label: "Transform (dbt)", icon: "fa-solid fa-cube" },
                { id: "audit", label: "Audit (dbt test)", icon: "fa-solid fa-circle-check" }
            ],
            assertions: [
                "expect_raw_parquet_chunk_not_empty // extract_raw_data",
                "expect_column_min_to_be_positive // trip_distance",
                "expect_table_columns_to_match_schema // stg_nyc_yellow_trip",
                "expect_pickup_is_before_dropoff // assert_pickup_is_before_dropoff"
            ],
            logs: [
                [
                    { info: true, text: "[INFO] Task Extract: extract_raw_data starting..." },
                    { info: true, text: "Python API get: Ingesting yellow taxi trip parquet chunks..." },
                    { success: true, text: "[OK]   Ingestion complete: ~20M records extracted from NYC data source." }
                ],
                [
                    { info: true, text: "[INFO] Task Stage: load_to_postgres starting..." },
                    { info: true, text: "Executing raw staging loading schemas into PostgreSQL database..." },
                    { success: true, text: "[OK]   COPY command success. 20,452,918 staging rows loaded." }
                ],
                [
                    { info: true, text: "[INFO] Task Transform: dbt staging compile starting..." },
                    { output: true, text: "Found 12 models, 42 tests, 8 sources." },
                    { success: true, text: "[SUCCESS] dbt run complete: staging.stg_nyc_yellow_trip (20M rows transformed)" }
                ],
                [
                    { info: true, text: "[INFO] Task Audit: dbt test schema check starting..." },
                    { success: true, text: "PASS assert_pickup_is_before_dropoff" },
                    { success: true, text: "[OK]   All schema assertions passed. Data quality constraints validated." }
                ]
            ],
            commands: [
                {
                    label: "⚡ Trigger Pipeline",
                    isTrigger: true
                },
                {
                    label: "🔍 Inspect Schema (dbt)",
                    isTrigger: false,
                    logs: [
                        { prompt: true, text: "dbt test --select stg_nyc_yellow_trip" },
                        { info: true, text: "Found 1 custom schema assertion, 3 column validations." },
                        { info: true, text: "Concurrency set to 4 threads." },
                        { success: true, text: "PASS test_is_positive_stg_nyc_yellow_trip_passenger_count" },
                        { success: true, text: "PASS assert_pickup_is_before_dropoff" },
                        { success: true, text: "[OK] All checks passed successfully. 0 failures found." }
                    ],
                    glowNodes: ["audit"],
                    passRules: [1, 2, 3]
                }
            ]
        },
        travel: {
            name: "travel-assistant-api",
            key: "travel",
            nodes: [
                { id: "ingress", label: "Ingress (Flask)", icon: "fa-solid fa-globe" },
                { id: "validate", label: "Validation", icon: "fa-solid fa-shield-halved" },
                { id: "storage", label: "SQLite Load", icon: "fa-solid fa-database" },
                { id: "pytest", label: "Pytest Run", icon: "fa-solid fa-vial" }
            ],
            assertions: [
                "expect_endpoint_response_200 // GET /api/v1/destinations",
                "expect_no_sql_injection // parameter_validation",
                "expect_sqlite_row_count_greater_than_zero // insert_trip",
                "expect_pytest_status_code_pass // automated_unit_tests"
            ],
            logs: [
                [
                    { info: true, text: "[INFO] Route: POST /api/v1/destinations starting..." },
                    { info: true, text: "Flask application blueprints loaded. Listening on port 5000..." },
                    { success: true, text: "[OK]   Flask worker process active. Ingress connection stable." }
                ],
                [
                    { info: true, text: "[INFO] Validation: Payload bounds and data bounds check starting..." },
                    { info: true, text: "Checking coordinate ranges and data limits..." },
                    { success: true, text: "[OK]   Trip dates check passed: departure is prior to arrival." }
                ],
                [
                    { info: true, text: "[INFO] Storage: SQLite write query starting..." },
                    { info: true, text: "Securing cpf passwords with Bcrypt salting strength 12..." },
                    { success: true, text: "[OK]   Row successfully written to local SQLite database: tbl_trips." }
                ],
                [
                    { info: true, text: "[INFO] Pytest: Running controller assertions starting..." },
                    { output: true, text: "tests/test_controllers.py::test_trip_creator_invalid_email PASSED" },
                    { success: true, text: "[OK]   All travel API unit test suites executed with 0 failures." }
                ]
            ],
            commands: [
                {
                    label: "⚡ Trigger Pipeline",
                    isTrigger: true
                },
                {
                    label: "🔍 Run API Unit Tests",
                    isTrigger: false,
                    logs: [
                        { prompt: true, text: "pytest tests/test_controllers.py -v" },
                        { info: true, text: "=================== test session starts ===================" },
                        { output: true, text: "tests/test_controllers.py::test_trip_creator_invalid_email PASSED" },
                        { output: true, text: "tests/test_controllers.py::test_trip_creator_invalid_date_range PASSED" },
                        { success: true, text: "=================== 2 passed in 0.12s ===================" }
                    ],
                    glowNodes: ["storage", "pytest"],
                    passRules: [2, 3]
                }
            ]
        },
        mgmt: {
            name: "project-management-system",
            key: "mgmt",
            nodes: [
                { id: "console", label: "Console CLI", icon: "fa-solid fa-terminal" },
                { id: "auth", label: "Bcrypt Auth", icon: "fa-solid fa-key" },
                { id: "query", label: "SQLite Query", icon: "fa-solid fa-database" },
                { id: "pytest", label: "Pytest Run", icon: "fa-solid fa-vial" }
            ],
            assertions: [
                "expect_bcrypt_password_verification_pass // verify_password",
                "expect_cpf_regex_format_check_pass // cpf_validation",
                "expect_db_session_rollback_on_failure // transaction_manager",
                "expect_pytest_console_pass // app_tests"
            ],
            logs: [
                [
                    { info: true, text: "[INFO] CLI: Initializing interactive console menu..." },
                    { info: true, text: "Displaying project manager options prompt..." },
                    { success: true, text: "[OK]   Terminal loop listening on stdin inputs." }
                ],
                [
                    { info: true, text: "[INFO] Auth: Verifying passwords with Bcrypt credentials..." },
                    { info: true, text: "Bcrypt check_password_hash executing..." },
                    { success: true, text: "[OK]   Password matches salted hash registry. Authorization granted." }
                ],
                [
                    { info: true, text: "[INFO] Query: Accessing local SQLite transaction session..." },
                    { info: true, text: "Securing query via parameterized statements..." },
                    { success: true, text: "[OK]   Transaction complete. 0 SQL injection vulnerabilities." }
                ],
                [
                    { info: true, text: "[INFO] Pytest: Running database initialization test suite..." },
                    { output: true, text: "tests/test_project_manager.py::test_db_initialization PASSED" },
                    { success: true, text: "[OK]   All console application logical tests passed." }
                ]
            ],
            commands: [
                {
                    label: "⚡ Trigger Pipeline",
                    isTrigger: true
                },
                {
                    label: "🔍 Audit SQL Injections",
                    isTrigger: false,
                    logs: [
                        { prompt: true, text: "grep -n 'execute(' app/utils/db_methods.py" },
                        { output: true, text: "88: cursor.execute(\"SELECT password FROM users WHERE cpf = ?\", (cpf,))" },
                        { output: true, text: "164: cursor.execute(\"INSERT INTO users ... VALUES (?,?,?)\", params)" },
                        { success: true, text: "[AUDIT COMPLETE] Parameterized execution verified. SQL injections fully prevented." }
                    ],
                    glowNodes: ["console", "auth", "query"],
                    passRules: [0, 1, 2]
                }
            ]
        }
    };

    const selectEl = document.getElementById('project-pipeline-select');
    const nodesContainer = document.getElementById('dag-nodes-container');
    const dqPanel = document.getElementById('dq-assertion-panel');

    function renderPipeline(key) {
        if (!nodesContainer || !pipelines[key]) return;
        nodesContainer.innerHTML = '';

        const current = pipelines[key];
        
        current.nodes.forEach((node, idx) => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'dag-node';
            nodeDiv.id = `node-${node.id}`;
            nodeDiv.innerHTML = `<i class="${node.icon}"></i><span>${node.label}</span>`;
            nodesContainer.appendChild(nodeDiv);

            if (idx < current.nodes.length - 1) {
                const connDiv = document.createElement('div');
                connDiv.className = 'dag-connector';
                connDiv.innerHTML = '<div class="dag-progress-bar"></div>';
                nodesContainer.appendChild(connDiv);
            }
        });

        // Initialize Data Quality Panel with Queued status
        if (dqPanel) {
            dqPanel.innerHTML = '';
            current.assertions.forEach((assertion, idx) => {
                const parts = assertion.split(' // ');
                const rule = parts[0];
                const target = parts[1] || '';
                
                const row = document.createElement('div');
                row.className = 'dq-assertion-row';
                row.id = `dq-rule-${idx}`;
                row.innerHTML = `
                    <div class="dq-assertion-left">
                        <span class="dq-status-label queued">QUEUED</span>
                        <span>${rule}</span>
                    </div>
                    <span style="color: var(--text-faint);">[${target}]</span>
                `;
                dqPanel.appendChild(row);
            });
        }

        // Render dynamic Command Buttons row
        const cliContainer = document.getElementById('cli-actions-container');
        if (cliContainer && current.commands) {
            cliContainer.innerHTML = '';
            current.commands.forEach(command => {
                const btn = document.createElement('button');
                btn.className = 'btn-dag-trigger';
                btn.style.fontSize = '0.65rem';
                btn.innerHTML = `<i class="fa-solid fa-terminal"></i> ${command.label}`;
                btn.addEventListener('click', () => {
                    if (command.isTrigger) {
                        runPipelineOrchestration(current.key);
                    } else {
                        executeCLICommand(command, current);
                    }
                });
                cliContainer.appendChild(btn);
            });
        }
    }

    // Default select render
    renderPipeline('taxi');

    if (selectEl) {
        selectEl.addEventListener('change', () => {
            renderPipeline(selectEl.value);
            logToTerminal([{ info: true, text: `[HUD] Loaded pipeline configuration: ${pipelines[selectEl.value].name}` }]);
        });
    }

    // Trigger DAG Execution Engine (runs nodes, then switches to Tab 3 and runs DQ checks sequentially)
    function runPipelineOrchestration(key) {
        const pipeline = pipelines[key];
        if (!pipeline) return;

        // Switch to Tab 2 (DAG)
        switchTab('tab-dag');

        // Reset nodes, progress lines, and DQ assertions
        renderPipeline(key);
        if (selectEl) selectEl.value = key;

        const connectors = nodesContainer.querySelectorAll('.dag-progress-bar');
        
        let stepIdx = 0;

        function runStep() {
            if (stepIdx >= pipeline.nodes.length) {
                // DAG Nodes complete! Now switch to Tab 3 (Data Quality) and run tests
                logToTerminal([{ info: true, text: `[DAG] Node execution completed. Redirecting to Data Quality suite...` }]);
                
                setTimeout(() => {
                    switchTab('tab-dq');
                    runDQTests();
                }, 1200);
                return;
            }

            const nodeDef = pipeline.nodes[stepIdx];
            const nodeEl = document.getElementById(`node-${nodeDef.id}`);
            
            if (nodeEl) nodeEl.classList.add('active-run');
            
            // Print execution logs to CLI tab
            logToTerminal(pipeline.logs[stepIdx]);

            setTimeout(() => {
                if (nodeEl) {
                    nodeEl.classList.remove('active-run');
                    nodeEl.classList.add('success-run');
                }

                if (stepIdx < connectors.length) {
                    connectors[stepIdx].style.width = '100%';
                }

                stepIdx++;
                setTimeout(runStep, 800);
            }, 2000);
        }

        // Run assertions sequentially in Tab 3
        function runDQTests() {
            let ruleIdx = 0;
            
            function runRule() {
                if (ruleIdx >= pipeline.assertions.length) {
                    // All assertions validated!
                    logToTerminal([
                        { success: true, text: `[DATA QUALITY] Validation suite completed. All checks PASSED.` },
                        { success: true, text: `[DAG] Pipeline ${pipeline.name} execution complete. Status: HEALTHY (SLA 99.8%)` }
                    ]);
                    return;
                }

                const dqRow = document.getElementById(`dq-rule-${ruleIdx}`);
                const assertionText = pipeline.assertions[ruleIdx].split(' // ')[0];
                
                if (dqRow) {
                    const label = dqRow.querySelector('.dq-status-label');
                    if (label) {
                        label.className = 'dq-status-label passed';
                        label.textContent = 'PASSED';
                        
                        // Log assertion success to CLI terminal
                        logToTerminal([{ success: true, text: `[OK] Test Passed: ${assertionText}` }]);
                    }
                }

                ruleIdx++;
                setTimeout(runRule, 800);
            }

            logToTerminal([{ info: true, text: `[DATA QUALITY] Launching validation assertion tests for: ${pipeline.name}...` }]);
            runRule();
        }

        logToTerminal([{ prompt: true, text: `airflow dags trigger ${pipeline.name}` }], true);
        runStep();
    }

    // Execute individual custom CLI command (glows nodes and highlights matching skills)
    function executeCLICommand(command, pipeline) {
        if (!nodesContainer) return;
        
        // Clear terminal and write logs
        logToTerminal(command.logs, true);

        // Clear previous glows
        document.querySelectorAll('.dag-node').forEach(node => node.classList.remove('active-run', 'success-run'));
        document.querySelectorAll('.db-table-row, .er-table').forEach(row => row.classList.remove('skill-glowing'));
        document.querySelectorAll('.dag-progress-bar').forEach(bar => bar.style.width = '0%');
        document.querySelectorAll('.connector-wire').forEach(w => w.classList.remove('highlighted'));

        // Highlight nodes IN THE BACKGROUND (Tab 2)
        command.glowNodes.forEach(nodeId => {
            const nodeEl = document.getElementById(`node-${nodeId}`);
            if (nodeEl) {
                nodeEl.classList.add('active-run');
                setTimeout(() => {
                    nodeEl.classList.remove('active-run');
                    nodeEl.classList.add('success-run');
                }, 1000);
            }
        });

        // Set matching progress bars to 100%
        const connectors = nodesContainer.querySelectorAll('.dag-progress-bar');
        connectors.forEach(bar => {
            bar.style.width = '100%';
        });

        // Update corresponding DQ assertions IN THE BACKGROUND (Tab 3)
        if (command.passRules) {
            command.passRules.forEach(ruleIdx => {
                const dqRow = document.getElementById(`dq-rule-${ruleIdx}`);
                if (dqRow) {
                    const label = dqRow.querySelector('.dq-status-label');
                    if (label) {
                        label.className = 'dq-status-label passed';
                        label.textContent = 'PASSED';
                    }
                }
            });
        }

        // Highlights corresponding dimension table in Star Schema
        pipeline.nodes.forEach((node, nodeIdx) => {
            if (command.glowNodes.includes(node.id)) {
                // If it is 'extract' or 'transform' glow dim_languages or dim_tools
                let targetTable = null;
                let targetWire = null;
                
                if (pipeline.name === "nyc-taxi-elt-pipeline") {
                    if (node.id === "extract") { targetTable = "table-dim-lang"; targetWire = "wire-skills"; }
                    else if (node.id === "transform" || node.id === "audit") { targetTable = "table-dim-pipe"; targetWire = "wire-tools"; }
                } else if (pipeline.name === "travel-assistant-api") {
                    if (node.id === "ingress") { targetTable = "table-dim-lang"; targetWire = "wire-skills"; }
                    else if (node.id === "validate" || node.id === "pytest") { targetTable = "table-dim-ops"; targetWire = "wire-ops"; }
                } else if (pipeline.name === "project-management-system") {
                    if (node.id === "auth" || node.id === "query") { targetTable = "table-dim-cloud"; targetWire = "wire-cloud"; }
                    else if (node.id === "pytest") { targetTable = "table-dim-ops"; targetWire = "wire-ops"; }
                }

                if (targetTable) {
                    const tbl = document.getElementById(targetTable);
                    if (tbl) tbl.style.borderColor = "var(--accent-cyan)";
                    setTimeout(() => { if(tbl) tbl.style.borderColor = ""; }, 3000);
                }
                if (targetWire) {
                    const w = document.getElementById(targetWire);
                    if (w) w.classList.add('highlighted');
                    setTimeout(() => { if(w) w.classList.remove('highlighted'); }, 3000);
                }
            }
        });

        // Glow the other tabs headers briefly to alert the user of background updates!
        const dagTabBtn = document.querySelector('.dashboard-tab[data-tab-target="tab-dag"]');
        const dqTabBtn = document.querySelector('.dashboard-tab[data-tab-target="tab-dq"]');
        if (dagTabBtn) {
            dagTabBtn.style.color = 'var(--accent-cyan)';
            setTimeout(() => { dagTabBtn.style.color = ''; }, 1000);
        }
        if (dqTabBtn) {
            dqTabBtn.style.color = 'var(--accent-cyan)';
            setTimeout(() => { dqTabBtn.style.color = ''; }, 1000);
        }
    }

    // ── SQL Parser ASCII table definitions ──
    const dimSkillsAscii = `
+-------------------+----------------------------+--------------+
| skill_name        | skill_category             | exp_level    |
+-------------------+----------------------------+--------------+
| Python            | Languages & Libraries      | Advanced     |
| SQL               | Languages & Libraries      | Advanced     |
| Apache Airflow    | Pipelines & Orchestrators  | Advanced     |
| dbt               | Pipelines & Orchestrators  | Intermediate |
| AWS S3/EC2/Lambda | Cloud & Infrastructure     | Intermediate |
| PostgreSQL        | Databases & Storage        | Advanced     |
| Docker            | DevOps & Engineering Ops   | Intermediate |
+-------------------+----------------------------+--------------+
`;

    const factExperienceAscii = `
+-----------------+-------------------+-------------+------------------------------------+
| company_name    | role_title        | period      | key_impact                         |
+-----------------+-------------------+-------------+------------------------------------+
| Serasa Experian | Data Engineer     | 2024 - Pres | Managed 450+ DAGs, 99% deploy gain |
| Verx Tecnologia | Data Analyst      | 2022 - 2024 | 32% pipeline failure reduction     |
| Freelancer      | Python Developer  | 2021 - 2022 | Web scraping & SQL automations     |
+-----------------+-------------------+-------------+------------------------------------+
`;

    // ── Live Command Parser ──
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim();
                terminalInput.value = '';
                if (!cmd) return;

                const cmdLower = cmd.toLowerCase().replace(/;$/, "");

                // Log typed command
                logToTerminal([{ prompt: true, text: cmd }]);

                setTimeout(() => {
                    if (cmdLower === 'help') {
                        const helpText = [
                            { output: true, text: 'Interactive CLI Parser Help Guide:' },
                            { output: true, text: '  - SELECT * FROM dim_skills;       --> Displays technical capabilities.' },
                            { output: true, text: '  - SELECT * FROM fact_experience;  --> Displays career history.' },
                            { output: true, text: '  - TRIGGER <pipeline_name>;        --> Runs Airflow DAG simulator.' },
                            { output: true, text: '                                    (taxi, travel, mgmt)' },
                            { output: true, text: '  - CLEAR;                          --> Clears the screen.' }
                        ];
                        logToTerminal(helpText);
                    } 
                    else if (cmdLower === 'clear') {
                        logToTerminal([], true);
                    } 
                    else if (cmdLower === 'select * from dim_skills') {
                        const lines = dimSkillsAscii.split('\n').map(l => ({ output: true, text: l }));
                        logToTerminal(lines);
                    } 
                    else if (cmdLower === 'select * from fact_experience') {
                        const lines = factExperienceAscii.split('\n').map(l => ({ output: true, text: l }));
                        logToTerminal(lines);
                    } 
                    else if (cmdLower.startsWith('trigger ')) {
                        const targetPipeline = cmdLower.substring(8).trim();
                        if (targetPipeline === 'taxi' || targetPipeline === 'nyc-taxi-elt-pipeline') {
                            runPipelineOrchestration('taxi');
                        } else if (targetPipeline === 'travel' || targetPipeline === 'travel-assistant-api') {
                            runPipelineOrchestration('travel');
                        } else if (targetPipeline === 'mgmt' || targetPipeline === 'project-management-system') {
                            runPipelineOrchestration('mgmt');
                        } else {
                            logToTerminal([{ error: true, text: `[ERROR] Pipeline "${targetPipeline}" not found. Options: taxi, travel, mgmt` }]);
                        }
                    } 
                    else {
                        logToTerminal([
                            { error: true, text: `[SQL ERROR] Syntax error near: "${cmd}"` },
                            { output: true, text: 'Type HELP; for list of commands.' }
                        ]);
                    }
                }, 200);
            }
        });
    }

    // ── Click project cards to trigger CLI query ──
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.project-gh')) return;

            const projectKey = card.getAttribute('data-project-key');
            if (projectKey) {
                // Scroll to Control Center Panel under the projects grid and center it
                const dashboardPanel = document.getElementById('control-center-panel');
                if (dashboardPanel) {
                    dashboardPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                setTimeout(() => {
                    runPipelineOrchestration(projectKey);
                }, 500);
            }
        });
    });

    // ── Directory Tree smooth scrolling binds & Live Preview ──
    const previewEl = document.getElementById('explorer-preview');
    const previewMapping = {
        'bio_info.py': 'class GustavoTraldi:\n    def __init__(self):\n        self.role = "Data Engineer"\n# Ingests profile metadata.',
        'git_projects.sql': 'SELECT title, tags \nFROM git_repositories \nWHERE owner = \'gtraldi\';\n# Yields code transformation schemas.',
        'star_schema.db': 'PRAGMA foreign_key_list(fact_experience);\n# Models Skills ER Star Schema relationship.',
        'career_experience.log': 'tail -f logs/career_history.log\n# Tracks Serasa and Verx deployment statistics.',
        'credentials.json': 'cat config/credentials.json\n# Yields degree details and data datacamp/dbt credentials.',
        'contact_socket.sh': 'curl -X POST -d \'{"msg": "Let\\\'s collaborate"}\' dev_socket.sh\n# Trigger output stage contact.'
    };

    const treeFiles = document.querySelectorAll('.tree-item.clickable');
    treeFiles.forEach(file => {
        const fileNameSpan = file.querySelector('span:not(.tree-meta)');
        const fileName = fileNameSpan ? fileNameSpan.textContent.trim() : '';

        // Hover triggers
        file.addEventListener('mouseenter', () => {
            if (previewEl && previewMapping[fileName]) {
                previewEl.style.color = 'var(--accent-green)';
                previewEl.style.whiteSpace = 'pre-wrap';
                previewEl.textContent = previewMapping[fileName];
            }
        });

        file.addEventListener('mouseleave', () => {
            if (previewEl) {
                previewEl.style.color = 'var(--text-faint)';
                previewEl.textContent = '// Hover over a file to preview its schema partition...';
            }
        });

        // Click triggers
        file.addEventListener('click', () => {
            const targetId = file.getAttribute('data-scroll-target');
            if (targetId) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    // ── Collapsible Explorer Folders ──
    const treeFolders = document.querySelectorAll('.tree-folder');
    treeFolders.forEach(folder => {
        folder.addEventListener('click', (e) => {
            const targetId = folder.getAttribute('data-folder-target');
            if (targetId) {
                const targetSubtree = document.getElementById(targetId);
                if (targetSubtree) {
                    const isCollapsed = targetSubtree.classList.toggle('collapsed');
                    
                    // Toggle folder open/closed icon
                    const icon = folder.querySelector('i');
                    if (icon) {
                        if (isCollapsed) {
                            icon.className = 'fa-solid fa-folder';
                        } else {
                            icon.className = 'fa-solid fa-folder-open';
                        }
                    }
                }
            }
        });
    });

    // ── Mouse Follow Lighting Aura ──
    const aura = document.getElementById('cursor-aura');
    if (aura) {
        let mouseX = 0, mouseY = 0;
        let auraX = 0, auraY = 0;
        const easeAmount = 0.12;

        document.addEventListener('mousemove', (e) => {
            aura.style.opacity = '1';
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            aura.style.opacity = '0';
        });

        function updateAura() {
            // Apply fluid easing lag
            auraX += (mouseX - auraX) * easeAmount;
            auraY += (mouseY - auraY) * easeAmount;
            
            aura.style.left = `${auraX}px`;
            aura.style.top = `${auraY}px`;
            
            requestAnimationFrame(updateAura);
        }
        
        requestAnimationFrame(updateAura);
    }

    // ── Operator Mode HUD Toggle ──
    const modeBtn = document.getElementById('operator-mode-btn');
    if (modeBtn) {
        const savedMode = localStorage.getItem('operator-mode');
        if (savedMode === 'active') {
            document.body.classList.add('operator-mode');
            modeBtn.innerHTML = '<i class="fa-solid fa-terminal"></i> Minimal Mode';
        }

        modeBtn.addEventListener('click', () => {
            const isActive = document.body.classList.toggle('operator-mode');
            
            if (isActive) {
                localStorage.setItem('operator-mode', 'active');
                modeBtn.innerHTML = '<i class="fa-solid fa-terminal"></i> Minimal Mode';
                
                logToTerminal([
                    { prompt: true, text: 'sys_mode --switch-operator' },
                    { info: true, text: '[HUD]  Enabling Operator HUD Overlays...' },
                    { success: true, text: '[OK]    System transitioned to OPERATOR CONSOLE.' }
                ], true);
            } else {
                localStorage.setItem('operator-mode', 'inactive');
                modeBtn.innerHTML = '<i class="fa-solid fa-terminal"></i> Operator Mode';
                
                logToTerminal([
                    { prompt: true, text: 'sys_mode --switch-minimal' },
                    { info: true, text: '[HUD]  Restoring standard viewports...' },
                    { success: true, text: '[OK]    System transitioned to MINIMAL PORTFOLIO.' }
                ], true);
            }
        });
    }
});
