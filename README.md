# CyberPulse — Automated Cybersecurity Health Checkup & Risk Assessment Platform

🎓 **7th Semester University Minor Project | Computer Science & Cyber Security**

**CyberPulse** is an automated web security posture audit and certification platform that performs genuine, live threat vulnerability checks, issues cryptographically verifiable assessment certificates, and generates evidence-backed reports.

---

## 🌟 Key Features

### 1. 🛡️ Live, Evidence-Based Security Auditing
- **Zero Fake Data or Random Numbers**: Performs real network requests to the target domain using TLS certificate inspection, HTTP response header probing, and DNS TXT anti-spoofing record lookups.
- **Vulnerability Findings with Technical Evidence**: Evaluates HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, TLS protocols (TLS 1.2 / TLS 1.3), cipher suites, certificate validity dates, SPF, and DMARC enforcement.
- **Clear Handling of Unreachable Targets**: If a target cannot be contacted or DNS resolution fails, CyberPulse generates a clear **"ASSESSMENT INCOMPLETE: TARGET UNREACHABLE"** status with the exact error cause rather than fabricating artificial scores.

### 2. 📜 Tamper-Evident CyberPulse Security Assessment Certificate
- **Official Point-in-Time Assessment Certificate**: Automatically issued after a successful scan.
- **Cryptographic Verification**: Includes SHA-256 integrity hash and server-signed HMAC-SHA256 digital signature.
- **Built-in Pure-JS QR Code**: Encodes direct link to the verification portal.
- **Mandatory University Disclaimer**: Explicitly states that the certificate represents an automated perimeter assessment and is not a 100% security guarantee.
- **Clean PDF Print / Export**: Dedicated `@media print` layout formatting the certificate cleanly without dashboard clutter.

### 3. 🔍 Standalone Certificate Verification Portal (`/verify.html`)
- Allows professors, evaluators, or third parties to verify certificate authenticity.
- Dynamically recalculates cryptographic signatures against the immutable SQLite ledger.
- Displays instant visual badges: **AUTHENTIC & CRYPTOGRAPHICALLY VERIFIED** vs. **TAMPERING DETECTED / INVALID SIGNATURE**.

### 4. 📊 Multi-Pillar Posture Analysis & Academic Hub
- **Wireshark Packet Trace Analyzer**: PCAP scenario evaluation for cleartext credentials (FTP/HTTP), SYN flood DDoS sweeps, and ARP poisoning.
- **Perimeter Network Exposure**: Service port risk mapping across administrative and database ports.
- **Host Endpoint Compliance**: Interactive questionnaire checking BitLocker/FileVault, EDR antivirus, and OS patch levels.
- **Interactive Academic Hub**: Complete University Abstract, DFD Level 0/1 diagrams, OWASP Top 10 / NIST SP 800-53 mapping table, and **Viva-Voce Q&A Guide**.
- **Interactive Slides Deck (`slides.html`) & `.pptx` Presentation**: Ready for professor review.

---

## 🚀 How to Run the Platform

The project uses Node.js with native standard libraries (`node:sqlite`, `node:tls`, `node:dns`, `node:crypto`) — **zero npm install required!**

### Step 1: Start the CyberPulse Server
Open PowerShell or Command Prompt in the project directory:
```bash
cd C:\Users\meetm\.gemini\antigravity\scratch\cyber_health_checkup
node server.js
```
*(Alternatively: `npm start`)*

### Step 2: Access the Applications
Open your web browser and navigate to:
- 🌐 **CyberPulse Dashboard & Scanner:** [http://localhost:3000](http://localhost:3000)
- 🔍 **Certificate Verification Portal:** [http://localhost:3000/verify.html](http://localhost:3000/verify.html)
- 🖥️ **Presentation Slides Deck:** [http://localhost:3000/slides.html](http://localhost:3000/slides.html)

---

## 📁 File Structure

```
cyber_health_checkup/
├── server.js                 # Native Node.js HTTP server & REST API
├── package.json              # Project metadata & start script
├── cyberpulse.db             # SQLite database (scans, certificates & HMAC key)
├── index.html                # Single Page Application Dashboard & Scanner
├── verify.html               # Public Certificate Verification Portal
├── slides.html               # 9-Slide Presentation Deck
├── presentation_slides.pptx  # Microsoft PowerPoint file
├── presentation_slides.md    # Raw markdown presentation deck
├── css/
│   ├── style.css             # Cyberpunk dark mode design tokens & layouts
│   └── components.css        # Certificate frame, print styles & live scan modal
├── js/
│   ├── app.js                # App coordinator, modal animator & event router
│   ├── auditEngine.js        # Live audit caller & NIST composite scoring
│   ├── reportGenerator.js    # Genuine report & certificate HTML renderer
│   ├── academicDocs.js       # Academic synopsis, DFDs & Viva Q&A
│   ├── lib/
│   │   └── qrcode.js         # Zero-dependency pure-JS SVG QR code generator
│   └── modules/
│       ├── webAudit.js       # HTTP header security module
│       ├── wiresharkAudit.js # Wireshark packet capture analysis module
│       ├── networkAudit.js   # Network surface & port auditor
│       ├── emailAudit.js     # SPF, DKIM, DMARC auditor
│       ├── endpointAudit.js  # Host OS compliance auditor
│       └── scanHistory.js    # Scan repository module
└── backend/
    ├── db.js                 # SQLite database schema & ledger queries
    ├── scanner.js            # Live HTTP, TLS, DNS & TCP port auditor
    └── certificateService.js # HMAC-SHA256 signer & verification service
```

---

## 🎯 Viva & Professor Demonstration Checklist

1. **Live Website Audit**:
   - Enter `example.com` or `google.com` into the Web Target input and click **Audit Web Posture** or **Run Full Cyber Health Scan**.
   - Watch the animated 5-step live audit modal (HTTP probe, TLS handshake, DNS SPF/DMARC query, port check, score synthesis).
   - Review genuine findings: observed headers, TLS protocol, certificate issuer, risk analysis, and actionable remediation commands.
2. **Unreachable Website Demonstration**:
   - Enter an invalid domain (e.g. `this-domain-does-not-exist-xyz987654.org`).
   - Observe that CyberPulse reports **"ASSESSMENT INCOMPLETE: TARGET UNREACHABLE"** with technical evidence rather than fabricating artificial scores.
3. **Security Assessment Certificate**:
   - Navigate to the **Security Certificate** tab.
   - Point out the domain name, overall score, unique Certificate ID, assessment date, SHA-256 hash, and digital signature.
   - Click **Print / Download Certificate (PDF)** to show clean printable output.
4. **Certificate Verification**:
   - Click **Open Verification Portal** or open `http://localhost:3000/verify.html?certId=YOUR_CERT_ID`.
   - Point out the **AUTHENTIC & CRYPTOGRAPHICALLY VERIFIED** banner, ledger hash match, and legal disclaimer.
   - Alter any character in the certificate ID to demonstrate instant tamper/invalid detection.
5. **Academic Submission**:
   - Open **Academic Project Hub** to show the Synopsis, DFD Architecture, OWASP/NIST mapping, and Viva Q&A.
   - Open `slides.html` or `presentation_slides.pptx` to present the slide deck.
