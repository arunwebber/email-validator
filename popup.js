document.getElementById('validate').addEventListener('click', function() {
    const emails = document.getElementById('emails').value.split(/\n|,/).map(email => email.trim());
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';  // Clear previous results

    const validEmails = []; // To store valid emails
    let processedEmails = 0;  // Track the number of processed emails

    emails.forEach(async (email) => {
        const result = await validateEmail(email);
        const resultText = document.createElement('div');
        resultText.textContent = `${email}: ${result.message}`;
        resultText.classList.add(result.isValid ? 'valid' : 'invalid');
        resultDiv.appendChild(resultText);

        if (result.isValid) {
            validEmails.push(email); // Add valid emails to the list
        }

        processedEmails++;
        if (processedEmails === emails.length) {
            addCopyButton(validEmails, resultDiv);
        }
    });
});

document.getElementById('addInvalid').addEventListener('click', function() {
    const invalidEmailInput = document.getElementById('invalidEmail').value.trim();
    if (invalidEmailInput) {
        const emails = invalidEmailInput.split(',').map(email => email.trim());
        emails.forEach(email => {
            if (email && !isEmailInInvalidList(email)) {
                addToInvalidEmailList(email);
            }
        });
        document.getElementById('invalidEmail').value = ''; // Clear the input
    }
});

function isEmailInInvalidList(email) {
    const invalidEmailList = JSON.parse(localStorage.getItem('invalidEmails')) || [];
    return invalidEmailList.includes(email);
}

function addToInvalidEmailList(email) {
    const invalidEmailList = JSON.parse(localStorage.getItem('invalidEmails')) || [];
    invalidEmailList.push(email);
    localStorage.setItem('invalidEmails', JSON.stringify(invalidEmailList));

    const listItem = document.createElement('li');
    listItem.textContent = email;
    document.getElementById('invalidEmailsList').appendChild(listItem);
}


async function validateEmail(email) {
    const invalidEmailList = JSON.parse(localStorage.getItem('invalidEmails')) || [];
    
    // First check if the email is already in the invalid list
    if (invalidEmailList.includes(email)) {
        return { isValid: false, message: "Email is in the invalid registry." };
    }

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
        return { isValid: false, message: "Invalid email syntax." };
    }

    // Check if email has invalid characters or extra text after domain
    if (email.includes("website") || email.includes("if")) {
        return { isValid: false, message: "Email contains invalid characters or extra text." };
    }

    const domain = email.split("@")[1];
    const punycodeDomain = toASCII(domain);

    const dnsExists = await checkDNS(punycodeDomain);
    if (!dnsExists) {
        return { isValid: false, message: `Domain does not exist: ${domain}` };
    }

    const hasMX = await checkMXRecords(punycodeDomain);
    if (!hasMX) {
        return { isValid: false, message: `Domain does not have MX records: ${domain}` };
    }

    return { isValid: true, message: "Valid email address!" };
}

// DNS lookup via Google's DNS-over-HTTPS API
async function checkMXRecords(domain) {
    const url = `https://dns.google/resolve?name=${domain}&type=MX`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.Answer && data.Answer.length > 0;
    } catch (error) {
        console.error('Error performing MX lookup:', error);
        return false;
    }
}

async function checkDNS(domain) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { action: 'checkDNS', domain: domain },
            response => resolve(response.valid)
        );
    });
}

function toASCII(domain) {
    const parts = domain.split(".");
    return parts
        .map((part) =>
            /[^\x00-\x7F]/.test(part) ? "xn--" + punyEncode(part) : part
        )
        .join(".");
}

function punyEncode(input) {
    const base = 36,
        tMin = 1,
        tMax = 26,
        skew = 38,
        damp = 700,
        initialBias = 72,
        initialN = 128;

    let n = initialN;
    let bias = initialBias;
    let delta = 0;
    let output = [];

    const basicChars = Array.from(input)
        .map((ch) => ch.codePointAt(0))
        .filter((cp) => cp < 0x80);
    output.push(...basicChars.map((cp) => String.fromCharCode(cp)));

    const nonBasicChars = Array.from(input)
        .map((ch) => ch.codePointAt(0))
        .filter((cp) => cp >= 0x80);
    let handledChars = basicChars.length;

    if (nonBasicChars.length) output.push("-");

    let h = handledChars;
    while (h < nonBasicChars.length) {
        let m = Math.min(...nonBasicChars.filter((cp) => cp >= n));

        delta += (m - n) * (h + 1);
        n = m;

        for (let cp of Array.from(input).map((ch) => ch.codePointAt(0))) {
            if (cp < n) delta++;
            if (cp === n) {
                let q = delta;
                for (let k = base; ; k += base) {
                    const t = k <= bias + tMin ? tMin : k >= bias + tMax ? tMax : k - bias;
                    if (q < t) break;
                    output.push(String.fromCharCode((t + ((q - t) % (base - t))) + 22));
                    q = Math.floor((q - t) / (base - t));
                }
                output.push(String.fromCharCode(q + 22));
                bias = adaptBias(delta, h + 1, h === handledChars);
                delta = 0;
                h++;
            }
        }
        delta++;
        n++;
    }

    return output.join("");
}

function adaptBias(delta, numPoints, firstTime) {
    delta = firstTime ? Math.floor(delta / 700) : delta >> 1;
    delta += Math.floor(delta / numPoints);
    let k = 0;
    while (delta > 455) {
        delta = Math.floor(delta / 35);
        k += 36;
    }
    return k + Math.floor((delta * 36) / (delta + 38));
}

function addCopyButton(validEmails, resultDiv) {
    if (validEmails.length > 0) {
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Valid Emails';
        copyButton.addEventListener('click', () => {
            copyToClipboard(validEmails.join(', ')); // Join emails with a comma and a space
        });
        resultDiv.appendChild(copyButton);
    }
}

function copyToClipboard(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert('Valid emails copied to clipboard!');
}


function addToInvalidEmailList(email) {
    const invalidEmailList = JSON.parse(localStorage.getItem('invalidEmails')) || [];
    if (!invalidEmailList.includes(email)) {
        invalidEmailList.push(email);
        localStorage.setItem('invalidEmails', JSON.stringify(invalidEmailList));
    }

    const listItem = document.createElement('li');
    listItem.textContent = email;
    document.getElementById('invalidEmailsList').appendChild(listItem);
}

function loadInvalidEmails() {
    const invalidEmailList = JSON.parse(localStorage.getItem('invalidEmails')) || [];
    const invalidEmailListElement = document.getElementById('invalidEmailsList');
    invalidEmailList.forEach(email => {
        const listItem = document.createElement('li');
        listItem.textContent = email;
        invalidEmailListElement.appendChild(listItem);
    });
}

window.onload = loadInvalidEmails;
