function toggleMenu() {
    document.getElementById("dropdownMenu").classList.toggle("active");
}

function scrollToBooking() {
    const bookingSection = document.getElementById("booking-section");
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" });
    }
}

document.getElementById("whyBookBtn").addEventListener("click", function () {
    scrollToBooking();
});
