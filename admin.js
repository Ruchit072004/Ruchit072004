// DOM Elements
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const contentSections = document.querySelectorAll('.content-section');
const API_BASE_URL = 'http://localhost:3000/api';

// Current state
let currentSection = 'dashboard';
let projects = [];
let clients = [];
let contacts = [];
let subscribers = [];

// Sidebar navigation
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        sidebarLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get the section to show
        const section = link.getAttribute('data-section');
        
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the selected section
        document.getElementById(section).classList.add('active');
        currentSection = section;
        
        // Load data for the section if needed
        if (section === 'dashboard') {
            loadDashboardStats();
        } else if (section === 'projects') {
            loadProjects();
        } else if (section === 'clients') {
            loadClients();
        } else if (section === 'contacts') {
            loadContacts();
        } else if (section === 'newsletter') {
            loadSubscribers();
        }
    });
});

// Logout button
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // In a real app, you would clear session/token here
        window.location.href = 'index.html';
    }
});

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Fetch all data
        const [projectsRes, clientsRes, contactsRes, subscribersRes] = await Promise.all([
            fetch(`${API_BASE_URL}/projects`),
            fetch(`${API_BASE_URL}/clients`),
            fetch(`${API_BASE_URL}/contacts`),
            fetch(`${API_BASE_URL}/newsletter`)
        ]);
        
        // Update counts
        document.getElementById('projects-count').textContent = 
            projectsRes.ok ? (await projectsRes.json()).length : '0';
        document.getElementById('clients-count').textContent = 
            clientsRes.ok ? (await clientsRes.json()).length : '0';
        document.getElementById('contacts-count').textContent = 
            contactsRes.ok ? (await contactsRes.json()).length : '0';
        document.getElementById('subscribers-count').textContent = 
            subscribersRes.ok ? (await subscribersRes.json()).length : '0';
            
        // Load recent activity
        loadRecentActivity();
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load recent activity
async function loadRecentActivity() {
    try {
        const response = await fetch(`${API_BASE_URL}/activity`);
        if (!response.ok) throw new Error('Failed to fetch activity');
        
        const activity = await response.json();
        const activityList = document.getElementById('recent-activity');
        
        if (activity.length === 0) {
            activityList.innerHTML = '<p>No recent activity.</p>';
            return;
        }
        
        activityList.innerHTML = activity.map(item => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="activity-time">${item.time}</div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading activity:', error);
        document.getElementById('recent-activity').innerHTML = 
            '<p class="error">Failed to load recent activity.</p>';
    }
}

// Project Management
const addProjectBtn = document.getElementById('add-project-btn');
const addProjectForm = document.getElementById('add-project-form');
const cancelProjectBtn = document.getElementById('cancel-project-btn');
const projectForm = document.getElementById('project-form');

// Show add project form
addProjectBtn.addEventListener('click', () => {
    addProjectForm.style.display = 'block';
    addProjectBtn.style.display = 'none';
});

// Hide add project form
cancelProjectBtn.addEventListener('click', () => {
    addProjectForm.style.display = 'none';
    addProjectBtn.style.display = 'flex';
    projectForm.reset();
});

// Handle project form submission
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value,
        image: document.getElementById('project-image').value,
        category: document.getElementById('project-category').value,
        location: document.getElementById('project-location').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Project added successfully!');
            projectForm.reset();
            addProjectForm.style.display = 'none';
            addProjectBtn.style.display = 'flex';
            loadProjects();
            loadDashboardStats();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'Failed to add project'}`);
        }
    } catch (error) {
        console.error('Error adding project:', error);
        alert('Network error. Please check your connection and try again.');
    }
});

// Load projects for management
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        projects = await response.json();
        const tableBody = document.getElementById('projects-table-body');
        
        if (projects.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No projects found. Add your first project!</td></tr>';
            return;
        }
        
        tableBody.innerHTML = projects.map(project => `
            <tr>
                <td><img src="${project.image || 'https://via.placeholder.com/50'}" alt="${project.name}"></td>
                <td>${project.name}</td>
                <td>${project.description.length > 50 ? project.description.substring(0, 50) + '...' : project.description}</td>
                <td>${project.category || 'N/A'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${project.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-delete" data-id="${project.id}"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                if (confirm('Are you sure you want to delete this project?')) {
                    await deleteProject(id);
                }
            });
        });
        
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-table-body').innerHTML = 
            '<tr><td colspan="5" class="error">Failed to load projects.</td></tr>';
    }
}

