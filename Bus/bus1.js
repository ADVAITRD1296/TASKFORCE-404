document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       NAVBAR DROPDOWN
    ====================================================== */
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    dropdownToggle?.addEventListener("click", () => {
        dropdownMenu.style.display =
            dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-dropdown")) {
            dropdownMenu.style.display = "none";
        }
    });


    /* ======================================================
       LOGIN / REGISTER SYSTEM (LocalStorage)
    ====================================================== */
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    const openRegisterFromLogin = document.getElementById("openRegisterFromLogin");
    const openLoginFromRegister = document.getElementById("openLoginFromRegister");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginMsg = document.getElementById("loginMsg");
    const registerMsg = document.getElementById("registerMsg");

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
        localStorage.setItem("currentUser", email);
    }

    function getCurrentUser() {
        return localStorage.getItem("currentUser") || "";
    }

    function updateUserUI() {
        const users = loadUsers();
        userCountEl.textContent = `Users: ${users.length}`;

        const current = getCurrentUser();

        if (current) {
            loginStatusEl.textContent = `Logged in as ${current}`;
        } else {
            loginStatusEl.textContent = "Not logged in";
        }
    }

    updateUserUI();


    /* ================= Modal Open / Close ================= */
    function openModal(modal) {
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal(modal) {
        modal.setAttribute("aria-hidden", "true");

        modal.querySelectorAll(".form-msg").forEach(m => m.textContent = "");
        modal.querySelectorAll("form").forEach(f => f.reset());
    }

    loginBtn.addEventListener("click", () => openModal(loginModal));
    registerBtn.addEventListener("click", () => openModal(registerModal));

    document.querySelectorAll("[data-close]").forEach(btn => {
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


    /* ================= LOGIN FORM ================= */
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const form = new FormData(loginForm);
        const email = form.get("email").trim().toLowerCase();
        const password = form.get("password").trim();

        const users = loadUsers();
        const found = users.find(u => u.email === email && u.password === password);

        if (!found) {
            loginMsg.style.color = "red";
            loginMsg.textContent = "Invalid email or password";
            return;
        }

        setCurrentUser(email);
        updateUserUI();

        loginMsg.style.color = "green";
        loginMsg.textContent = "Login successful";

        setTimeout(() => closeModal(loginModal), 800);
    });


    /* ================= REGISTER FORM ================= */
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const form = new FormData(registerForm);

        const fullname = form.get("fullname").trim();
        const email = form.get("email").trim().toLowerCase();
        const password = form.get("password");
        const confirmPassword = form.get("confirmPassword");

        if (password !== confirmPassword) {
            registerMsg.style.color = "red";
            registerMsg.textContent = "Passwords do not match!";
            return;
        }

        const users = loadUsers();

        if (users.some(u => u.email === email)) {
            registerMsg.style.color = "red";
            registerMsg.textContent = "Email already exists!";
            return;
        }

        users.push({
            fullname,
            email,
            password,
            createdAt: new Date().toISOString(),
        });

        saveUsers(users);
        setCurrentUser(email);
        updateUserUI();

        registerMsg.style.color = "green";
        registerMsg.textContent = "Account created! Logging in...";

        setTimeout(() => closeModal(registerModal), 900);
    });


    /* ======================================================
       LOGOUT ON CLICK STATUS
    ====================================================== */
    loginStatusEl.addEventListener("click", () => {
        const current = getCurrentUser();

        if (current) {
            setCurrentUser("");
            updateUserUI();
            alert("Logged out!");
        } else {
            openModal(loginModal);
        }
    });


    /* ======================================================
       CAROUSEL AUTO-SLIDER
    ====================================================== */
    const track = document.getElementById("carouselTrack");
    const slides = document.querySelectorAll(".carousel-slide");

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    let index = 0;

    function goToSlide(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener("click", () => goToSlide(index + 1));
    prevBtn.addEventListener("click", () => goToSlide(index - 1));

    setInterval(() => goToSlide(index + 1), 4000);


    /* ======================================================
       BOOKING FORM + TABLE
    ====================================================== */

    const nameInput = document.getElementById("name");
    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("to");
    const dateInput = document.getElementById("date");
    const seatsInput = document.getElementById("seats");

    const bookingForm = document.getElementById("bookingForm");
    const tbody = document.getElementById("bookingTableBody");

    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const passenger = nameInput.value.trim();
        const fromCity = fromInput.value.trim();
        const toCity = toInput.value.trim();
        const date = dateInput.value;
        const seats = seatsInput.value;

        if (!passenger || !fromCity || !toCity || !date || !seats) {
            alert("Please fill all fields!");
            return;
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${passenger}</td>
            <td>${fromCity}</td>
            <td>${toCity}</td>
            <td>${date}</td>
            <td>${seats}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        tr.querySelector(".delete-btn").addEventListener("click", () => tr.remove());

        tbody.appendChild(tr);

        bookingForm.reset();
    });


    /* ======================================================
       LIVE SEARCH FILTER
    ====================================================== */
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        tbody.querySelectorAll("tr").forEach(row => {
            const match = row.textContent.toLowerCase().includes(query);
            row.style.display = match ? "" : "none";
        });
    });

});
