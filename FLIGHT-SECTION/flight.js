document.addEventListener("DOMContentLoaded", () => {

    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    dropdownToggle.addEventListener("click", () => {
        dropdownMenu.style.display =
            dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-dropdown")) {
            dropdownMenu.style.display = "none";
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    const closeButtons = document.querySelectorAll("[data-close]");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginMsg = document.getElementById("loginMsg");
    const registerMsg = document.getElementById("registerMsg");

    const openRegisterFromLogin = document.getElementById("openRegisterFromLogin");
    const openLoginFromRegister = document.getElementById("openLoginFromRegister");

    const userCountEl = document.getElementById("userCount");
    const loginStatusEl = document.getElementById("loginStatus");


  
    function loadUsers() {
        return JSON.parse(localStorage.getItem("users") || "[]");
    }

    function saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("userCount", users.length);
    }

    function setCurrentUser(email) {
        localStorage.setItem("currentUser", email || "");
    }

    function getCurrentUser() {
        return localStorage.getItem("currentUser") || "";
    }


    
    function updateUserUI() {
        const users = loadUsers();
        userCountEl.textContent = `Users: ${users.length}`;

        const user = getCurrentUser();
        if (user) {
            loginStatusEl.textContent = `Logged in as ${user}`;
            loginStatusEl.style.color = "lightgreen";
        } else {
            loginStatusEl.textContent = "Not logged in";
            loginStatusEl.style.color = "white";
        }
    }


  
    function openModal(modal) {
        modal.setAttribute("aria-hidden", "false");
    }
    function closeModal(modal) {
        modal.setAttribute("aria-hidden", "true");
    }

    loginBtn.addEventListener("click", () => openModal(loginModal));
    registerBtn.addEventListener("click", () => openModal(registerModal));

    closeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            closeModal(e.target.closest(".modal"));
        });
    });

    openRegisterFromLogin.addEventListener("click", () => {
        closeModal(loginModal);
        openModal(registerModal);
    });

    openLoginFromRegister.addEventListener("click", () => {
        closeModal(registerModal);
        openModal(loginModal);
    });


   
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        loginMsg.textContent = "";

        const data = new FormData(loginForm);
        const email = data.get("email").toLowerCase().trim();
        const password = data.get("password");

        const users = loadUsers();
        const found = users.find(u => u.email === email && u.password === password);

        if (!found) {
            loginMsg.textContent = "Invalid email or password.";
            loginMsg.style.color = "red";
            return;
        }

        setCurrentUser(email);
        updateUserUI();

        loginMsg.textContent = "Login successful!";
        loginMsg.style.color = "green";

        setTimeout(() => closeModal(loginModal), 700);
    });


    
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        registerMsg.textContent = "";

        const data = new FormData(registerForm);

        const fullname = data.get("fullname").trim();
        const email = data.get("email").toLowerCase().trim();
        const password = data.get("password");
        const confirm = data.get("confirmPassword");
        const phone = data.get("phone");
        const dob = data.get("dob");
        const address = data.get("address");

        if (password !== confirm) {
            registerMsg.textContent = "Passwords do not match.";
            registerMsg.style.color = "red";
            return;
        }

        const users = loadUsers();

        if (users.find(u => u.email === email)) {
            registerMsg.textContent = "Email already registered.";
            registerMsg.style.color = "red";
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

        registerMsg.textContent = "Account created!";
        registerMsg.style.color = "green";

        setTimeout(() => closeModal(registerModal), 900);
    });


    
    loginStatusEl.addEventListener("click", () => {
        if (getCurrentUser()) {
            setCurrentUser("");
            updateUserUI();
            alert("Logged out successfully.");
        }
    });

    updateUserUI();
});





const slides = document.querySelectorAll(".fade-slide");
let current = 0;

function showSlide(i) {
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
}

function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
}

let interval = setInterval(nextSlide, 4000);

document.querySelector(".next").addEventListener("click", () => {
    clearInterval(interval);
    nextSlide();
    interval = setInterval(nextSlide, 4000);
});

document.querySelector(".prev").addEventListener("click", () => {
    clearInterval(interval);
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
    interval = setInterval(nextSlide, 4000);
});

showSlide(0);



const flights = [
    { from: "delhi", to: "mumbai", flight: "AI-203", time: "10:00 AM" },
    { from: "kolkata", to: "chennai", flight: "IN-112", time: "2:00 PM" },
    { from: "delhi", to: "bangalore", flight: "SG-556", time: "7:30 AM" },
    { from: "mumbai", to: "goa", flight: "G8-310", time: "5:45 PM" }
];

document.getElementById("searchBtn").addEventListener("click", () => {
    const from = document.getElementById("from").value.toLowerCase();
    const to = document.getElementById("to").value.toLowerCase();

    const box = document.getElementById("flightResults");
    box.innerHTML = "";

    const result = flights.filter(f => f.from === from && f.to === to);

    if (result.length === 0) {
        box.innerHTML = "<p>No flights found.</p>";
        return;
    }

    result.forEach(f => {
        const card = document.createElement("div");
        card.className = "flight-card";
        card.innerHTML = `
            <div><b>${f.flight}</b><br>${f.from.toUpperCase()} → ${f.to.toUpperCase()}</div>
            <div>${f.time}</div>
        `;
        box.appendChild(card);
    });
});



let selectedRow = null;

function addEditEvents() {
    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", e => {
            selectedRow = e.target.closest("tr");
            document.getElementById("userName").value = selectedRow.cells[0].innerText;
            document.getElementById("userBooking").value = selectedRow.cells[1].innerText;
            document.getElementById("userFlight").value = selectedRow.cells[2].innerText;
            document.getElementById("updateUserForm").style.display = "block";
        });
    });
}
addEditEvents();

document.getElementById("saveUserBtn").addEventListener("click", () => {
    const name = document.getElementById("userName").value;
    const booking = document.getElementById("userBooking").value;
    const flight = document.getElementById("userFlight").value;

    if (name === "" || booking === "" || flight === "") {
        alert("Please fill all fields!");
        return;
    }

    if (selectedRow) {
        selectedRow.cells[0].innerText = name;
        selectedRow.cells[1].innerText = booking;
        selectedRow.cells[2].innerText = flight;
        alert("User updated!");
    } else {
        const tbody = document.getElementById("userBody");
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td>${name}</td>
            <td>${booking}</td>
            <td>${flight}</td>
            <td><button class="editBtn">Edit</button></td>
        `;

        tbody.appendChild(newRow);
        alert("New user added!");

        addEditEvents();
    }

    document.getElementById("userName").value = "";
    document.getElementById("userBooking").value = "";
    document.getElementById("userFlight").value = "";
    document.getElementById("updateUserForm").style.display = "none";

    selectedRow = null;
});