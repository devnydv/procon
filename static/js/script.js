import { sampleData, themeConfig } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const productInput = document.getElementById('product-input');
    const productDescription = document.getElementById('product-description');
    const productNameElement = document.getElementById('product-name');
    const resultSection = document.getElementById('result-section');
    
    // List elements
    const prosList = document.getElementById('pros-list');
    const consList = document.getElementById('cons-list');
    const detailsContent = document.getElementById('details-content');
    const whyBuyContent = document.getElementById('why-buy-content');
    const alternativesList = document.getElementById('alternatives-list');
    
    // Set dark theme
    const themeColors = themeConfig.dark;
    document.body.classList.add('dark-theme');
    
    // Update CSS variables
    Object.entries(themeColors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
    });

    // Theme management
    let currentTheme = 'dark';
    
    function setTheme(theme) {
        const themeColors = themeConfig[theme];
        document.body.classList.toggle('dark-theme', theme === 'dark');
        
        // Update CSS variables
        Object.entries(themeColors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--${key}`, value);
        });
        
        currentTheme = theme;
    }
    
    // Theme toggle handler
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/>
        </svg>
    `;
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Add event listeners
    searchButton.addEventListener('click', analyzeProduct);
    productInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeProduct();
        }
    });
    
    function analyzeProduct() {
        const productName = productInput.value.trim();
        const description = productDescription.value.trim();
        
        if (!productName || !description) {
            alert('Please enter a product name and description.');
            return;
        }
        
        // In a real application, this would make an API call
        // For demo purposes, we'll use sample data from config.js
        const result = getProductAnalysis(productName, description);
        displayResults(result);
    }
    
    function getProductAnalysis(productName, description) {
        // In a real app, this would fetch data from an API using the description
        if (description) {
            // Use AI to analyze the product based on the description
            // This would be where you'd call the LLM with the description
            analyzeWithAI(productName, description);
        }
        
        // For demo purposes, we'll use the sample data and just change the product name
        const result = JSON.parse(JSON.stringify(sampleData)); // Clone the sample data
        result.productName = productName;
        return result;
    }
    
    async function analyzeWithAI(productName, description) {
        try {
            // This would be an actual API call in a real implementation
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a product analysis expert. Given a product name and description, 
                        provide a detailed analysis including pros, cons, product details, why to buy, and similar products.`
                    },
                    {
                        role: "user",
                        content: `Product: ${productName}\nDescription: ${description}\n\nProvide analysis.`
                    }
                ],
                json: true
            });
            
            // In a real implementation, we would parse the AI response and update the UI
            console.log("AI analysis:", completion.content);
            
            // For demo purposes, we're still using the sample data displayed to the user
            
        } catch (error) {
            console.error("Error analyzing with AI:", error);
        }
    }
    
    function displayResults(data) {
        // Display product name
        productNameElement.textContent = data.productName;
        
        // Clear previous results
        prosList.innerHTML = '';
        consList.innerHTML = '';
        detailsContent.innerHTML = '';
        whyBuyContent.innerHTML = '';
        alternativesList.innerHTML = '';
        
        // Populate pros
        data.pros.forEach(pro => {
            const li = document.createElement('li');
            li.textContent = pro;
            prosList.appendChild(li);
        });
        
        // Populate cons
        data.cons.forEach(con => {
            const li = document.createElement('li');
            li.textContent = con;
            consList.appendChild(li);
        });
        
        // Populate details
        const detailsHtml = `
            <p>${data.details.description}</p>
            <ul style="margin-top: 15px;">
                ${data.details.specs.map(spec => `<li>${spec}</li>`).join('')}
            </ul>
        `;
        detailsContent.innerHTML = detailsHtml;
        
        // Populate why buy
        whyBuyContent.innerHTML = `<p>${data.whyBuy}</p>`;
        
        // Populate alternatives
        data.alternatives.forEach(alt => {
            const li = document.createElement('li');
            li.textContent = alt;
            alternativesList.appendChild(li);
        });
        
        // Show results section
        resultSection.classList.remove('hidden');
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
});