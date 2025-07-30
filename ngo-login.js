document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/ngo/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Save token and ngoName in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('ngoName', data.ngoName);

      alert("Login successful!");
      window.location.href = "ngo-dashboard.html";
    } else {
      alert(data.message || "Invalid email or password. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login. Please try again.");
  }
});
