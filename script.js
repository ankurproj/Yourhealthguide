// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// API configuration
const NEWS_API_KEY = 'c498239ba9784104bd2a521b0716df1b';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${NEWS_API_KEY}`;

const articlesGrid = document.getElementById('articlesGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
let allArticles = [];
let displayedCount = 0;
const articlesPerPage = 3;

// Fetch health news articles
async function fetchHealthNews() {
    try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();

        if (data.articles) {
            // Convert NewsAPI format to your format
            allArticles = data.articles.map((a, index) => ({
                id: index + 1,
                title: a.title,
                category: 'research',
                image: a.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image',
                excerpt: a.description || 'No description available.',
                date: a.publishedAt,
                url: a.url
            }));
        }

        displayArticles();
    } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback sample articles if API fails
        allArticles = [
            {
                id: 1,
                title: "Understanding Diabetes: A Comprehensive Guide",
                category: "disease",
                image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=60",
                excerpt: "Learn about the different types of diabetes, symptoms, and management strategies.",
                date: "2024-03-15",
                url: "#"
            },
            {
                id: 2,
                title: "Managing Stress in Modern Life",
                category: "prevention",
                image: "https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=500&auto=format&fit=crop&q=60",
                excerpt: "Effective techniques to manage and reduce stress in your daily life.",
                date: "2024-03-14",
                url: "#"
            },
            {
                id: 3,
                title: "Mental Health Awareness: Breaking the Stigma",
                category: "research",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60",
                excerpt: "Understanding mental health issues and how to support those affected.",
                date: "2024-03-13",
                url: "#"
            },
            {
                id: 4,
                title: "Healthy Eating Habits for Better Life",
                category: "prevention",
                image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60",
                excerpt: "Learn about the importance of healthy eating habits and how to implement them.",
                date: "2024-03-12",
                url: "#"
            },
            {
                id: 5,
                title: "Exercise and Physical Activity",
                category: "prevention",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop&q=60",
                excerpt: "Discover the benefits of regular exercise and how to stay active.",
                date: "2024-03-11",
                url: "#"
            },
            {
                id: 6,
                title: "Sleep and Health",
                category: "prevention",
                image: "https://images.unsplash.com/photo-1516486883272-5dfb8469f7c0?w=500&auto=format&fit=crop&q=60",
                excerpt: "Understand the importance of good sleep for overall health.",
                date: "2024-03-10",
                url: "#"
            }
        ];

        displayArticles();
    }
}

// Display articles based on current count
function displayArticles() {
    const articlesToDisplay = allArticles.slice(0, displayedCount + articlesPerPage);
    articlesGrid.innerHTML = articlesToDisplay.map(article => `
        <div class="article-card">
            <img src="${article.image}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="article-content">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="article-meta">
                    <span class="category">${article.category}</span>
                    <span class="date">${new Date(article.date).toLocaleDateString()}</span>
                </div>
                <a href="${article.url}" target="_blank" class="read-more">Read More</a>
            </div>
        </div>
    `).join('');

    displayedCount += articlesPerPage;

    if (displayedCount >= allArticles.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Filter functionality
// Filter functionality
function setupArticleFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;
            
            // Filter the articles based on the selected category
            let filtered = category === 'all'
                ? allArticles // Show all articles if 'all' category is selected
                : allArticles.filter(a => a.category === category);

            // Reset the displayed count and update the filtered articles
            displayedCount = 0;
            allArticles = filtered; 
            displayArticles();
        });
    });
}


// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = allArticles.filter(article =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt.toLowerCase().includes(searchTerm)
        );

        displayedCount = 0;
        articlesGrid.innerHTML = filtered.map(article => `
            <div class="article-card">
                <img src="${article.image}" alt="${article.title}">
                <div class="article-content">
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <div class="article-meta">
                        <span class="category">${article.category}</span>
                        <span class="date">${new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <a href="${article.url}" target="_blank" class="read-more">Read More</a>
                </div>
            </div>
        `).join('');

        loadMoreBtn.style.display = 'none';
    });
}

// Load more button event
loadMoreBtn.addEventListener('click', displayArticles);

// Initialize
fetchHealthNews();
setupArticleFilters();
setupSearch();


// Tab functionality for health tips
function setupCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (!tabButtons.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayHealthTips(button.dataset.category);
        });
    });
}

// Contact form handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Initialize Charts
function initializeCharts() {
    // Diabetes Chart
    const diabetesCtx = document.getElementById('diabetesChart').getContext('2d');
    new Chart(diabetesCtx, {
        type: 'bar',
        data: {
            labels: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
            datasets: [
                {
                    label: 'Male',
                    data: [2.1, 6.8, 6.5, 11.2, 11.8, 17.4],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Female',
                    data: [1.8, 6.9, 12.2, 11.8, 12.5, 14.2],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Prevalence (%)',
                        color: '#fff'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Stress Chart
    const stressCtx = document.getElementById('stressChart').getContext('2d');
    new Chart(stressCtx, {
        type: 'line',
        data: {
            labels: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
            datasets: [
                {
                    label: 'Male',
                    data: [8.9, 9.5, 8.2, 7.1, 6.3, 5.1],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Female',
                    data: [9.5, 10.2, 9.1, 8.2, 7.1, 6.0],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Stress Level (1-10)',
                        color: '#fff'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Mental Health Chart
    const mentalHealthCtx = document.getElementById('mentalHealthChart').getContext('2d');
    new Chart(mentalHealthCtx, {
        type: 'bar',
        data: {
            labels: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
            datasets: [
                {
                    label: 'Male',
                    data: [10, 14, 17, 15, 12, 9],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Female',
                    data: [13, 17, 21, 18, 15, 11],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Prevalence (%)',
                        color: '#fff'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchHealthNews();
    displayHealthTips();
    displayDailyTip();
    setupArticleFilters();
    setupCategoryTabs();
    setupSearch();
    setupContactForm();
    initializeCharts();
}); 

const imageUrl = getDynamicImageUrl(); // Fetch dynamic URL from API or database

// Check if image is valid before inserting it
checkImage(imageUrl);

function checkImage(url) {
    const img = new Image();
    img.onload = () => {
        // Image exists
        document.getElementById("imageElement").src = url;
    };
    img.onerror = () => {
        // Image doesn't exist, fallback to a default image
        document.getElementById("imageElement").src = '../D:\PU\PROJECT\health js 2\images\strees.jpeg';
    };
    img.src = url;  // Trigger image load
}
