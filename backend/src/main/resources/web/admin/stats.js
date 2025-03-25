// i dont know any js so chatgpt takes the credit for this one

document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('subjectChart').getContext('2d');

        const subjectChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: 'Subject Counts',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',  // Red
                        'rgba(54, 162, 235, 0.7)',  // Blue
                        'rgba(255, 206, 86, 0.7)',  // Yellow
                        'rgba(75, 192, 192, 0.7)',  // Teal
                        'rgba(153, 102, 255, 0.7)', // Purple
                        'rgba(255, 159, 64, 0.7)',  // Orange
                        'rgba(0, 200, 100, 0.7)'    // Green
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', 
                        'rgba(54, 162, 235, 1)', 
                        'rgba(255, 206, 86, 1)', 
                        'rgba(75, 192, 192, 1)', 
                        'rgba(153, 102, 255, 1)', 
                        'rgba(255, 159, 64, 1)', 
                        'rgba(0, 200, 100, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false, // Turn off auto-resizing
                maintainAspectRatio: false, // Allow custom aspect ratio
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        const ctx2 = document.getElementById('userChart').getContext('2d');
        const userChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'User Counts',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',  // Red
                        'rgba(54, 162, 235, 0.7)',  // Blue
                        'rgba(255, 206, 86, 0.7)',  // Yellow
                        'rgba(75, 192, 192, 0.7)',  // Teal
                        'rgba(153, 102, 255, 0.7)', // Purple
                        'rgba(255, 159, 64, 0.7)',  // Orange
                        'rgba(0, 200, 100, 0.7)'    // Green
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', 
                        'rgba(54, 162, 235, 1)', 
                        'rgba(255, 206, 86, 1)', 
                        'rgba(75, 192, 192, 1)', 
                        'rgba(153, 102, 255, 1)', 
                        'rgba(255, 159, 64, 1)', 
                        'rgba(0, 200, 100, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false, // Turn off auto-resizing
                maintainAspectRatio: false, // Allow custom aspect ratio
                }
            
        });
        fetch('/api/stats')
            .then(response => response.json())
            .then(data => {
                const subjects = Object.keys(data.subjectCounts);
                const counts = Object.values(data.subjectCounts);

                subjectChart.data.labels = subjects;
                subjectChart.data.datasets[0].data = counts;

                const selectedUsers = ["TUTOR", "PARENT", "STUDENT"];
                const users = Object.keys(data.userCounts).filter(user => selectedUsers.includes(user));
                const userCounts = users.map(user => data.userCounts[user]);

                userChart.data.labels = users;
                userChart.data.datasets[0].data = userCounts;

                subjectChart.update();
                userChart.update();

                const bookedTimeslots = data.bookedTimeslots;
                const totalTimeslots = data.timeslots;
        
                // Calculate percentage, handle division by zero
                const percentage = totalTimeslots > 0 
                    ? ((bookedTimeslots / totalTimeslots) * 100).toFixed(2)  // Round to 2 decimal places
                    : 0;
        
                // Display percentage in an element with ID "percentageDisplay"
                document.getElementById('TimeSlots').innerText = `Published Time Slots: ${totalTimeslots}\n Booked Time Slots: ${bookedTimeslots}`;
                document.getElementById('percentageDisplay').innerText = `Booking Rate: ${percentage}%`;

            })
            .catch(error => console.error('Error fetching data:', error));

});
