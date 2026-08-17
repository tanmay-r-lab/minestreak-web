// Copy IP Function
function copyIP() {
    const ip = "play.minestreak.fun";
    navigator.clipboard.writeText(ip).then(() => {
        const ipText = document.getElementById("ip-text");
        if (!ipText) return;
        const originalText = ipText.innerText;
        ipText.innerText = "IP COPIED!";
        ipText.style.color = "#10b981";
        setTimeout(() => {
            ipText.innerText = originalText;
            ipText.style.color = "";
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Fetch Player Count
document.addEventListener("DOMContentLoaded", () => {
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
    const heroDiscordElement = document.getElementById("hero-discord-count");

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
                if (heroDiscordElement) {
                    heroDiscordElement.innerText = data.approximate_presence_count || data.approximate_member_count;
                }
            }
        } catch (error) {
            console.error("Error fetching Discord count:", error);
            if (discordCountElement) discordCountElement.innerText = "50+";
            if (heroDiscordElement) heroDiscordElement.innerText = "20+";
        }
    }
    fetchDiscordCount();
    setInterval(fetchDiscordCount, 15000);
});

// ==========================================
// SPA CATEGORY VIEW SWITCHER
// ==========================================
function switchView(viewName, clickedElement = null) {
    const allViews = document.querySelectorAll('.store-view');
    allViews.forEach(view => {
        view.style.display = 'none';
        view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.style.display = 'block';
        setTimeout(() => targetView.classList.add('active'), 10);
    }

    const welcomeBanner = document.querySelector('.welcome-banner');
    const storeLayout = document.querySelector('.store-layout');
    
    if (welcomeBanner && storeLayout) {
        if (viewName === 'home') {
            welcomeBanner.style.display = 'flex';
            storeLayout.classList.remove('full-width');
        } else {
            welcomeBanner.style.display = 'none';
            storeLayout.classList.add('full-width');
        }
    }

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
    const qrImage = document.getElementById('qr-image');
    
    if (titleElement) titleElement.innerText = productTitle;
    if (priceElement) priceElement.innerText = productPrice;
    
    if (qrImage && productPrice) {
        const amount = String(productPrice).replace(/\D/g, '');
        const upiString = `upi://pay?pa=ajiteshr@fampay&pn=MineStreak&cu=INR&am=${amount}`;
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=0f172a&bgcolor=ffffff&margin=10&data=${encodeURIComponent(upiString)}`;
    }
    
    if (modal) {
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
    const loginSubtitle = document.getElementById('login-subtitle');
    const loginTitle = document.getElementById('login-title');
    const loginAvatar = document.getElementById('login-avatar');
    
    const profileLoggedOut = document.getElementById('profile-logged-out');
    const profileLoggedIn = document.getElementById('profile-logged-in');
    const profileAvatarSide = document.getElementById('profile-avatar-side');
    const profileNameSide = document.getElementById('profile-name-side');
    
    if (username) {
        if (loginSubtitle) loginSubtitle.innerText = "Logged in as";
        if (loginTitle) loginTitle.innerText = username.toUpperCase();
        if (loginAvatar) {
            loginAvatar.src = `https://mc-heads.net/avatar/${username}/36`;
            loginAvatar.style.display = "block";
        }
        
        if (profileLoggedOut) profileLoggedOut.style.display = "none";
        if (profileLoggedIn) {
            profileLoggedIn.style.display = "flex";
            if (profileAvatarSide) profileAvatarSide.src = `https://mc-heads.net/body/${username}/80`;
            if (profileNameSide) profileNameSide.innerText = username;
        }
    } else {
        if (loginSubtitle) loginSubtitle.innerText = "Click to login";
        if (loginTitle) loginTitle.innerText = "NONE";
        if (loginAvatar) loginAvatar.style.display = "none";
        
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
    const basketCount = document.getElementById('basket-count');
    const basketTotal = document.getElementById('basket-total');
    
    if (!basketCount || !basketTotal) return;

    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        basketCount.innerText = `${cart.length} Item${cart.length > 1 ? 's' : ''}`;
        basketTotal.innerText = `₹${total}`;
    } else {
        basketCount.innerText = "0 Items";
        basketTotal.innerText = "BASKET";
    }
}

// ---- TOASTS ----
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span>${message}</span>`;
    
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
        checkoutUsername.innerText = username ? username : "Guest";
    }
    
    ['term1', 'term2', 'term3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = false;
    });
    validateCheckout();
    
    renderCart();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleCartModalClick(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) closeCartModal();
}

function validateCheckout() {
    const t1 = document.getElementById('term1');
    const t2 = document.getElementById('term2');
    const t3 = document.getElementById('term3');
    const btn = document.getElementById('final-checkout-btn');
    if (!btn || !t1 || !t2 || !t3) return;
    
    if (t1.checked && t2.checked && t3.checked && cart.length > 0) {
        btn.disabled = false;
        btn.style.background = 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)';
        btn.style.color = '#ffffff';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 6px 20px rgba(29, 78, 216, 0.35)';
    } else {
        btn.disabled = true;
        btn.style.background = 'rgba(2, 132, 199, 0.1)';
        btn.style.color = 'var(--text-muted)';
        btn.style.cursor = 'not-allowed';
        btn.style.boxShadow = 'none';
    }
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-display');
    if (!container || !totalDisplay) return;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart-msg">Your shopping basket is empty. Click any "BUY NOW" button to add items!</div>`;
        totalDisplay.innerText = '₹0';
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
            </div>
            <div class="cart-item-price">₹${item.price}</div>
            <button class="cart-remove-btn" onclick="removeFromCart(${index})" title="Remove item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;
        container.appendChild(div);
    });
    
    totalDisplay.innerText = `₹${total}`;
}

function proceedToPayment() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    closeCartModal();
    openCheckout("CART CHECKOUT", `₹${total}`);
}

// ---- LOGIN MODAL ----
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    const input = document.getElementById('username-input');
    if (username && input) input.value = username;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (input) setTimeout(() => input.focus(), 100);
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleLoginModalClick(event) {
    const modal = document.getElementById('login-modal');
    if (event.target === modal) closeLoginModal();
}

function submitLogin() {
    const input = document.getElementById('username-input');
    if (!input) return;
    const val = input.value.trim();
    if (val.length < 3) {
        alert("Please enter a valid Minecraft username.");
        return;
    }
    
    username = val;
    localStorage.setItem('ms_username', username);
    updateLoginUI();
    closeLoginModal();
    showToast(`Successfully logged in as ${username}!`);
}

// ---- FLOATING PARTICLES LOGIC ----
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    container.innerHTML = '';
    
    const particleCount = 22;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 12 + 6;
        const posX = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 8 + 8;
        const opacity = Math.random() * 0.45 + 0.15;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = opacity;
        
        container.appendChild(particle);
        
        particle.addEventListener('animationend', () => {
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 8 + 8}s`;
            particle.style.animation = 'none';
            particle.offsetHeight; 
            particle.style.animation = null; 
        });
    }
}
document.addEventListener("DOMContentLoaded", initParticles);