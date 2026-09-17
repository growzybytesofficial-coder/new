/**
 * Universal Data Transfer & Parsing Utility for IT SAATHI Admin Panel
 * Supports all major file formats:
 * - Excel: .xlsx, .xls, .ods, .xlsm, .xlsb
 * - Delimited: .csv, .tsv, .tab, .txt, .psv (auto-detects comma, tab, pipe, semicolon)
 * - Structured: .xml, .rss, .atom
 * - JSON: .json, .jsonl, .ndjson (Newline Delimited JSON)
 * - YAML: .yaml, .yml
 * - SQL: .sql (INSERT INTO statements)
 * - Web/HTML: .html, .htm (HTML table extraction)
 */

import * as XLSX from 'xlsx';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';

// Helper to trigger browser file download
export function downloadFile(content, fileName, mimeType = 'text/plain;charset=utf-8;') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convert Array of Objects to CSV string with Excel-friendly UTF-8 BOM
export function arrayToCsv(data, columns, delimiter = ',') {
  if (!data || !data.length) return '';

  const headers = columns.map(c => c.label || c.key);
  const keys = columns.map(c => c.key);

  const escapeCsvCell = (val) => {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = data.map(item => {
    return keys.map(key => {
      let val = item[key];
      if (Array.isArray(val)) {
        val = val.join('; ');
      } else if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      return escapeCsvCell(val);
    }).join(delimiter);
  });

  return '\uFEFF' + [headers.map(escapeCsvCell).join(delimiter), ...rows].join('\r\n');
}

// Auto-detect delimiter in text (comma, semicolon, tab, pipe)
export function detectDelimiter(text) {
  const sample = text.slice(0, 3000).split(/\r?\n/).slice(0, 5).join('\n');
  const counts = {
    ',': (sample.match(/,/g) || []).length,
    '\t': (sample.match(/\t/g) || []).length,
    ';': (sample.match(/;/g) || []).length,
    '|': (sample.match(/\|/g) || []).length,
  };

  let maxDelim = ',';
  let maxCount = 0;
  for (const [delim, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxDelim = delim;
    }
  }
  return maxDelim;
}

// Parse CSV, TSV, PSV or custom delimited text into array of objects
export function parseDelimitedText(text, forcedDelimiter = null) {
  if (!text || !text.trim()) return [];

  let cleanText = text.replace(/^\uFEFF/, '').trim();
  const delimiter = forcedDelimiter || detectDelimiter(cleanText);

  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentLine.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      currentLine.push(currentField.trim());
      if (currentLine.some(f => f !== '')) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField !== '' || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some(f => f !== '')) {
      lines.push(currentLine);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h =>
    h.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '')
  );
  const results = [];

  for (let r = 1; r < lines.length; r++) {
    const row = lines[r];
    const obj = {};
    headers.forEach((header, idx) => {
      let val = row[idx] !== undefined ? row[idx] : '';
      obj[header] = val;
    });
    results.push(obj);
  }

  return results;
}

// Backward compatibility alias
export const parseCsv = parseDelimitedText;

// Escape XML special characters
export function escapeXml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Convert Array of Objects to clean indented XML Document
export function arrayToXml(data, rootTag = 'root', itemTag = 'item', columns = null) {
  if (!data || !data.length) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag}>\n</${rootTag}>`;
  }

  const keys = columns ? columns.map(c => c.key) : Object.keys(data[0] || {});

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag}>\n`;

  data.forEach((item) => {
    xml += `  <${itemTag}>\n`;
    keys.forEach((key) => {
      const val = item[key];
      const tag = key.replace(/[^a-zA-Z0-9_]/g, '_');
      if (Array.isArray(val)) {
        xml += `    <${tag}>${escapeXml(val.join('; '))}</${tag}>\n`;
      } else if (typeof val === 'object' && val !== null) {
        xml += `    <${tag}><![CDATA[${JSON.stringify(val)}]]></${tag}>\n`;
      } else {
        xml += `    <${tag}>${escapeXml(val !== undefined && val !== null ? val : '')}</${tag}>\n`;
      }
    });
    xml += `  </${itemTag}>\n`;
  });

  xml += `</${rootTag}>`;
  return xml;
}

