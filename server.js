/**
 * CyberPulse - Enterprise Backend Server
 * Provides REST APIs for live website security scanning, tamper-evident certificate issuance & verification,
 * SQLite persistence, and static dashboard serving.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

const SecurityScanner = require('./backend/scanner');
const CertificateService = require('./backend/certificateService');
const dbAPI = require('./backend/db');
const QRCodeGen = require('./js/lib/qrcode');

const PORT = parseInt(process.env.PORT || '3000', 10);
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=UTF-8',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.zip': 'application/zip'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const hostHeader = req.headers.host || `localhost:${PORT}`;
  const reqUrl = new URL(req.url, `http://${hostHeader}`);
  const pathname = reqUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // -------------------------------------------------------------
  // API ROUTING
  // -------------------------------------------------------------

  // Health check
  if (pathname === '/api/health') {
    return sendJson(res, 200, {
      status: 'healthy',
      platform: 'CyberPulse Security Platform',
      version: '4.0.0',
      timestamp: new Date().toISOString()
    });
  }

  // 1. Live Website Security Scan
  if (pathname === '/api/scan' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const target = body.target || body.url || body.domain;

      if (!target) {
        return sendJson(res, 400, { error: 'Target URL or domain is required.' });
      }

      console.log(`[CyberPulse Scanner] Initiating live scan for target: ${target}`);
      const scanResult = await SecurityScanner.scanWebsite(target);

      // Save scan to database
      dbAPI.saveScan(scanResult);

      console.log(`[CyberPulse Scanner] Scan completed for ${target}: Score ${scanResult.composite_score}/100 (${scanResult.grade})`);
      return sendJson(res, 200, scanResult);
    } catch (err) {
      console.error('[CyberPulse Scanner] Error scanning target:', err);
      return sendJson(res, 500, { error: `Scanning failed: ${err.message}` });
    }
  }

  // 2. Generate Security Assessment Certificate
  if (pathname === '/api/certificate/generate' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      let scan = null;

      if (body.scanId) {
        scan = dbAPI.getScan(body.scanId);
      } else if (body.scan && body.scan.id) {
        scan = body.scan;
        dbAPI.saveScan(scan);
      }

      if (!scan) {
        return sendJson(res, 400, { error: 'A valid scan record is required to issue a certificate.' });
      }

      const hostHeader = req.headers.host || `localhost:${PORT}`;
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const baseUrl = `${protocol}://${hostHeader}`;

      const certificate = CertificateService.issueCertificate(scan, baseUrl);
      const qrCodeSvg = QRCodeGen.generateSVG(certificate.verification_url, 150);

      return sendJson(res, 200, {
        success: true,
        certificate,
        qrCodeSvg
      });
    } catch (err) {
      console.error('[Certificate Service] Error generating certificate:', err);
      return sendJson(res, 500, { error: `Failed to issue certificate: ${err.message}` });
    }
  }

  // 3. Verify Certificate
  if (pathname.startsWith('/api/certificate/verify/') && req.method === 'GET') {
    const certId = decodeURIComponent(pathname.replace('/api/certificate/verify/', ''));
    const result = CertificateService.verifyCertificate(certId);
    return sendJson(res, 200, result);
  }

  // 3b. Get Recent Certificates
  if (pathname === '/api/certificates/recent' && req.method === 'GET') {
    const limit = parseInt(reqUrl.searchParams.get('limit') || '10', 10);
    const certs = dbAPI.getRecentCertificates(limit);
    return sendJson(res, 200, { certificates: certs });
  }

  // 4. Render Certificate QR Code (SVG image)
  if (pathname.startsWith('/api/certificate/qr/') && req.method === 'GET') {
    const certId = decodeURIComponent(pathname.replace('/api/certificate/qr/', ''));
    const hostHeader = req.headers.host || `localhost:${PORT}`;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const verifyUrl = `${protocol}://${hostHeader}/verify.html?certId=${encodeURIComponent(certId)}`;
    
    const svg = QRCodeGen.generateSVG(verifyUrl, 160);
    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    });
    return res.end(svg);
  }

  // 5. Scan History API
  if (pathname === '/api/scans/history' && req.method === 'GET') {
    const limit = parseInt(reqUrl.searchParams.get('limit') || '20', 10);
    const scans = dbAPI.getRecentScans(limit);
    return sendJson(res, 200, { scans });
  }

  // 6. Get Specific Scan
  if (pathname.startsWith('/api/scans/') && req.method === 'GET') {
    const scanId = decodeURIComponent(pathname.replace('/api/scans/', ''));
    const scan = dbAPI.getScan(scanId);
    if (!scan) {
      return sendJson(res, 404, { error: 'Scan not found' });
    }
    return sendJson(res, 200, scan);
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // If path has no extension and matches a route like /verify
  if (pathname === '/verify') {
    filePath = path.join(PUBLIC_DIR, 'verify.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      return res.end(`
        <div style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h2>404 Not Found</h2>
          <p>The requested file <code>${pathname}</code> was not found on CyberPulse server.</p>
          <a href="/">Return to Dashboard</a>
        </div>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CyberPulse Security Platform running at:`);
  console.log(`👉 Web Dashboard:     http://localhost:${PORT}`);
  console.log(`👉 Certificate Verif: http://localhost:${PORT}/verify.html`);
  console.log(`👉 Presentation Deck: http://localhost:${PORT}/slides.html`);
  console.log(`=======================================================`);
});

module.exports = server;
