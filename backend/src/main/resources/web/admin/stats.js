// i dont know any js so chatgpt takes the credit for this one

document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch statistics

    function fetchStatistics() {
        fetch('http://localhost:8820/api/stats') // will be replaced with hosted endpoint when relevant
            .then(response => {
                
                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                return response.json(); // Assuming the API returns JSON
            })
            .then(data => {
                // Process the data and display it on the page
                displayStats(data);
            })
            .catch(error => {
                console.error('Error fetching statistics:', error);
                document.getElementById('stats').innerHTML = '<p>Error loading statistics.</p>';
            });
    }

    // Function to display stats in the HTML
    function displayStats(stats) {
        const statsDiv = document.getElementById('stats');
    
        // Start building the HTML content
        let htmlContent = `
            <p><strong>Total Time Slots:</strong> ${stats.timeslots}</p>
            <p><strong>Booked Time Slots:</strong> ${stats.bookedTimeslots}</p>
            <h3>Subject Counts:</h3>
            <ul>
        `;
    
        // Iterate over the subject counts and display them
        for (const [subject, count] of Object.entries(stats.subjectCounts)) {
            htmlContent += `<li>${subject}: ${count}</li>`;
        }
    
        htmlContent += `</ul><h3>User Counts:</h3><ul>`;
    
        // Iterate over the user counts and display them
        for (const [userType, count] of Object.entries(stats.userCounts)) {
            htmlContent += `<li>${userType}: ${count}</li>`;
        }
    
        htmlContent += `</ul>`;
    
        // Set the content of the stats div to display the statistics
        statsDiv.innerHTML = htmlContent;
    }

    // Call the function to fetch the statistics when the page is loaded
    fetchStatistics();
});
