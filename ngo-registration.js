const districtOptions = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Kakinada", "Kurnool",
    "Nandyal", "Nellore", "Parvathipuram Manyam", "Prakasam", "Srikakulam",
    "Sri Potti Sriramulu Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari",
    "YSR Kadapa", "Alluri Sitarama Raju", "Anakapalli", "Annamayya", "Bapatla",
    "Sri Sathya Sai"
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

// Populate district options
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");

stateSelect.addEventListener("change", function () {
  const selectedState = this.value;
  const districts = districtOptions[selectedState] || [];

  districtSelect.innerHTML = '<option value="">Select District</option>';
  districts.forEach(district => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });
});

// Form submission handler
document.getElementById('ngoRegisterForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;

  const name = form.name.value.trim();
  const state = form.state.value;
  const district = form.district.value;
  const area = form.area.value.trim();
  const pincode = form.pincode.value.trim();
  const contact = form.contact.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const established = form.established.value;

  const location = `${area}, ${district}, ${state} - ${pincode}`;
  const startYear = established;

 const data = { name, location, contact, email, password, startYear, state, district };

  const responseMsg = document.getElementById('registerResponse');

  try {
    const res = await fetch('/api/ngo/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      responseMsg.textContent = `❌ ${result.message || 'Registration failed.'}`;
      responseMsg.style.color = 'red';
    } else {
      responseMsg.textContent = '✅ Registration successful! Redirecting to login...';
      responseMsg.style.color = 'green';
      form.reset();
      setTimeout(() => window.location.href = 'ngo-login.html', 1500);
    }
  } catch (err) {
    console.error(err);
    responseMsg.textContent = '❌ Server error. Please try again.';
    responseMsg.style.color = 'red';
  }
});
