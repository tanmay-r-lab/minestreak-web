// Function to copy IP to clipboard
function copyIP() {
    const ip = "play.MineStreak.fun";
    const ipTextElement = document.getElementById("ip-text");
    
    // Copy to clipboard
    navigator.clipboard.writeText(ip).then(() => {
        // Visual feedback
        const originalText = ipTextElement.innerText;
        ipTextElement.innerText = "COPIED TO CLIPBOARD!";
        ipTextElement.style.color = "var(--color-secondary)";
        
        // Reset after 2 seconds
        setTimeout(() => {
            ipTextElement.innerText = originalText;
            ipTextElement.style.color = "var(--text-main)";
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Add simple hover effect to product cards (tilt effect can be added here if desired)
document.addEventListener('DOMContentLoaded', () => {
    // Live Player Count fetching logic
    const serverIP = "play.MineStreak.fun"; // Set your server IP here
    const countElement = document.getElementById("player-count");
    const statusDot = document.getElementById("player-dot");

    async function fetchPlayerCount() {
        try {
            const response = await fetch(`https://api.mcsrvstat.us/2/${serverIP}`);
            const data = await response.json();
            
            if (data.online) {
                // Animate the counter or just set it
                countElement.innerText = data.players.online;
                statusDot.style.backgroundColor = "#4CAF50"; // Green
                statusDot.style.boxShadow = "0 0 10px rgba(76, 175, 80, 0.6)";
            } else {
                countElement.innerText = "0";
                statusDot.style.backgroundColor = "#f44336"; // Red
                statusDot.style.boxShadow = "0 0 10px rgba(244, 67, 54, 0.6)";
            }
        } catch (error) {
            console.error("Error fetching player count:", error);
            countElement.innerText = "?";
            statusDot.style.backgroundColor = "#ff9800"; // Orange
        }
    }

    // Fetch immediately on load
    fetchPlayerCount();
    setInterval(fetchPlayerCount, 30000);

    // Discord Member Count fetching logic
    const discordInvite = "jcXgZEC8Qb"; // From the invite link
    const discordCountElement = document.getElementById("discord-count");
    const discordDot = document.getElementById("discord-dot");

    async function fetchDiscordCount() {
        try {
            const response = await fetch(`https://discord.com/api/v9/invites/${discordInvite}?with_counts=true`);
            const data = await response.json();
            
            if (data.approximate_member_count) {
                discordCountElement.innerText = data.approximate_member_count;
                discordDot.style.backgroundColor = "#4CAF50"; // Green
                discordDot.style.boxShadow = "0 0 10px rgba(76, 175, 80, 0.6)";

                const heroDiscordElement = document.getElementById("hero-discord-count");
                if (heroDiscordElement) {
                    heroDiscordElement.innerText = data.approximate_presence_count || data.approximate_member_count;
                }
            }
        } catch (error) {
            console.error("Error fetching Discord count:", error);
            discordCountElement.innerText = "?";
        }
    }

    fetchDiscordCount();
    setInterval(fetchDiscordCount, 60000);
});

// ==========================================
// SPA CATEGORY VIEW SWITCHER
// ==========================================
function switchView(viewName, clickedElement = null) {
    // Hide all views
    const allViews = document.querySelectorAll('.store-view');
    allViews.forEach(view => {
        view.style.display = 'none';
        view.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.style.display = 'block';
        setTimeout(() => targetView.classList.add('active'), 10);
    }

    // Update active navbar link
    const allNavLinks = document.querySelectorAll('.nav-links a');
    allNavLinks.forEach(link => link.classList.remove('active'));

    if (clickedElement) {
        clickedElement.classList.add('active');
    } else {
        const matchingNavLink = document.getElementById(`nav-${viewName}`);
        if (matchingNavLink) {
            matchingNavLink.classList.add('active');
        }
    }

    // Smooth scroll to top of store section if scrolled way down
    const storeSection = document.querySelector('.store-layout');
    if (storeSection && window.scrollY > storeSection.offsetTop) {
        storeSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// CHECKOUT MODAL & UPI PAYMENT LOGIC
// ==========================================
function openCheckout(productTitle, productPrice) {
    const modal = document.getElementById('checkout-modal');
    const titleElement = document.getElementById('modal-product-title');
    const priceElement = document.getElementById('modal-product-price');

    if (titleElement) titleElement.innerText = productTitle;
    if (priceElement) priceElement.innerText = productPrice;

    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

function handleModalClick(event) {
    const modal = document.getElementById('checkout-modal');
    if (event.target === modal) {
        closeCheckout();
    }
}

// Copy UPI ID to clipboard with visual confirmation
function copyUPI(buttonElement) {
    const upiID = document.getElementById("upi-id-text") ? document.getElementById("upi-id-text").innerText : "minestreak@fampay";
    
    navigator.clipboard.writeText(upiID).then(() => {
        const originalText = buttonElement.innerText;
        const originalBg = buttonElement.style.backgroundColor;
        
        buttonElement.innerText = "COPIED!";
        buttonElement.style.backgroundColor = "#4CAF50";
        
        setTimeout(() => {
            buttonElement.innerText = originalText;
            buttonElement.style.backgroundColor = originalBg;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy UPI: ', err);
    });
}

