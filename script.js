// ==========================================
// MINESTREAK STORE ENGINE & UTILITIES
// ==========================================

// Copy IP Function
function copyIP() {
    const ip = "play.minestreak.fun";
    navigator.clipboard.writeText(ip).then(() => {
        const headerSub = document.getElementById("header-ip-sub");
        const ipText = document.getElementById("ip-text");
        
        if (headerSub) {
            const originalText = headerSub.innerText;
            headerSub.innerText = "IP COPIED! (play.minestreak.fun)";
            headerSub.style.color = "#4ade80";
            setTimeout(() => {
                headerSub.innerText = originalText;
                headerSub.style.color = "";
            }, 2500);
        }
        
        if (ipText) {
            const originalText = ipText.innerText;
            ipText.innerText = "IP COPIED!";
            ipText.style.color = "#4ade80";
            setTimeout(() => {
                ipText.innerText = originalText;
                ipText.style.color = "";
            }, 2000);
        }
        
        showToast("Server IP copied: play.minestreak.fun");
    }).catch(err => {
        console.error('Failed to copy IP: ', err);
    });
}

// Live Countdown Timer (Sale Announcement)
function initCountdown() {
    // 13 Days, 19 Hours, 59 Mins fixed target countdown from load
    let targetTime = localStorage.getItem('ms_sale_target');
    if (!targetTime) {
        targetTime = new Date().getTime() + (13 * 24 * 60 * 60 * 1000) + (19 * 60 * 60 * 1000) + (59 * 60 * 1000) + (59 * 1000);
        localStorage.setItem('ms_sale_target', targetTime);
    } else {
        targetTime = parseInt(targetTime);
    }
    
    function tick() {
        const now = new Date().getTime();
        const diff = Math.max(0, targetTime - now);
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-minutes');
        const sEl = document.getElementById('cd-seconds');
        
        if (dEl) dEl.innerText = days < 10 ? '0' + days : days;
        if (hEl) hEl.innerText = hours < 10 ? '0' + hours : hours;
        if (mEl) mEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (sEl) sEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }
    
    tick();
    setInterval(tick, 1000);
}

// Fetch Player Count
document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    
    const playerCountElement = document.getElementById("player-count");
    const playerDot = document.getElementById("player-dot");
    
    async function fetchPlayerCount() {
        if (!playerCountElement) return;
        try {
            const response = await fetch("https://api.mcsrvstat.us/2/play.minestreak.fun");
            const data = await response.json();
            
            if (data.online) {
                playerCountElement.innerText = data.players.online;
                if (playerDot) {
                    playerDot.style.backgroundColor = "#10b981";
                    playerDot.style.boxShadow = "0 0 10px rgba(16, 185, 129, 0.6)";
                }
            } else {
                playerCountElement.innerText = "0";
                if (playerDot) {
                    playerDot.style.backgroundColor = "#ef4444";
                    playerDot.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.6)";
                }
            }
        } catch (error) {
            console.error("Error fetching player count:", error);
            if (playerCountElement) playerCountElement.innerText = "0";
        }
    }
    fetchPlayerCount();
    setInterval(fetchPlayerCount, 10000);
});

