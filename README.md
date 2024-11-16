# Email Validator Chrome Extension

This Chrome extension allows you to validate email addresses directly in your browser. It provides functionalities like bulk email validation, adding invalid emails to a registry, and copying valid emails in a comma-separated format.

## Features

- **Bulk Email Validation**: Validate multiple emails at once from a single text input.
- **Manually Add Invalid Emails**: Add invalid emails to a persistent invalid email registry stored in `localStorage`.
- **Copy Valid Emails**: Copy the valid emails as a comma-separated list to your clipboard for easy pasting.
- **Invalid Emails Registry**: View and manage a list of manually added invalid emails, with the ability to remove them using a close button.

## Technologies Used

- **HTML5**: Structure for the popup UI.
- **CSS3**: Styling for the Chrome extension popup.
- **JavaScript**: Handles email validation, clipboard actions, and management of invalid email registry.

## How to Use

### Step 1: Install the Extension
1. Download the extension files or clone this repository:
2. Open **Google Chrome** and go to **chrome://extensions**.
3. Enable **Developer mode** by toggling the switch in the top right corner.
4. Click **Load unpacked** and select the folder containing the extension files.

### Step 2: Use the Extension
1. Click the **Email Validator** icon in the Chrome toolbar to open the popup.
2. In the **Enter Emails** section:
   - Enter email addresses separated by commas or on separate lines.
   - Click the **Validate Emails** button to check each email.
3. **Validation Results**:
   - Valid emails will appear in green text.
   - Invalid emails will appear in red text.
4. **Add Invalid Emails**: 
   - You can manually add invalid emails using the **Manually Add Invalid Emails** section. 
   - Click **Add Invalid Emails** to save them.
5. **Remove Invalid Emails**:
   - Manually added invalid emails will have a **close button** (red "×") next to them, which you can click to remove them from the registry.
6. **Copy Valid Emails**: 
   - Once the emails are validated, click the **Copy Valid Emails** button to copy the valid emails as a comma-separated list to your clipboard.

### Step 3: View Invalid Email Registry
- The **Invalid Emails Registry** section will show all manually added invalid emails, which will be saved in your browser's local storage and persist across sessions.
- Invalid emails can be removed from the registry using the close button next to each email.

## Features Breakdown

### 1. Bulk Email Validation:
- Enter multiple email addresses (separated by commas or new lines) and validate them all at once.
- The extension checks email syntax, domain existence, and MX records.

### 2. Invalid Email Registry:
- Manually added invalid emails are stored in `localStorage` and displayed in the **Invalid Emails Registry** section.
- Avoids duplicates by checking before adding invalid emails.
- Each invalid email entry includes a **close button** for easy removal.

### 3. Copy Valid Emails:
- After validation, the **Copy Valid Emails** button allows you to copy the valid emails as a comma-separated list to your clipboard.

### 4. Persistent Invalid Emails:
- The list of invalid emails is retained even if you close or reload the extension.

## Installation

1. **Clone the repository**:

2. **Load the extension**:
   - Open **Google Chrome** and navigate to **chrome://extensions**.
   - Enable **Developer mode** at the top-right corner.
   - Click on **Load unpacked**, and select the folder where you cloned/downloaded the extension.

3. **Use the extension**:
   - After loading the extension, click the icon in the Chrome toolbar to open the extension popup.

## Files in this Repository

- `manifest.json`: The configuration file for the Chrome extension.
- `popup.html`: The HTML structure for the popup UI.
- `popup.js`: The JavaScript file responsible for email validation and managing invalid email registry.
- `style.css`: The CSS file that handles the visual design of the popup.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests. Contributions are always welcome!

## License

This project is open-source and available under the [MIT License](LICENSE).
