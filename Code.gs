/**
 * ============================================================
 * JANA SEVA KENDRA – Google Apps Script
 * File: Code.gs
 *
 * PURPOSE: Receives form submissions from the website and
 *          stores them in a Google Spreadsheet automatically.
 *
 * HOW TO SET UP (Step-by-Step):
 * ============================================================
 * 1. Open Google Sheets: https://sheets.google.com
 * 2. Create a new spreadsheet named "Jana Seva Kendra – Applications"
 * 3. Go to Extensions → Apps Script
 * 4. Delete any existing code in the editor
 * 5. Paste the ENTIRE contents of this file into the editor
 * 6. Update the SPREADSHEET_ID variable below with your sheet ID
 *    (The ID is in the URL: docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit)
 * 7. Click Save (Ctrl+S)
 * 8. Click Deploy → New Deployment
 * 9. Click the gear icon next to "Type" → Select "Web App"
 * 10. Set:
 *       Description     → "Jana Seva Kendra Form Handler"
 *       Execute as      → "Me"
 *       Who has access  → "Anyone"
 * 11. Click "Deploy"
 * 12. COPY the Web App URL shown (looks like https://script.google.com/macros/s/...)
 * 13. Paste that URL into script.js → CONFIG.GOOGLE_SCRIPT_URL
 * 14. Done! Test by submitting the form on your website.
 * ============================================================
 */

// ──────────────────────────────────────────────────────────────
// ADMIN: Replace the value below with your Google Sheet ID
// ──────────────────────────────────────────────────────────────
const SPREADSHEET_ID = "1ZMv9pCkY29zd86Vh1XsQizkcdKyY6IqPv2w1FDBlm-4";

// Name of the sheet tab where applications will be stored
const SHEET_NAME = "Applications";

// Column headers for the spreadsheet
const HEADERS = [
  "Sr. No.",
  "Submission Date & Time",
  "Full Name",
  "Mobile Number",
  "Email",
  "State",
  "Full Address",
  "Service Required",
  "Message / Notes",
  "Source",
  "Status"
];

/**
 * doPost – Handles incoming POST requests from the website form
 * This function is called automatically when the form is submitted.
 */
function doPost(e) {
  try {
    // Parse incoming JSON data from the website
    const data = JSON.parse(e.postData.contents);

    // Open the spreadsheet
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
    }

    // If sheet is empty (first entry), add headers
    if (sheet.getLastRow() === 0) {
      setupHeaders(sheet);
    }

    // Get next row number
    const lastRow = sheet.getLastRow();
    const srNo    = lastRow; // First data row starts at row 2, Sr.No. = 1

    // Append the new application data
    sheet.appendRow([
      srNo,                      // Sr. No.
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.fullName  || "",      // Full Name
      data.mobile    || "",      // Mobile Number
      data.email     || "",      // Email
      data.state     || "",      // State
      data.address   || "",      // Address
      data.service   || "",      // Service Required
      data.message   || "",      // Message / Notes
      data.source    || "Website", // Source
      "Pending"                  // Status (admin updates manually)
    ]);

    // Auto-format the new row
    formatLastRow(sheet);

    // Send email notification to admin (optional — see function below)
    // sendAdminNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Application saved." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("Error in doPost:", error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet – Handles GET requests (used for testing the deployment)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status:  "active",
      message: "Jana Seva Kendra Form API is running correctly.",
      time:    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * setupHeaders – Writes column headers to the first row
 */
function setupHeaders(sheet) {
  sheet.appendRow(HEADERS);

  // Style the header row
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange
    .setBackground("#1a73e8")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(11)
    .setHorizontalAlignment("center");

  // Freeze header row so it stays visible while scrolling
  sheet.setFrozenRows(1);

  // Auto-resize columns for better readability
  sheet.autoResizeColumns(1, HEADERS.length);

  // Set minimum column widths
  sheet.setColumnWidth(1, 60);   // Sr. No.
  sheet.setColumnWidth(2, 180);  // Date & Time
  sheet.setColumnWidth(3, 160);  // Name
  sheet.setColumnWidth(4, 140);  // Mobile
  sheet.setColumnWidth(5, 180);  // Email
  sheet.setColumnWidth(6, 120);  // State
  sheet.setColumnWidth(7, 220);  // Address
  sheet.setColumnWidth(8, 200);  // Service
  sheet.setColumnWidth(9, 250);  // Message
  sheet.setColumnWidth(10, 100); // Source
  sheet.setColumnWidth(11, 100); // Status
}

/**
 * formatLastRow – Applies alternating row colors and borders
 */
function formatLastRow(sheet) {
  const lastRow = sheet.getLastRow();
  const range   = sheet.getRange(lastRow, 1, 1, HEADERS.length);

  // Alternating row colors
  if (lastRow % 2 === 0) {
    range.setBackground("#f0f6ff");
  } else {
    range.setBackground("#ffffff");
  }

  // Vertical alignment
  range.setVerticalAlignment("middle");

  // Color the Status cell
  const statusCell = sheet.getRange(lastRow, HEADERS.length);
  statusCell
    .setBackground("#fff3cd")
    .setFontColor("#856404")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
}

/**
 * sendAdminNotification – Sends an email when a new application arrives
 * ADMIN: To enable this, uncomment the call in doPost() above,
 *        and update the email address below.
 */
function sendAdminNotification(data) {
  const adminEmail = "your-admin-email@gmail.com"; // ← UPDATE THIS

  const subject = `New Application: ${data.service} – ${data.fullName}`;
  const body = `
A new application has been submitted on Jana Seva Kendra website.

────────────────────────────────
APPLICANT DETAILS
────────────────────────────────
Name:     ${data.fullName}
Mobile:   ${data.mobile}
Email:    ${data.email}
State:    ${data.state}
Address:  ${data.address}

SERVICE REQUESTED: ${data.service}

Message: ${data.message}

Submitted On: ${data.timestamp}
────────────────────────────────

Please log in to Google Sheets to update the status after processing.

– Jana Seva Kendra Website Bot
  `;

  try {
    GmailApp.sendEmail(adminEmail, subject, body);
  } catch (err) {
    console.error("Email notification failed:", err.toString());
  }
}

/**
 * testSubmission – Run this function manually to test the setup
 * In Apps Script editor: Select "testSubmission" → Click "Run"
 */
function testSubmission() {
  const testData = {
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    fullName:  "Test User",
    mobile:    "+91 98765 43210",
    email:     "test@example.com",
    state:     "Odisha",
    address:   "Test Village, Test District – 000000",
    service:   "Income Certificate",
    message:   "This is a test submission",
    source:    "Apps Script Test"
  };

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet   = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupHeaders(sheet);
  }

  if (sheet.getLastRow() === 0) {
    setupHeaders(sheet);
  }

  const srNo = sheet.getLastRow();
  sheet.appendRow([
    srNo,
    testData.timestamp,
    testData.fullName,
    testData.mobile,
    testData.email,
    testData.state,
    testData.address,
    testData.service,
    testData.message,
    testData.source,
    "Pending"
  ]);

  formatLastRow(sheet);
  Logger.log("✅ Test submission added successfully! Check your Google Sheet.");
}
