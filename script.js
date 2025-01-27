// DOM Elements
const qrType = document.getElementById('qrType');
const dynamicInputs = document.getElementById('dynamicInputs');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrColor = document.getElementById('qrColor');
const qrCanvas = document.getElementById('qrCanvas');

// Event Listener for Type Change
qrType.addEventListener('change', updateDynamicInputs);

// Event Listener for Generate QR Code
generateBtn.addEventListener('click', generateQRCode);

// Event Listener for Download QR Code
downloadBtn.addEventListener('click', downloadQRCode);

function updateDynamicInputs() {
    const type = qrType.value;
    dynamicInputs.innerHTML = ''; // Clear previous inputs

    if (type === 'text') {
        dynamicInputs.innerHTML = `
            <div class="form-group">
                <label for="textInput">Text/URL:</label>
                <input type="text" id="textInput" placeholder="Enter text or URL">
            </div>`;
    } else if (type === 'email') {
        dynamicInputs.innerHTML = `
            <div class="form-group">
                <label for="emailAddress">Email Address:</label>
                <input type="email" id="emailAddress" placeholder="Enter email address">
            </div>
            <div class="form-group">
                <label for="emailSubject">Subject:</label>
                <input type="text" id="emailSubject" placeholder="Enter subject">
            </div>
            <div class="form-group">
                <label for="emailBody">Message:</label>
                <textarea id="emailBody" placeholder="Enter message"></textarea>
            </div>`;
    } else if (type === 'sms') {
        dynamicInputs.innerHTML = `
            <div class="form-group">
                <label for="smsNumber">Phone Number:</label>
                <input type="text" id="smsNumber" placeholder="Enter phone number">
            </div>
            <div class="form-group">
                <label for="smsMessage">Message:</label>
                <textarea id="smsMessage" placeholder="Enter SMS message"></textarea>
            </div>`;
    } else if (type === 'wifi') {
        dynamicInputs.innerHTML = `
            <div class="form-group">
                <label for="wifiSSID">WiFi SSID:</label>
                <input type="text" id="wifiSSID" placeholder="Enter WiFi SSID">
            </div>
            <div class="form-group">
                <label for="wifiPassword">Password:</label>
                <input type="password" id="wifiPassword" placeholder="Enter WiFi password">
            </div>
            <div class="form-group">
                <label for="wifiEncryption">Encryption Type:</label>
                <select id="wifiEncryption">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                </select>
            </div>`;
    } else if (type === 'vcard') {
        dynamicInputs.innerHTML = `
            <div class="form-group">
                <label for="vcardName">Name:</label>
                <input type="text" id="vcardName" placeholder="Enter name">
            </div>
            <div class="form-group">
                <label for="vcardPhone">Phone:</label>
                <input type="text" id="vcardPhone" placeholder="Enter phone number">
            </div>
            <div class="form-group">
                <label for="vcardEmail">Email:</label>
                <input type="email" id="vcardEmail" placeholder="Enter email">
            </div>`;
    } else if (type === 'image' || type === 'pdf') {
        dynamicInputs.innerHTML = `
            <div class="form-group">
                <label for="fileInput">${type.toUpperCase()} File:</label>
                <input type="file" id="fileInput" accept="${type === 'image' ? 'image/*' : '.pdf'}">
            </div>`;
    }
}

async function generateQRCode() {
    const type = qrType.value;
    const color = qrColor.value;

    let qrData;

    if (type === 'text') {
        qrData = document.getElementById('textInput').value.trim();
    } else if (type === 'email') {
        const email = document.getElementById('emailAddress').value.trim();
        const subject = document.getElementById('emailSubject').value.trim();
        const body = document.getElementById('emailBody').value.trim();
        qrData = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (type === 'sms') {
        const number = document.getElementById('smsNumber').value.trim();
        const message = document.getElementById('smsMessage').value.trim();
        qrData = `sms:${number}?body=${encodeURIComponent(message)}`;
    } else if (type === 'wifi') {
        const ssid = document.getElementById('wifiSSID').value.trim();
        const password = document.getElementById('wifiPassword').value.trim();
        const encryption = document.getElementById('wifiEncryption').value;
        qrData = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    } else if (type === 'vcard') {
        const name = document.getElementById('vcardName').value.trim();
        const phone = document.getElementById('vcardPhone').value.trim();
        const email = document.getElementById('vcardEmail').value.trim();
        qrData = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    } else if (type === 'image' || type === 'pdf') {
        const file = document.getElementById('fileInput').files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }
        qrData = URL.createObjectURL(file);
    }

    if (!qrData) {
        alert('Please fill out the required fields.');
        return;
    }

    try {
        await QRCode.toCanvas(qrCanvas, qrData, {
            width: 300,
            color: {
                dark: color,
                light: '#ffffff',
            },
        });
        downloadBtn.style.display = 'block';
    } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Failed to generate QR code.');
    }
}

function downloadQRCode() {
    const imageData = qrCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'qr-code.png';
    link.click();
}

// Initialize with default inputs
updateDynamicInputs();
