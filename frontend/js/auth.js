const API = window.location.origin + '/api';

function showError(msg) {
  const el = document.getElementById('authError');
  el.textContent = msg;
  el.classList.add('show');
}

function hideError() {
  const el = document.getElementById('authError');
  el.classList.remove('show');
}

// Redirect if already logged in
if (localStorage.getItem('ps_token')) {
  window.location.href = 'dashboard.html';
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    const btn = document.getElementById('loginBtn');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (!username || !password) { showError('Please fill in all fields.'); return; }
    btn.disabled = true; btn.textContent = 'Logging in...';
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) { showError(data.message); btn.disabled = false; btn.textContent = 'Log In'; return; }
      localStorage.setItem('ps_token', data.token);
      localStorage.setItem('ps_user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } catch { showError('Network error. Please try again.'); btn.disabled = false; btn.textContent = 'Log In'; }
  });
}

// Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    const btn = document.getElementById('signupBtn');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (!username || !password || !confirm) { showError('Please fill in all fields.'); return; }
    if (username.length < 3) { showError('Username must be at least 3 characters.'); return; }
    if (password.length < 6) { showError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { showError('Passwords do not match.'); return; }
    btn.disabled = true; btn.textContent = 'Creating account...';
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) { showError(data.message); btn.disabled = false; btn.textContent = 'Create Account'; return; }
      localStorage.setItem('ps_token', data.token);
      localStorage.setItem('ps_user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } catch { showError('Network error. Please try again.'); btn.disabled = false; btn.textContent = 'Create Account'; }
  });
}
