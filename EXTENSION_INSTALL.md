# Reading Rewards Chrome Extension - Installation Guide

## For Recipients: Installing on Another Machine

### Step 1: Extract the Package
1. Download `reading-rewards-extension.tar.gz`
2. Extract it to a folder on your computer:
   - **macOS/Linux**: Right-click → "Open With" → Archive Utility, or use terminal:
     ```bash
     tar -xzf reading-rewards-extension.tar.gz
     ```
   - **Windows**: Use 7-Zip, WinRAR, or built-in extraction. If unavailable, use Git Bash or WSL.

### Step 2: Open Chrome Extensions Page
1. Open Google Chrome
2. Go to `chrome://extensions/` in the address bar
3. Or: Menu (⋮) → More tools → Extensions

### Step 3: Enable Developer Mode
- Toggle **Developer mode** ON (top-right corner)

### Step 4: Load the Extension
1. Click **Load unpacked**
2. Navigate to the extracted `chrome-extension` folder
3. Select it and click **Open**

### Step 5: Done!
- "Reading Rewards" should now appear in your extensions list
- Click the extension icon to start using it

## What the Extension Does

📚 **Reading Comprehension Enforcer**
- Blocks access to YouTube and YouTube Kids
- Requires answering 4 reading comprehension questions to unlock YouTube
- Questions ask about:
  - How long you read (dropdown: 5-60 minutes)
  - What you read (summary)
  - Key details from the story
  - Character details
- Answers are logged for parental review
- 30-minute YouTube access timer after completing questions

## Features

✅ Simple green book icon with YouTube play button
✅ Easy dropdown for reading duration (5-minute increments)
✅ Flexible input fields (no sentence requirement)
✅ Local storage of all answers with timestamps
✅ Chrome Manifest V3 compatible

## Troubleshooting

**Extension doesn't appear:**
- Make sure Developer Mode is ON
- Try reloading the page or restarting Chrome

**Can't load unpacked:**
- Verify the `chrome-extension` folder contains:
  - `manifest.json`
  - `background.js`
  - `popup.html`, `popup.js`
  - `review.html`, `review.js`
  - `menu.html`, `menu.js`
  - `icon128.png`

**Questions not saving:**
- Check that Chrome has permission to store local data
- Try clearing Chrome cache and reloading the extension

---

**Need to reinstall?** Just repeat steps 1-4. The extension folder can be stored anywhere on your computer.
