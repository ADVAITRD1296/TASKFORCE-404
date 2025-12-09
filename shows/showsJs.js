document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const closeButtons = document.querySelectorAll('[data-close]');
  const openRegisterFromLogin = document.getElementById('openRegisterFromLogin');
  const openLoginFromRegister = document.getElementById('openLoginFromRegister');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  const userCountEl = document.getElementById('userCount');
  const loginStatusEl = document.getElementById('loginStatus');
  const loginMsg = document.getElementById('loginMsg');
  const registerMsg = document.getElementById('registerMsg');

  // LOAD, SAVE, CURRENT USER
  function loadUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('userCount', users.length.toString());
  }
  function setCurrentUser(email) {
    localStorage.setItem('currentUser', email || '');
  }
  function getCurrentUser() {
    return localStorage.getItem('currentUser') || '';
  }

  // If first time, initialize
  if (!localStorage.getItem('users')) {
    saveUsers([]);
  }

  // UPDATE UI
  function updateUserUI() {
    const users = loadUsers();
    const count = users.length;

    userCountEl.textContent = `Users: ${count}`;

    const currentUser = getCurrentUser();

    if (currentUser) {
      loginStatusEl.textContent = `Logged in as ${currentUser}`;
      loginStatusEl.classList.add('online');
    } else {
      loginStatusEl.textContent = 'Not logged in';
      loginStatusEl.classList.remove('online');
    }
  }

  // DROPDOWN NAV
  dropdownToggle?.addEventListener('click', () => {
    const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
    dropdownToggle.setAttribute('aria-expanded', String(!expanded));
    dropdownMenu.style.display = expanded ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      if (dropdownMenu) dropdownMenu.style.display = 'none';
      if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // MODAL FUNCTIONS
  function openModal(modal) {
    modal.setAttribute('aria-hidden', 'false');
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.querySelectorAll('.form-msg').forEach(el => el.textContent = '');
    modal.querySelectorAll('form').forEach(f => f.reset());
  }

  // OPEN & CLOSE MODALS
  loginBtn.addEventListener('click', () => openModal(loginModal));
  registerBtn.addEventListener('click', () => openModal(registerModal));

  closeButtons.forEach(btn =>
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      closeModal(modal);
    })
  );

  openRegisterFromLogin.addEventListener('click', () => {
    closeModal(loginModal);
    openModal(registerModal);
  });

  openLoginFromRegister.addEventListener('click', () => {
    closeModal(registerModal);
    openModal(loginModal);
  });

  // LOGIN FORM SUBMIT
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginMsg.textContent = '';

    const form = new FormData(loginForm);
    const email = form.get('email').toString().trim().toLowerCase();
    const password = form.get('password').toString();

    const users = loadUsers();
    const found = users.find(u => u.email === email && u.password === password);

    if (found) {
      setCurrentUser(email);
      updateUserUI();
      loginMsg.style.color = 'green';
      loginMsg.textContent = 'Login successful!';
      setTimeout(() => closeModal(loginModal), 700);
    } else {
      loginMsg.style.color = 'red';
      loginMsg.textContent = 'Invalid email or password.';
    }
  });

  // REGISTER FORM SUBMIT
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    registerMsg.textContent = '';

    const form = new FormData(registerForm);
    const fullname = form.get('fullname').toString().trim();
    const email = form.get('email').toString().trim().toLowerCase();
    const password = form.get('password').toString();
    const confirmPassword = form.get('confirmPassword').toString();
    const phone = form.get('phone').toString();
    const dob = form.get('dob').toString();
    const address = form.get('address').toString();

    if (password !== confirmPassword) {
      registerMsg.style.color = 'red';
      registerMsg.textContent = 'Passwords do not match.';
      return;
    }

    if (password.length < 6) {
      registerMsg.style.color = 'red';
      registerMsg.textContent = 'Password must be at least 6 characters.';
      return;
    }

    const users = loadUsers();

    if (users.some(u => u.email === email)) {
      registerMsg.style.color = 'red';
      registerMsg.textContent = 'Email already registered.';
      return;
    }

    const newUser = {
      fullname, email, password, phone, dob, address,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(email);
    updateUserUI();

    registerMsg.style.color = 'green';
    registerMsg.textContent = 'Account created and logged in!';

    setTimeout(() => closeModal(registerModal), 900);
  });

  // CLICK LOGIN STATUS (toggle logout)
  loginStatusEl.addEventListener('click', () => {
    const current = getCurrentUser();
    if (current) {
      setCurrentUser('');
      updateUserUI();
      alert('Logged out.');
    } else {
      openModal(loginModal);
    }
  });

  updateUserUI();
});

// MOVIE API HANDLING
const url = "https://api.tvmaze.com/shows";

async function loadShows() {
    let response = await fetch(url);
    let data = await response.json();

    let container = document.getElementById("movies");

    data.slice(0, 40).forEach(show => {
        let div = document.createElement("div");
        div.classList.add("movie");

        div.innerHTML = `
            <img src="${show.image ? show.image.medium : ''}" alt="${show.name}">
            <hr>
            <h3>${show.name}</h3>
            <hr>
            <h4>rating : ${show.rating.average}</h4>
        `;

        div.addEventListener("click", () => {
            
            document.getElementById("popupTitle").innerText = show.name;
            document.getElementById("popupSummary").innerHTML = `<hr><img src="${show.image ? show.image.medium : ''}" alt="${show.name}" ><hr>${show.summary}`;
            document.getElementById("popup2").style.display = "flex";
        });

        container.appendChild(div);
    });
}

document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("popup2").style.display = "none";
});

loadShows();

// Ticket Popup
const ticketOverlay = document.getElementById("ticketOverlay");
const ticketPopup = document.getElementById("ticketPopup");
const closeTicketPopup = document.getElementById("closeTicketPopup");

document.querySelector(".booknow").addEventListener("click", () => {
    ticketOverlay.style.display = "flex";
});

closeTicketPopup.addEventListener("click", () => {
    ticketOverlay.style.display = "none";
});

ticketOverlay.addEventListener("click", (e) => {
    if (e.target === ticketOverlay) {
        ticketOverlay.style.display = "none";
    }
});

// PRICE CALCULATION
document.getElementById("calcBtn").addEventListener("click", function () {
    let price = Number(document.getElementById("moviepop").value);
    let count = Number(document.getElementById("tickets").value);
    let show = document.getElementById("showtime").value;

    if (count <= 0) {
        document.getElementById("result").innerText =
            "Please enter a valid number of tickets.";
        return;
    }

    let total = price * count;

    document.getElementById("result").innerHTML =
        "Show Time: " + show + "<br>" +
        "Total Price: ₹" + total;
});

// ADD ROW TO TABLE
document.getElementById("calcBtn").addEventListener("click", function () {
    let movie = document.getElementById("moviepop");
    let movieText = movie.options[movie.selectedIndex].text;
    let tickets = document.getElementById("tickets").value;
    let showtime = document.getElementById("showtime").value;

    if (tickets === "") {
        alert("Please fill all fields!");
        return;
    }

    let table = document.getElementById("bookingTable").querySelector("tbody");

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${movieText}</td>
        <td>${tickets}</td>
        <td>${showtime}</td>
    `;

    table.appendChild(row);

    document.getElementById("tickets").value = "";
});

// SCROLL FUNCTION
function scrollToSection() {
    document.getElementById("bookingSection").scrollIntoView({ behavior: "smooth" });
}