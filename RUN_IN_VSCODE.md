# How to Run CyberPulse in VS Code

Follow these simple steps to run and present the **CyberPulse Cybersecurity Health Checkup & Verification Platform** in VS Code.

---

## Step 1: Open the Project Folder in VS Code

1. Launch **VS Code**.
2. Go to **File** ➔ **Open Folder...** (or press `Ctrl + K` then `Ctrl + O`).
3. Select the project directory:
   `C:\Users\meetm\.gemini\antigravity\scratch\cyber_health_checkup`

---

## Step 2: Start the CyberPulse Server

CyberPulse features a built-in Node.js backend with live scanning, SQLite ledger persistence, and cryptographic certificate verification. Zero npm dependencies are required!

1. Open the built-in terminal in VS Code:
   Press **`Ctrl + ~`** (or go to **Terminal ➔ New Terminal**).
2. Start the server:
   ```bash
   node server.js
   ```
   *(or `npm start`)*
3. You will see the server startup confirmation:
   ```
   =======================================================
   🚀 CyberPulse Security Platform running at:
   👉 Web Dashboard:     http://localhost:3000
   👉 Certificate Verif: http://localhost:3000/verify.html
   👉 Presentation Deck: http://localhost:3000/slides.html
   =======================================================
   ```

---

## Step 3: Open in Your Web Browser

Open your browser (Chrome, Edge, Firefox) and access:

1. **Dashboard & Live Scanner:**
   👉 **http://localhost:3000**
   - Click **Run Full Cyber Health Scan** to audit `example.com` or any website domain.
   - View genuine headers, TLS cipher, DNS SPF/DMARC records, and open ports.

2. **Certificate Verification Portal:**
   👉 **http://localhost:3000/verify.html**
   - Enter your Certificate ID to verify cryptographic HMAC-SHA256 signature authenticity.

3. **Presentation Slides Deck:**
   👉 **http://localhost:3000/slides.html**
   - Full-screen interactive PowerPoint presentation ready for university review.

---

## 📁 Key Files Reference in VS Code

| File Name | Purpose |
| :--- | :--- |
| **`server.js`** | Native Node.js backend server with live scanning & verification REST APIs |
| **`backend/scanner.js`** | Live HTTP probe, TLS 1.3 handshake, DNS SPF/DMARC & port auditor |
| **`backend/certificateService.js`** | Cryptographic HMAC-SHA256 signer & tamper detection |
| **`backend/db.js`** | SQLite ledger storage (`cyberpulse.db`) |
| **`index.html`** | Single Page Application Dashboard, Scanners & Certificate View |
| **`verify.html`** | Standalone Public Certificate Verification Portal |
| **`slides.html`** | Interactive 9-Slide PowerPoint Presentation Deck |
| **`presentation_slides.pptx`** | Standard Microsoft PowerPoint presentation file |
| **`js/app.js`** | Coordinator, live scan modal steps & certificate actions |
| **`js/reportGenerator.js`** | Evidence-based executive report & printable certificate renderer |
| **`js/academicDocs.js`** | Project Abstract, DFD Diagrams & Viva Q&A Guide |
| **`README.md`** | Comprehensive project overview & presentation checklist |
