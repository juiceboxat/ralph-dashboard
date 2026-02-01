// Ralph Dashboard - App Logic

const REFRESH_INTERVAL = 60000; // 60 seconds
let refreshTimer = null;

// DOM Elements
const activeGrid = document.getElementById('active-grid');
const completedGrid = document.getElementById('completed-grid');
const lastUpdatedEl = document.getElementById('last-updated');
const autoRefreshCheckbox = document.getElementById('auto-refresh');

// Fetch and render projects
async function loadProjects() {
    try {
        const response = await fetch('projects.json?' + Date.now());
        const data = await response.json();
        
        renderProjects(data.projects);
        updateLastUpdated(data.lastUpdated);
    } catch (error) {
        console.error('Failed to load projects:', error);
        showError();
    }
}

// Render projects to grid
function renderProjects(projects) {
    const active = projects.filter(p => p.status === 'active' || p.status === 'stuck');
    const completed = projects.filter(p => p.status === 'completed');
    
    activeGrid.innerHTML = active.length > 0 
        ? active.map(renderCard).join('')
        : '<div class="empty-state">No active projects</div>';
    
    completedGrid.innerHTML = completed.length > 0
        ? completed.map(renderCard).join('')
        : '<div class="empty-state">No completed projects yet</div>';
}

// Render single project card
function renderCard(project) {
    const progress = Math.round((project.currentTask / project.totalTasks) * 100);
    const isComplete = project.status === 'completed';
    
    return `
        <div class="project-card">
            <div class="project-header">
                <span class="project-name">${project.name}</span>
                <span class="status-badge status-${project.status}">${project.status}</span>
            </div>
            <p class="project-description">${project.description || ''}</p>
            <div class="progress-container">
                <div class="progress-label">
                    <span class="progress-text">Progress</span>
                    <span class="progress-count">${project.currentTask}/${project.totalTasks} tasks</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${isComplete ? 'complete' : ''}" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="project-meta">
                <span>Started: ${formatDate(project.startedAt)}</span>
                <span>${isComplete ? 'Completed: ' + formatDate(project.completedAt) : 'Updated: ' + formatDate(project.updatedAt)}</span>
            </div>
        </div>
    `;
}

// Format date for display
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update last updated timestamp
function updateLastUpdated(timestamp) {
    lastUpdatedEl.textContent = formatDate(timestamp || new Date().toISOString());
}

// Show error state
function showError() {
    activeGrid.innerHTML = '<div class="empty-state">⚠️ Failed to load projects</div>';
    completedGrid.innerHTML = '';
}

// Auto-refresh logic
function startAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(loadProjects, REFRESH_INTERVAL);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// Event listeners
autoRefreshCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
});

// Initial load
loadProjects();
if (autoRefreshCheckbox.checked) {
    startAutoRefresh();
}
