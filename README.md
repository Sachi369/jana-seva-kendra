# Jana Seva Kendra – Digital Service Center
## Admin Setup & Customization Guide

---

## 📁 File Structure

```
jana-seva-kendra/
├── index.html                     ← Main website file
├── style.css                      ← All styles
├── script.js                      ← JavaScript & form logic
├── google-apps-script/
│   └── Code.gs                    ← Google Sheets integration code
└── README.md                      ← This file
```

---

## 🚀 Step 1: Connect Google Sheets (Form Submission)

### A. Create Google Spreadsheet
1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Name it: **Jana Seva Kendra – Applications**
4. Copy the **Spreadsheet ID** from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`**`/edit`
   - The bold part above is the Spreadsheet ID

### B. Set Up Apps Script
1. In your spreadsheet, go to **Extensions → Apps Script**
2. Delete all existing code
3. Open the file `google-apps-script/Code.gs` from this folder
4. Copy all the code and paste it into Apps Script editor
5. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Spreadsheet ID
6. Click **Save** (Ctrl+S)

### C. Deploy as Web App
1. Click **Deploy → New Deployment**
2. Click the ⚙️ gear icon → Select **Web App**
3. Fill in:
   - Description: `Jana Seva Kendra Form Handler`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → sign in with your Google account
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### D. Paste URL in script.js
1. Open `script.js`
2. Find line: `GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec"`
3. Replace with your copied URL

### E. Test
1. Run `testSubmission()` in Apps Script editor → should add a test row to your sheet
2. Submit your website form → data should appear in Google Sheets within seconds

---

## 📞 Step 2: Update Contact Information

Open `index.html` and search for `<!-- ADMIN:` comments. Update:

| What to update | Where in index.html |
|---|---|
| Phone number | Line with `href="tel:+91...` |
| WhatsApp number | All `wa.me/91...` links |
| Email address | Line with `href="mailto:...` |
| Office address | CI-item with address text |
| Google Maps embed | `<iframe src="...` in contact section |
| Social media links | Instagram, Twitter, Facebook `href` values |

Also update `script.js`:
```js
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_ID/exec",
  WHATSAPP_NUMBER:   "919876543210",   // ← Your WhatsApp number
  CENTER_NAME:       "Jana Seva Kendra"
};
```

---

## 📢 Step 3: Update Notices

In `index.html`, find the `<!-- ADMIN: To add/edit notices -->` comment.

**To add a new notice:**
Copy one of the existing `col-md-6 col-lg-4` divs and update:
- Icon class (Bootstrap Icons: https://icons.getbootstrap.com)
- Notice type class: `notice-new`, `notice-urgent`, or `notice-info`
- Badge class: `badge-new`, `badge-urgent`, or `badge-info`
- Title, description, and date

**Notice types:**
- 🟢 `notice-new` + `badge-new` → Green border, "New" badge
- 🔴 `notice-urgent` + `badge-urgent` → Red border, "Urgent" badge
- 🔵 `notice-info` + `badge-info` → Blue border, "Info" badge

---

## 🛠️ Step 4: Add/Remove Services

In `index.html`, find the Services Section. Each service is a `col-sm-6 col-lg-4` div.

**To add a new service card, copy this template:**
```html
<div class="col-sm-6 col-lg-4" data-animate="fade-up" data-delay="0">
  <div class="service-card">
    <div class="sc-icon" style="--col:#1a73e8">
      <i class="bi bi-ICON-NAME-HERE"></i>
    </div>
    <h5>Service Name Here</h5>
    <p>Short description of the service goes here.</p>
    <div class="sc-meta"><i class="bi bi-clock"></i> 3–5 Working Days</div>
    <a href="#apply" class="btn btn-service">Apply Now <i class="bi bi-arrow-right"></i></a>
  </div>
</div>
```

**Icon colors to use:**
- Blue: `#1a73e8`
- Purple: `#7c3aed`
- Green: `#0f9d58`
- Yellow: `#f4b400`
- Red: `#db4437`
- Teal: `#0891b2`
- Orange: `#ea580c`

**Find icons at:** https://icons.getbootstrap.com

---

## 📋 Step 5: Add New Services to the Form Dropdown

In `index.html`, find the `<select id="service">` dropdown and add a new `<option>`:
```html
<option>Your New Service Name</option>
```

---

## 🗺️ Step 6: Update Google Maps Embed

1. Go to https://maps.google.com
2. Search for your center's location
3. Click **Share → Embed a map**
4. Copy the `src="..."` URL from the iframe code
5. In `index.html`, replace the existing `src="..."` of the Google Maps iframe

---

## 📧 Step 7: Enable Email Notifications (Optional)

In `google-apps-script/Code.gs`:
1. Update `adminEmail` with your Gmail address
2. In `doPost()`, uncomment the line: `// sendAdminNotification(data);`
3. Re-deploy (Deploy → Manage deployments → Edit → New version → Deploy)

---

## 🌐 Step 8: Deploying the Website

**Option A – GitHub Pages (Free)**
1. Create a GitHub account at https://github.com
2. Create a new repository named `jana-seva-kendra`
3. Upload all files (index.html, style.css, script.js)
4. Go to Settings → Pages → Source: main branch
5. Your site will be live at `https://yourusername.github.io/jana-seva-kendra`

**Option B – Netlify (Free, easier)**
1. Go to https://netlify.com
2. Drag & drop your project folder onto the dashboard
3. Get a free `.netlify.app` URL instantly

**Option C – Custom Domain**
- Buy a domain from GoDaddy, Namecheap, etc.
- Point it to your hosting (GitHub Pages or Netlify both support custom domains)

---

## ✅ Pre-Launch Checklist

- [ ] Google Apps Script deployed and URL pasted in script.js
- [ ] Phone/WhatsApp number updated in index.html and script.js
- [ ] Email address updated
- [ ] Office address updated
- [ ] Google Maps embed URL updated
- [ ] Social media links updated (Instagram, Twitter, Facebook)
- [ ] Test form submitted → data visible in Google Sheets
- [ ] Website tested on mobile phone
- [ ] Notices updated with current information

---

## 📊 Managing Applications in Google Sheets

After applicants submit the form, their data appears in your Google Sheet. You can:

- **Filter** by Service type (use the filter button)
- **Sort** by date to see newest applications
- **Update Status column** from "Pending" to "Processing", "Completed", or "Rejected"
- **Add notes** in any cell for your reference
- Use Google Sheets on your phone to manage applications from anywhere

---

*Built for Digital India – Jana Seva Kendra 2024*
