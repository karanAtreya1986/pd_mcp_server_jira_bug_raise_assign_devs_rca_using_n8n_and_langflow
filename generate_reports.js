import fs from 'fs';
import XLSX from 'xlsx';

const bugs = [
  {
    bugid: "SCRUM-33",
    priority: "High",
    title: "500 Error on Special Characters in Email",
    steps: "1. Go to app.vwo.com. 2. Enter 'test\\'OR\\'1=1@vwo.com' in email. 3. Check response.",
    link: "https://karan1988.atlassian.net/browse/SCRUM-33",
    developer: "Rajesh Kumar",
    role: "Backend Developer"
  },
  {
    bugid: "SCRUM-34",
    priority: "Critical",
    title: "MFA Timeout (>10s) on Verify API",
    steps: "1. Credentials entered. 2. Enter MFA code. 3. Observe latency.",
    link: "https://karan1988.atlassian.net/browse/SCRUM-34",
    developer: "Anita Desai",
    role: "Backend Developer"
  },
  {
    bugid: "SCRUM-35",
    priority: "Medium",
    title: "Missing 'status' in Invalid Password Payload",
    steps: "1. Enter wrong password. 2. Intercept response.",
    link: "https://karan1988.atlassian.net/browse/SCRUM-35",
    developer: "Sarah Chen",
    role: "Full Stack Developer"
  },
  {
    bugid: "SCRUM-36",
    priority: "High",
    title: "Forgot Password Link Overlapping (Mobile)",
    steps: "1. View on screen < 380px. 2. Try to click link.",
    link: "https://karan1988.atlassian.net/browse/SCRUM-36",
    developer: "Maya Lin",
    role: "Frontend Developer"
  },
  {
    bugid: "SCRUM-37",
    priority: "Medium",
    title: "Missing Eye Icon (Safari Password masked)",
    steps: "1. Open VWO in Safari. 2. Check password field icon.",
    link: "https://karan1988.atlassian.net/browse/SCRUM-37",
    developer: "Kevin O'Connor",
    role: "Frontend Developer"
  }
];

// Generate XLSX
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(bugs.map(b => ({
  "Bug ID": b.bugid,
  "Priority": b.priority,
  "Developer Name": b.developer,
  "Developer Role": b.role,
  "Bug Link": b.link,
  "Bug Title": b.title
})));

XLSX.utils.book_append_sheet(wb, ws, "Bugs");
XLSX.writeFile(wb, "bug_report.xlsx");

// Generate Stakeholder HTML Report
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VWO.com Login - Stakeholder Quality Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb;
            --critical: #ef4444;
            --high: #f97316;
            --medium: #eab308;
            --bg: #f8fafc;
            --card: #ffffff;
            --text: #1e293b;
        }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); padding: 40px; margin: 0; }
        .container { max-width: 1100px; margin: auto; }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 40px; border-radius: 20px; margin-bottom: 40px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1); }
        .header h1 { font-size: 2.5rem; margin: 0; font-weight: 800; letter-spacing: -1px; }
        .header p { opacity: 0.8; margin-top: 10px; font-size: 1.1rem; }
        .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .card { background: var(--card); padding: 25px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; text-align: center; }
        .card h3 { font-size: 0.9rem; text-transform: uppercase; color: #64748b; margin: 0; }
        .card .value { font-size: 2.5rem; font-weight: 800; margin-top: 10px; color: var(--primary); }
        .card.crit .value { color: var(--critical); }
        
        table { width: 100%; border-collapse: separate; border-spacing: 0; background: var(--card); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        thead { background: #f1f5f9; }
        th { text-align: left; padding: 18px; font-size: 0.85rem; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; font-weight: 600; }
        td { padding: 18px; border-top: 1px solid #f1f5f9; vertical-align: top; line-height: 1.5; }
        .priority-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .priority-Critical { background: #fee2e2; color: #991b1b; }
        .priority-High { background: #ffedd5; color: #9a3412; }
        .priority-Medium { background: #fef9c3; color: #854d0e; }
        .link { color: var(--primary); font-weight: 600; text-decoration: none; }
        .link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <p>VWO.com Quality Assurance</p>
            <h1>Stakeholder Quality Report</h1>
            <p>Login Page Testing Audit & Bug Tracker</p>
        </div>
        
        <div class="summary-cards">
            <div class="card"><h3>Total Bugs</h3><div class="value">5</div></div>
            <div class="card crit"><h3>Critical Issues</h3><div class="value">1</div></div>
            <div class="card"><h3>Developers Active</h3><div class="value">5</div></div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Bug ID</th>
                    <th>Bug Link</th>
                    <th>Priority</th>
                    <th>Summary</th>
                    <th>Assignee</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                ${bugs.map(b => `
                <tr>
                    <td><strong>${b.bugid}</strong></td>
                    <td><a href="${b.link}" class="link" target="_blank">View in Jira</a></td>
                    <td><span class="priority-badge priority-${b.priority}">${b.priority}</span></td>
                    <td>
                        <div style="font-weight: 600;">${b.title}</div>
                        <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">${b.steps}</div>
                    </td>
                    <td>${b.developer}</td>
                    <td><span style="font-size: 0.85rem; background: #e2e8f0; padding: 2px 8px; border-radius: 4px;">${b.role}</span></td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>
`;

fs.writeFileSync('stakeholder_report.html', html);
console.log('Successfully generated bug_report.xlsx and stakeholder_report.html');