// Fetch Discord Member Count
document.addEventListener("DOMContentLoaded", () => {
    const discordCountElement = document.getElementById("discord-count");
    const discordDot = document.getElementById("discord-dot");

    async function fetchDiscordCount() {
        try {
            const inviteCode = "jcXgZEC8Qb";
            const response = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`);
            const data = await response.json();
            
            if (data.approximate_member_count) {
                if (discordCountElement) discordCountElement.innerText = data.approximate_member_count;
                if (discordDot) {
                    discordDot.style.backgroundColor = "#10b981";
                    discordDot.style.boxShadow = "0 0 10px rgba(16, 185, 129, 0.6)";
                }
            }
        } catch (error) {
            console.error("Error fetching Discord count:", error);
        }
    }
    fetchDiscordCount();
    setInterval(fetchDiscordCount, 15000);
});

// Floating Particle System
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        const duration = Math.random() * 4 + 4;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    setInterval(createParticle, 350);
});

// Category Switcher
function switchView(viewName, clickedLink) {
    const views = document.querySelectorAll('.store-view');
    views.forEach(v => v.style.display = 'none');

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.style.display = 'block';
    }

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));

    if (clickedLink) {
        clickedLink.classList.add('active');
    } else {
        const activeNav = document.getElementById(`nav-${viewName}`);
        if (activeNav) activeNav.classList.add('active');
    }
    
    window.scrollTo({
        top: 280,
        behavior: 'smooth'
    });
}

// FamPay / UPI Modal Logic
function openCheckout(title, price) {
    const modal = document.getElementById('checkout-modal');
    const modalTitle = document.getElementById('modal-product-title');
    const modalPrice = document.getElementById('modal-product-price');
    const qrImage = document.getElementById('qr-image');

    if (modal && modalTitle && modalPrice) {
        modalTitle.innerText = title;
        modalPrice.innerText = `₹${price}`;
        
        if (qrImage) {
            qrImage.src = 'fampay_qr.png';
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleModalClick(event) {
    const modal = document.getElementById('checkout-modal');
    if (event.target === modal) {
        closeCheckout();
    }
}

function copyUPI(buttonElement) {
    const upiID = document.getElementById("upi-id-text") ? document.getElementById("upi-id-text").innerText : "ajiteshr@fampay";
    
    navigator.clipboard.writeText(upiID).then(() => {
        const originalText = buttonElement.innerText;
        buttonElement.innerText = "COPIED!";
        buttonElement.style.backgroundColor = "#10b981";
        
        setTimeout(() => {
            buttonElement.innerText = originalText;
            buttonElement.style.backgroundColor = "";
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy UPI: ', err);
    });
}

// ==========================================
// STORE ENGINE (CART & LOGIN)
// ==========================================

let cart = JSON.parse(localStorage.getItem('ms_cart')) || [];
let username = localStorage.getItem('ms_username') || null;

document.addEventListener("DOMContentLoaded", () => {
    updateLoginUI();
    updateBasketUI();
});

function updateLoginUI() {
    const headerLoginLabel = document.getElementById('header-login-label');
    const profileLoggedOut = document.getElementById('profile-logged-out');
    const profileLoggedIn = document.getElementById('profile-logged-in');
    const profileAvatarSide = document.getElementById('profile-avatar-side');
    const profileNameSide = document.getElementById('profile-name-side');
    
    if (username) {
        if (headerLoginLabel) headerLoginLabel.innerText = username;
        if (profileLoggedOut) profileLoggedOut.style.display = "none";
        if (profileLoggedIn) {
            profileLoggedIn.style.display = "flex";
            if (profileAvatarSide) profileAvatarSide.src = `https://mc-heads.net/body/${username}/80`;
            if (profileNameSide) profileNameSide.innerText = username;
        }
    } else {
        if (headerLoginLabel) headerLoginLabel.innerText = "Login";
        if (profileLoggedIn) profileLoggedIn.style.display = "none";
        if (profileLoggedOut) profileLoggedOut.style.display = "flex";
    }
}

function logout() {
    username = null;
    localStorage.removeItem('ms_username');
    updateLoginUI();
    showToast("Successfully logged out.");
}

function updateBasketUI() {
    const headerCartCount = document.getElementById('header-cart-count');
    if (headerCartCount) {
        headerCartCount.innerText = cart.length;
    }
}

// ---- TOASTS ----
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ---- CART LOGIC ----
function addToCart(title, price) {
    if (!username) {
        openLoginModal();
        return;
    }
    
    cart.push({ title, price: parseInt(price) });
    localStorage.setItem('ms_cart', JSON.stringify(cart));
    updateBasketUI();
    showToast(`Added ${title} to basket!`);
    
    openCartModal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('ms_cart', JSON.stringify(cart));
    updateBasketUI();
    renderCart();
}

// ---- CART MODAL ----
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    const checkoutUsername = document.getElementById('checkout-username-display');
    if (checkoutUsername) {
        checkoutUsername.innerText = username ? username : "Guest (Not Logged In)";
    }
    
    renderCart();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleCartModalClick(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCartModal();
    }
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-display');
    const checkoutBtn = document.getElementById('final-checkout-btn');
    
    if (!container) return;
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart-msg">Your shopping basket is empty.</div>';
        if (totalDisplay) totalDisplay.innerText = '₹0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.title}</span>
                <span class="cart-item-price">₹${item.price}</span>
            </div>
            <button class="cart-remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        container.appendChild(row);
    });
    
    if (totalDisplay) totalDisplay.innerText = `₹${total}`;
    validateCheckout();
}

function validateCheckout() {
    const term1 = document.getElementById('term1');
    const term2 = document.getElementById('term2');
    const term3 = document.getElementById('term3');
    const checkoutBtn = document.getElementById('final-checkout-btn');
    
    if (!checkoutBtn) return;
    
    if (cart.length > 0 && username && term1 && term1.checked && term2 && term2.checked && term3 && term3.checked) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
    } else {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
    }
}

function proceedToPayment() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemNames = cart.map(i => i.title).join(', ');
    
    closeCartModal();
    openCheckout(`Cart Order (${cart.length} items)`, total);
}

// ---- LOGIN MODAL ----
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        const input = document.getElementById('username-input');
        if (input) {
            input.value = username || '';
            setTimeout(() => input.focus(), 100);
        }
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleLoginModalClick(event) {
    const modal = document.getElementById('login-modal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

function submitLogin() {
    const input = document.getElementById('username-input');
    if (!input) return;
    
    const val = input.value.trim();
    if (val.length < 3) {
        showToast("Please enter a valid Minecraft username (min 3 chars).");
        return;
    }
    
    username = val;
    localStorage.setItem('ms_username', username);
    updateLoginUI();
    closeLoginModal();
    showToast(`Logged in as ${username}!`);
}