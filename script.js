const districtsByState = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Kakinada", "Kurnool",
    "Nandyal", "Nellore", "Parvathipuram Manyam", "Prakasam", "Srikakulam",
    "Sri Potti Sriramulu Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari",
    "YSR Kadapa", "Alluri Sitarama Raju", "Anakapalli", "Annamayya", "Bapatla",
    "Kakinada", "Nandyal", "Nellore", "Sri Sathya Sai"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagitial", "Jangaon", "Jayashankar Bhupalpally",
    "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Mahabubabad", "Mahbubnagar",
    "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy",
    "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural",
    "Warangal Urban", "Yadadri Bhuvanagiri"
  ]
};

const stateSelect = document.getElementById('stateSelect');
const districtSelect = document.getElementById('districtSelect');
const responseMsg = document.getElementById('responseMsg');

// Populate districts when state changes
stateSelect.addEventListener('change', () => {
  districtSelect.innerHTML = '<option value="">Select District</option>';
  const selectedState = stateSelect.value;

  if (!selectedState) {
    districtSelect.disabled = true;
    return;
  }

  districtsByState[selectedState].forEach(district => {
    const option = document.createElement('option');
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });

  districtSelect.disabled = false;
});

// Handle form submission
document.getElementById('donationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

  const data = {
    name: form.name.value.trim(),
    quantity: form.quantity.value.trim(),
    state: form.state.value,
    district: form.district.value,
    expiry: form.expiry.value,
    contact: form.contact.value.trim()
  };

  // Validate contact number format
  const contactPattern = /^[6-9]\d{9}$/;
  if (!contactPattern.test(data.contact)) {
    responseMsg.innerText = "❌ Please enter a valid 10-digit contact number.";
    responseMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch('/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      // If status not ok, show error message from backend
      const error = await res.json();
      responseMsg.innerText = `❌ ${error.message || 'Failed to submit donation.'}`;
      responseMsg.style.color = "red";
      return;
    }

    // Success message
    responseMsg.innerText = "✅ Thank you for donating!";
    responseMsg.style.color = "green";

    setTimeout(() => {
      responseMsg.innerText = "✅ Submission has been successfully completed.";
    }, 2000);

    form.reset();
    districtSelect.disabled = true;
  } catch (error) {
    console.error('Error:', error);
    responseMsg.innerText = "❌ Failed to submit donation. Please try again.";
    responseMsg.style.color = "red";
  }
});

// Disable district dropdown on page load
districtSelect.disabled = true;
