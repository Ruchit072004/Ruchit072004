// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const clientsContainer = document.getElementById('clients-container');
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const API_BASE_URL = 'http://localhost:3000/api';

// Toggle mobile navigation
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Fetch and display projects
async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        projectsContainer.innerHTML = '<p class="error">Failed to load projects. Please try again later.</p>';
    }
}

// Display projects in the DOM
function displayProjects(projects) {
    if (!projects || projects.length === 0) {
        projectsContainer.innerHTML = '<p>No projects available at the moment.</p>';
        return;
    }
    
    projectsContainer.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                <img src="${project.image || 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${project.name}">
            </div>
            <div class="project-info">
                <div class="project-meta">
                    <span>${project.category || 'Consultation'}</span>
                    <span>${project.location || 'Remote'}</span>
                </div>
                <h3>${project.name}</h3>
                <p>${project.description || 'No description available.'}</p>
                <button class="btn read-more-btn" data-id="${project.id}">Read More</button>
            </div>
        </div>
    `).join('');
}

// Fetch and display clients
async function fetchClients() {
    try {
        const response = await fetch(`${API_BASE_URL}/clients`);
        if (!response.ok) throw new Error('Failed to fetch clients');
        
        const clients = await response.json();
        displayClients(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        clientsContainer.innerHTML = '<p class="error">Failed to load clients. Please try again later.</p>';
    }
}

// Display clients in the DOM
function displayClients(clients) {
    if (!clients || clients.length === 0) {
        clientsContainer.innerHTML = '<p>No client testimonials available at the moment.</p>';
        return;
    }
    
    clientsContainer.innerHTML = clients.map(client => `
        <div class="client-card">
            <div class="client-image">
                <img src="${client.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${client.name}">
            </div>
            <div class="client-info">
                <h4>${client.name}</h4>
                <div class="client-designation">${client.designation}</div>
                <p class="client-description">"${client.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}"</p>
            </div>
        </div>
    `).join('');
}

// Handle contact form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        city: document.getElementById('city').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        const messageDiv = document.getElementById('form-message');
        if (response.ok) {
            messageDiv.textContent = 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.';
            messageDiv.className = 'form-message success';
            contactForm.reset();
        } else {
            messageDiv.textContent = `Error: ${result.message || 'Failed to send message'}`;
            messageDiv.className = 'form-message error';
        }
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = 'Network error. Please check your connection and try again.';
        messageDiv.className = 'form-message error';
        messageDiv.style.display = 'block';
    }
});

// Handle newsletter subscription
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('newsletter-email').value;
    
    if (!email || !email.includes('@')) {
        showNewsletterMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNewsletterMessage('Thank you for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
        } else {
            showNewsletterMessage(result.message || 'Failed to subscribe. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        showNewsletterMessage('Network error. Please check your connection and try again.', 'error');
    }
});

// Show newsletter message
function showNewsletterMessage(message, type) {
    const messageDiv = document.getElementById('newsletter-message');
    messageDiv.textContent = message;
    messageDiv.className = `newsletter-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    fetchClients();
});