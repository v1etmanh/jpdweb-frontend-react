window.addEventListener('DOMContentLoaded', () => {
    const hasAcceptedPolicy = localStorage.getItem('policyAccepted');
    if (!hasAcceptedPolicy) {
        document.getElementById('policyOverlay').style.display = 'flex';
    }
});

function showModal() {
    document.getElementById('policyOverlay').style.display = 'flex';
}

function hideModal() {
    document.getElementById('policyOverlay').style.display = 'none';
}

function acceptPolicy() {
    localStorage.setItem('policyAccepted', 'true');
    hideModal();
}

function declinePolicy() {
    hideModal();
}
