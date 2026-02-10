// Authentication Logic (Global Scope for "file://" compatibility)

function registerUser(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function loginUser(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

function loginWithGoogle() {
    // Check if running on file:// protocol
    if (window.location.protocol === 'file:') {
        return Promise.reject(new Error("Google Login requires a web server (http://localhost). It does not work on file:// protocol. Please use 'Live Server' or similar."));
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
}

function logoutUser() {
    return firebase.auth().signOut();
}

function initAuthGuard(options = {}) {
    // Legacy support: if options is boolean, treat as redirectIfLoggedOut
    const redirectIfLoggedOut = typeof options === 'boolean' ? options : (options.redirectIfLoggedOut || false);
    const redirectIfLoggedIn = (typeof options === 'object' && options.redirectIfLoggedIn !== undefined) ? options.redirectIfLoggedIn : true;

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("User is signed in:", user.email);
            // If we are on login or register page, go to dashboard
            if (redirectIfLoggedIn) {
                if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
                    window.location.href = 'dashboard.html';
                }
            }

            // Update UI in various pages

            // 1. Landing Page Navigation Button
            const navBtn = document.getElementById('nav-login-btn');
            const heroBtn = document.getElementById('hero-cta-btn');

            if (navBtn) {
                navBtn.href = "dashboard.html";
                navBtn.innerText = "Dashboard";
            }
            if (heroBtn) heroBtn.href = "dashboard.html";

            // 2. Dashboard User Action Button
            const userActionBtn = document.querySelector('.user-action');
            if (userActionBtn) {
                userActionBtn.innerHTML = '🚪'; // Logout icon
                userActionBtn.onclick = async () => {
                    try {
                        await logoutUser();
                        window.location.href = 'index.html';
                    } catch (error) {
                        console.error("Logout failed", error);
                    }
                };
            }

            // 3. Dashboard Welcome Message
            const pageHeaderUser = document.querySelector('.page-title p');
            if (pageHeaderUser) {
                const name = user.displayName || user.email.split('@')[0];
                pageHeaderUser.innerText = `Welcome back, ${name}`;

                // If profile pic exists, update user action button
                if (user.photoURL) {
                    const userActionBtn = document.querySelector('.user-action');
                    if (userActionBtn) {
                        userActionBtn.innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                    }
                }
            }

        } else {
            console.log("User is signed out");

            // 1. Handle Dashboard protection
            if (redirectIfLoggedOut && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html') && !window.location.pathname.includes('index.html')) {
                window.location.href = 'login.html';
            }

            // 2. Update Landing Page UI for logged out user
            const navBtn = document.getElementById('nav-login-btn');
            const heroBtn = document.getElementById('hero-cta-btn');

            if (navBtn) {
                navBtn.href = "login.html";
                navBtn.innerText = "Log in";
            }
            if (heroBtn) heroBtn.href = "login.html";
        }
    });
}
