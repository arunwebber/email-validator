chrome.runtime.onInstalled.addListener(() => {
    console.log("Email Validator Extension Installed.");
  });
  
  // Placeholder function for DNS checking (you can implement real DNS validation later)
  async function checkDNS(domain) {
    console.log(`Checking DNS for domain: ${domain}`);
    return true; // Mock DNS check, assumes domain exists
  }
  
  // Export checkDNS function to be used in popup.js or content.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkDNS') {
      checkDNS(request.domain).then(result => sendResponse({ valid: result }));
      return true; // Indicate asynchronous response
    }
  });
  