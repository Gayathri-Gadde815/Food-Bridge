document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("ngoListContainer");

  try {
    const res = await fetch("/api/ngos");
    const ngos = await res.json();

    if (ngos.length === 0) {
      container.innerHTML = "<p>No NGOs registered yet.</p>";
      return;
    }document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("ngoListContainer");

  try {
    const res = await fetch("/api/ngos");
    const ngos = await res.json();

    if (!Array.isArray(ngos) || ngos.length === 0) {
      container.innerHTML = "<p>No NGOs registered yet.</p>";
      return;
    }

    ngos.forEach((ngo) => {
      const card = document.createElement("div");
      card.classList.add("ngo-card");

      card.innerHTML = `
        <h4>🏢 ${ngo.name}</h4>
        <p>📞 <strong>Contact:</strong> ${ngo.contact}</p>
        <p>📧 <strong>Email:</strong> ${ngo.email}</p>
        <p>📍 <strong>Location:</strong> ${ngo.location || 'Not specified'}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading NGOs:", err);
    container.innerHTML = "<p>❌ Failed to load NGOs. Try again later.</p>";
  }
});


    ngos.forEach((ngo) => {
      const card = document.createElement("div");
      card.classList.add("ngo-card");

      card.innerHTML = `
        <h4>${ngo.name}</h4>
        <p><strong>Contact:</strong> ${ngo.contact}</p>
        <p><strong>Email:</strong> ${ngo.email}</p>
        <p><strong>Location:</strong> ${ngo.location}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading NGOs:", err);
    container.innerHTML = "<p>Failed to load NGOs.</p>";
  }
});
