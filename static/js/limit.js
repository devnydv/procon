
        document.addEventListener("DOMContentLoaded", function () {
            const button = document.getElementById("search-button");
            const label = document.getElementById("clickLabel");
            const maxClicks = 5;
            
            // Get current date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];
            
            // Get stored data
            let storedData = JSON.parse(localStorage.getItem("clickData")) || {};
            
            // Reset count if it's a new day
            if (storedData.date !== today) {
                storedData = { date: today, count: 0 };
                localStorage.setItem("clickData", JSON.stringify(storedData));
            }
            
            updateUI();
            
            button.addEventListener("click", function () {
                if (storedData.count < maxClicks) {
                    storedData.count++;
                    localStorage.setItem("clickData", JSON.stringify(storedData));
                    updateUI();
                }
            });
            
            function updateUI() {
                let remaining = maxClicks - storedData.count;
                label.textContent = `${remaining} Requests left for today.`;
                
                if (storedData.count >= maxClicks) {
                    button.disabled = true;
                    button.textContent = "Max limit for today exceeded";
                } else {
                    button.disabled = false;
                    button.textContent = "Click Me";
                }
            }
        });
 