// Delete a project
async function deleteProject(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Project deleted successfully!');
            loadProjects();
            loadDashboardStats();
        } else {
            alert('Failed to delete project.');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Network error. Please check your connection and try again.');
    }
}

// Client Management
const addClientBtn = document.getElementById('add-client-btn');
const addClientForm = document.getElementById('add-client-form');
const cancelClientBtn = document.getElementById('cancel-client-btn');
const clientForm = document.getElementById('client-form');

// Show add client form
addClientBtn.addEventListener('click', () => {
    addClientForm.style.display = 'block';
    addClientBtn.style.display = 'none';
});

// Hide add client form
cancelClientBtn.addEventListener('click', () => {
    addClientForm.style.display = 'none';
    addClientBtn.style.display = 'flex';
    clientForm.reset();
});

// Handle client form submission
clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('client-name').value,
        designation: document.getElementById('client-designation').value,
        description: document.getElementById('client-description').value,
        image: document.getElementById('client-image').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Client added successfully!');
            clientForm.reset();
            addClientForm.style.display = 'none';
            addClientBtn.style.display = 'flex';
            loadClients();
            loadDashboardStats();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'Failed to add client'}`);
        }
    } catch (error) {
        console.error('Error adding client:', error);
        alert('Network error. Please check your connection and try again.');
    }
});

// Load clients for management
async function loadClients() {
    try {
        const response = await fetch(`${API_BASE_URL}/clients`);
        if (!response.ok) throw new Error('Failed to fetch clients');
        
        clients = await response.json();
        const tableBody = document.getElementById('clients-table-body');
        
        if (clients.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No clients found. Add your first client!</td></tr>';
            return;
        }
        
        tableBody.innerHTML = clients.map(client => `
            <tr>
                <td><img src="${client.image || 'https://via.placeholder.com/50'}" alt="${client.name}"></td>
                <td>${client.name}</td>
                <td>${client.designation}</td>
                <td>${client.description.length > 50 ? client.description.substring(0, 50) + '...' : client.description}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${client.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-delete" data-id="${client.id}"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                if (confirm('Are you sure you want to delete this client?')) {
                    await deleteClient(id);
                }
            });
        });
        
    } catch (error) {
        console.error('Error loading clients:', error);
        document.getElementById('clients-table-body').innerHTML = 
            '<tr><td colspan="5" class="error">Failed to load clients.</td></tr>';
    }
}

// Delete a client
async function deleteClient(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Client deleted successfully!');
            loadClients();
            loadDashboardStats();
        } else {
            alert('Failed to delete client.');
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        alert('Network error. Please check your connection and try again.');
    }
}

// Load contact form submissions
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE_URL}/contacts`);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        
        contacts = await response.json();
        const tableBody = document.getElementById('contacts-table-body');
        
        if (contacts.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No contact submissions yet.</td></tr>';
            return;
        }
        
        tableBody.innerHTML = contacts.map(contact => `
            <tr>
                <td>${contact.fullname}</td>
                <td>${contact.email}</td>
                <td>${contact.mobile}</td>
                <td>${contact.city}</td>
                <td>${new Date(contact.date || Date.now()).toLocaleDateString()}</td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading contacts:', error);
        document.getElementById('contacts-table-body').innerHTML = 
            '<tr><td colspan="5" class="error">Failed to load contacts.</td></tr>';
    }
}

// Load newsletter subscribers
async function loadSubscribers() {
    try {
        const response = await fetch(`${API_BASE_URL}/newsletter`);
        if (!response.ok) throw new Error('Failed to fetch subscribers');
        
        subscribers = await response.json();
        const tableBody = document.getElementById('subscribers-table-body');
        
        if (subscribers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="2">No subscribers yet.</td></tr>';
            return;
        }
        
        tableBody.innerHTML = subscribers.map(subscriber => `
            <tr>
                <td>${subscriber.email}</td>
                <td>${new Date(subscriber.date || Date.now()).toLocaleDateString()}</td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading subscribers:', error);
        document.getElementById('subscribers-table-body').innerHTML = 
            '<tr><td colspan="2" class="error">Failed to load subscribers.</td></tr>';
    }
}

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
});

// Initialize with some sample data if needed
function initializeSampleData() {
    // Check if we need to add sample data
    localStorage.setItem('flipr_sample_data', 'initialized');
}