// Parse XML string into Array of Objects
export function parseXml(xmlText) {
  if (!xmlText || !xmlText.trim()) return [];

  const cleanXml = xmlText.replace(/^\uFEFF/, '').trim();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(cleanXml, 'text/xml');

  const parseError = xmlDoc.getElementsByTagName('parsererror');
  if (parseError.length > 0) {
    const errText = parseError[0].textContent || 'XML syntax error';
    throw new Error(`Invalid XML format: ${errText.slice(0, 150)}`);
  }

  const rootElement = xmlDoc.documentElement;
  if (!rootElement) return [];

  let itemNodes = [];
  const commonItemTags = ['product', 'item', 'row', 'entry', 'record', 'customer', 'order', 'coupon', 'data', 'article', 'feed'];
  for (const tagName of commonItemTags) {
    const found = xmlDoc.getElementsByTagName(tagName);
    if (found.length > 0) {
      itemNodes = Array.from(found);
      break;
    }
  }

  if (itemNodes.length === 0) {
    itemNodes = Array.from(rootElement.children);
  }

  if (itemNodes.length === 0) return [];

  const results = [];

  itemNodes.forEach((node) => {
    const obj = {};

    if (node.attributes) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        const key = attr.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        obj[key] = attr.value;
      }
    }

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const key = child.nodeName.toLowerCase().replace(/[^a-z0-9_]/g, '_');

      if (child.children.length > 0) {
        const nestedList = Array.from(child.children).map(c => c.textContent.trim());
        obj[key] = nestedList.length === 1 ? nestedList[0] : nestedList;
      } else {
        obj[key] = child.textContent.trim();
      }
    }

    if (node.children.length === 0 && node.textContent && Object.keys(obj).length === 0) {
      obj.value = node.textContent.trim();
    }

    if (Object.keys(obj).length > 0) {
      results.push(obj);
    }
  });

  return results;
}

// Parse Excel binary or ArrayBuffer (.xlsx, .xls, .ods, .xlsm, .xlsb)
export function parseExcelWorkbook(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('Excel workbook contains no sheets.');
  }

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

  if (!rawRows || rawRows.length === 0) {
    return [];
  }

  // Normalize column keys to lowercase underscore format
  return rawRows.map(row => {
    const normalized = {};
    Object.entries(row).forEach(([k, v]) => {
      const cleanKey = k.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '');
      normalized[cleanKey] = v;
    });
    return normalized;
  });
}

// Generate Excel file Blob
export function arrayToExcelBlob(data, columns, sheetName = 'Data') {
  const keys = columns ? columns.map(c => c.key) : Object.keys(data[0] || {});
  const headers = columns ? columns.map(c => c.label || c.key) : keys;

  const headerMap = {};
  keys.forEach((k, idx) => {
    headerMap[k] = headers[idx];
  });

  const formattedRows = data.map(item => {
    const row = {};
    keys.forEach(k => {
      let val = item[k];
      if (Array.isArray(val)) {
        val = val.join('; ');
      } else if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      row[headerMap[k]] = val !== undefined && val !== null ? val : '';
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

// Parse JSON & JSON Lines (.json, .jsonl, .ndjson)
export function parseJsonOrJsonLines(text) {
  const clean = text.replace(/^\uFEFF/, '').trim();
  if (!clean) return [];

  // Try standard JSON first
  try {
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.items && Array.isArray(parsed.items)) return parsed.items;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
    if (parsed.products && Array.isArray(parsed.products)) return parsed.products;
    if (parsed.orders && Array.isArray(parsed.orders)) return parsed.orders;
    if (parsed.customers && Array.isArray(parsed.customers)) return parsed.customers;
    if (typeof parsed === 'object') return [parsed];
  } catch (e) {
    // If standard JSON fails, attempt JSON lines (NDJSON)
    const lines = clean.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const results = [];
    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (item) results.push(item);
      } catch (err) {
        // Skip unparseable line
      }
    }
    if (results.length > 0) return results;
    throw new Error('Invalid JSON or JSONL format.');
  }
  return [];
}

// Parse YAML (.yaml, .yml)
export function parseYaml(text) {
  const clean = text.replace(/^\uFEFF/, '').trim();
  if (!clean) return [];
  const parsed = yamlLoad(clean);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.items)) return parsed.items;
    if (Array.isArray(parsed.data)) return parsed.data;
    if (Array.isArray(parsed.products)) return parsed.products;
    if (Array.isArray(parsed.orders)) return parsed.orders;
    if (Array.isArray(parsed.customers)) return parsed.customers;
    return [parsed];
  }
  return [];
}

