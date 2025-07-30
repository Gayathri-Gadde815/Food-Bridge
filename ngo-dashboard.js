const ngoName = localStorage.getItem('ngoName');
document.getElementById('ngoName').textContent = ngoName || 'NGO';

const token = localStorage.getItem('token');

async function loadDonations() {
  try {
    const res = await fetch('/api/donations', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Unauthorized or server error');
    }

    const donations = await res.json();
    const list = document.getElementById('donationList');
    list.innerHTML = '';

    if (donations.length === 0) {
      list.innerHTML = '<p class="text-muted">No donations available right now.</p>';
      return;
    }

    donations.forEach(d => {
      const item = document.createElement('div');
      item.classList.add('list-group-item', 'mb-2');
      item.innerHTML = `
        <strong>Item:</strong> ${d.name} <br>
        <strong>Quantity:</strong> ${d.quantity} <br>
        <strong>Location:</strong> ${d.district}, ${d.state} <br>
        <strong>Expiry:</strong> ${new Date(d.expiry).toLocaleString()} <br>
        <strong>Contact:</strong> ${d.contact}
      `;
      list.appendChild(item);
    });

  } catch (err) {
    console.error('Error fetching donations:', err);
    alert('Failed to fetch donations. Please try logging in again.');
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "ngo-login.html";
}

loadDonations();
