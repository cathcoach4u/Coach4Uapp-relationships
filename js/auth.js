// ============================================
// Coach4U — Access Code Authentication
// ============================================

const SESSION_KEY = 'coach4u_access';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Verify an access code against Supabase.
 * Returns true if the code is valid.
 */
async function verifyAccessCode(code) {
  const { data, error } = await supabase.rpc('verify_access_code', {
    input_code: code,
  });

  if (error) {
    console.error('Verification error:', error.message);
    return false;
  }

  return data === true;
}

/**
 * Store a valid session in sessionStorage.
 */
function grantAccess() {
  const session = {
    granted: true,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Check if the current session is valid.
 * Returns true if access was granted and hasn't expired.
 */
function hasAccess() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return false;

  try {
    const session = JSON.parse(raw);
    if (!session.granted) return false;
    if (Date.now() - session.timestamp > SESSION_DURATION_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Guard a protected page. Redirects to login if no valid session.
 * Call this at the top of any protected page.
 */
function requireAccess() {
  if (!hasAccess()) {
    window.location.href = 'index.html';
  }
}

/**
 * Clear the session and redirect to login.
 */
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

/**
 * Initialize the login form handler.
 * Call this on the login page (index.html).
 */
function initLoginForm() {
  const form = document.getElementById('login-form');
  const input = document.getElementById('access-code');
  const errorEl = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = input.value.trim();

    if (!code) {
      errorEl.textContent = 'Please enter an access code.';
      errorEl.classList.add('visible');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';
    errorEl.classList.remove('visible');

    const valid = await verifyAccessCode(code);

    if (valid) {
      grantAccess();
      window.location.href = 'portal.html';
    } else {
      errorEl.textContent = 'Invalid access code. Please try again.';
      errorEl.classList.add('visible');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Access Resources';
      input.value = '';
      input.focus();
    }
  });
}