// Parse SQL Dump (.sql INSERT statements)
export function parseSqlDump(text) {
  const clean = text.replace(/^\uFEFF/, '');
  const insertRegex = /INSERT\s+INTO\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+?);/gi;
  const results = [];

  let match;
  while ((match = insertRegex.exec(clean)) !== null) {
    const columns = match[2].split(',').map(c =>
      c.replace(/[`"'\s]/g, '').toLowerCase().replace(/[^a-z0-9_]/g, '_')
    );
    const valuesPart = match[3];

    // Split multiple value tuples: (val1, val2), (val3, val4)
    const tupleRegex = /\(([^)]+)\)/g;
    let tupleMatch;
    while ((tupleMatch = tupleRegex.exec(valuesPart)) !== null) {
      const rawVals = tupleMatch[1].split(/,(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/);
      const row = {};
      columns.forEach((col, idx) => {
        let val = rawVals[idx] ? rawVals[idx].trim() : '';
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
        }
        row[col] = val;
      });
      results.push(row);
    }
  }

  if (results.length === 0) {
    throw new Error('No valid SQL INSERT INTO statements found in .sql file.');
  }

  return results;
}

// Parse HTML Tables (.html, .htm)
export function parseHtmlTables(htmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const table = doc.querySelector('table');
  if (!table) throw new Error('No <table> element found in HTML file.');

  const headers = [];
  const thElements = table.querySelectorAll('thead th, tr:first-child th, tr:first-child td');
  thElements.forEach(th => {
    headers.push(
      th.textContent.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '')
    );
  });

  if (headers.length === 0) throw new Error('HTML table has no detectable column headers.');

  const results = [];
  const trElements = table.querySelectorAll('tbody tr, tr');
  trElements.forEach((tr, index) => {
    // Skip if it is the header row
    if (tr.querySelector('th') && index === 0) return;

    const cells = tr.querySelectorAll('td');
    if (cells.length === 0) return;

    const row = {};
    headers.forEach((header, i) => {
      row[header] = cells[i] ? cells[i].textContent.trim() : '';
    });
    results.push(row);
  });

  return results;
}

// Universal master parser: Accepts File object + raw buffer / string, detects type & parses
export async function parseAnyFile(file) {
  const fileName = file.name || '';
  const ext = fileName.split('.').pop().toLowerCase();

  // 1. Binary Excel formats
  if (['xlsx', 'xls', 'ods', 'xlsm', 'xlsb'].includes(ext)) {
    const arrayBuffer = await file.arrayBuffer();
    return {
      format: ext.toUpperCase(),
      rows: parseExcelWorkbook(arrayBuffer)
    };
  }

  // Text-based formats
  const text = await file.text();

  if (['xml', 'rss', 'atom'].includes(ext)) {
    return {
      format: 'XML',
      rows: parseXml(text)
    };
  }

  if (['json', 'jsonl', 'ndjson'].includes(ext)) {
    return {
      format: ext.toUpperCase(),
      rows: parseJsonOrJsonLines(text)
    };
  }

  if (['yaml', 'yml'].includes(ext)) {
    return {
      format: 'YAML',
      rows: parseYaml(text)
    };
  }

  if (['sql'].includes(ext)) {
    return {
      format: 'SQL',
      rows: parseSqlDump(text)
    };
  }

  if (['html', 'htm'].includes(ext)) {
    return {
      format: 'HTML',
      rows: parseHtmlTables(text)
    };
  }

  if (['tsv', 'tab'].includes(ext)) {
    return {
      format: 'TSV',
      rows: parseDelimitedText(text, '\t')
    };
  }

  if (['csv', 'psv', 'txt'].includes(ext) || ext === '') {
    // Auto-detect if CSV, XML, JSON, or YAML by looking inside the text
    const trimmed = text.trim();
    if (trimmed.startsWith('<?xml') || trimmed.startsWith('<root') || trimmed.startsWith('<products') || (trimmed.startsWith('<') && trimmed.endsWith('>'))) {
      try {
        return { format: 'XML', rows: parseXml(text) };
      } catch (e) {
        // Fall back
      }
    }
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        return { format: 'JSON', rows: parseJsonOrJsonLines(text) };
      } catch (e) {
        // Fall back
      }
    }

    return {
      format: 'DELIMITED',
      rows: parseDelimitedText(text)
    };
  }

  // Fallback: Attempt general delimited text
  try {
    return {
      format: 'TEXT',
      rows: parseDelimitedText(text)
    };
  } catch (err) {
    throw new Error(`Unsupported or unreadable file format (.${ext}).`);
  }
}

// Product Export Definition
export const productExportColumns = [
  { key: 'id', label: 'Product ID' },
  { key: 'name', label: 'Product Name' },
  { key: 'sku', label: 'SKU Code' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price (INR)' },
  { key: 'oldPrice', label: 'Old Price (INR)' },
  { key: 'badge', label: 'Badge' },
  { key: 'section', label: 'Section' },
  { key: 'short', label: 'Short Description' },
  { key: 'description', label: 'Full Description' },
  { key: 'specs', label: 'Specifications' },
];

// Customer Export Definition
export const customerExportColumns = [
  { key: '_id', label: 'Customer ID' },
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'companyName', label: 'Company / Firm' },
  { key: 'gstin', label: 'GSTIN' },
  { key: 'orderCount', label: 'Total Orders' },
  { key: 'totalSpent', label: 'Total Spent (INR)' },
  { key: 'cashbackBalance', label: 'Cashback Balance (INR)' },
  { key: 'createdAt', label: 'Registration Date' },
];

// Orders Export Definition
export const orderExportColumns = [
  { key: 'orderId', label: 'Order ID' },
  { key: 'customerName', label: 'Customer Name' },
  { key: 'customerEmail', label: 'Customer Email' },
  { key: 'customerPhone', label: 'Customer Phone' },
  { key: 'shippingAddress', label: 'Delivery Address' },
  { key: 'paymentMethod', label: 'Payment Mode' },
  { key: 'totalAmount', label: 'Grand Total (INR)' },
  { key: 'status', label: 'Order Status' },
  { key: 'trackingNumber', label: 'Courier Tracking No' },
  { key: 'createdAt', label: 'Order Date' },
];

// Sample Import Templates (JSON / Object form)
export const sampleProductTemplate = [
  {
    id: 'prod-demo-1',
    name: 'Sample 12V 10A 8-Channel CCTV Power SMPS',
    sku: 'ITS-PWR-8CH-DEMO',
    category: 'Power Solutions',
    price: 950,
    oldPrice: 1250,
    badge: 'Best Seller',
    section: 'featured',
    short: 'Heavy-duty copper SMPS with overload surge protection',
    description: 'Universal 8-channel CCTV power supply box with auto-reset PTC fuse and LED indicators for reliable 24x7 surveillance operations.',
    specs: 'Output: 12V DC 10A; 8 Individual Channels; Input: 100-240V AC; Pure Copper Transformer'
  },
  {
    id: 'prod-demo-2',
    name: 'Sample Pure Copper 3+1 CCTV Coaxial Cable 90M',
    sku: 'ITS-CAB-31-90M',
    category: 'Cables Range',
    price: 1350,
    oldPrice: 1650,
    badge: 'Popular',
    section: 'featured',
    short: 'Shielded RG59 3+1 copper wire with power lines',
    description: 'Premium weatherproof pure electrolytic copper coaxial cable for crystal-clear HD analog and IP surveillance setups.',
    specs: 'Length: 90 Meters Coil; Pure Electrolytic Copper; Flame Retardant PVC; Braided Shielding'
  }
];

export const sampleCustomerTemplate = [
  {
    _id: 'CUST-DEMO-01',
    name: 'Ramesh Kumar (Tech Integrators)',
    email: 'ramesh.tech@gmail.com',
    phone: '+91 98765 00001',
    role: 'wholesaler',
    status: 'Active',
    companyName: 'Ramesh Surveillance & Networks',
    gstin: '07AAAAA0000A1Z5',
    orderCount: 5,
    totalSpent: 42000,
    cashbackBalance: 500,
    createdAt: new Date().toISOString()
  }
];

export const sampleOrderTemplate = [
  {
    orderId: 'ORD-SAMPLE-101',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav@delhisecurity.com',
    customerPhone: '+91 98111 22233',
    shippingAddress: 'Plot 45, Okhla Industrial Phase 2, New Delhi 110020',
    paymentMethod: 'UPI / Online Transfer',
    totalAmount: 18500,
    status: 'Confirmed',
    trackingNumber: 'DELHIVERY-99281726',
    createdAt: new Date().toISOString()
  }
];
