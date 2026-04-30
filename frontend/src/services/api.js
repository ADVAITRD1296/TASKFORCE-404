const API_BASE = 'http://localhost:8080/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

// ---- Auth ----
export async function apiLogin(email, password, deviceToken) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, deviceToken })
  });
  return handleResponse(res);
}

export async function apiRegister(name, email, password, phone) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone })
  });
  return handleResponse(res);
}

export async function apiGetMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ---- Flights ----
export async function apiGetFlights() {
  const res = await fetch(`${API_BASE}/flights`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiSearchFlights(origin, destination) {
  const params = new URLSearchParams();
  if (origin) params.append('origin', origin);
  if (destination) params.append('destination', destination);
  const res = await fetch(`${API_BASE}/flights/search?${params}`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiBookFlight(flightId, passengers, classType) {
  const res = await fetch(`${API_BASE}/flights/book`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ flightId, passengers, classType })
  });
  return handleResponse(res);
}

// ---- Hotels ----
export async function apiGetHotels() {
  const res = await fetch(`${API_BASE}/hotels`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiSearchHotels(location, roomType) {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (roomType) params.append('roomType', roomType);
  const res = await fetch(`${API_BASE}/hotels/search?${params}`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiBookHotel(hotelId, checkin, checkout, guests, roomType) {
  const res = await fetch(`${API_BASE}/hotels/book`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ hotelId, checkin, checkout, guests, roomType })
  });
  return handleResponse(res);
}

// ---- Shows ----
export async function apiGetShows() {
  const res = await fetch(`${API_BASE}/shows`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiBookShow(movieName, tickets, showtime, pricePerTicket) {
  const res = await fetch(`${API_BASE}/shows/book`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ movieName, tickets, showtime, pricePerTicket })
  });
  return handleResponse(res);
}

// ---- Trains ----
export async function apiGetTrains() {
  const res = await fetch(`${API_BASE}/trains`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiSearchTrains(origin, destination) {
  const params = new URLSearchParams();
  if (origin) params.append('origin', origin);
  if (destination) params.append('destination', destination);
  const res = await fetch(`${API_BASE}/trains/search?${params}`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiBookTrain(trainId, passengers, classType) {
  const res = await fetch(`${API_BASE}/trains/book`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ trainId, passengers, classType: classType || '' })
  });
  return handleResponse(res);
}

// ---- Buses ----
export async function apiGetBuses() {
  const res = await fetch(`${API_BASE}/buses`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiSearchBuses(origin, destination) {
  const params = new URLSearchParams();
  if (origin) params.append('origin', origin);
  if (destination) params.append('destination', destination);
  const res = await fetch(`${API_BASE}/buses/search?${params}`, { headers: { 'Content-Type': 'application/json' } });
  return handleResponse(res);
}

export async function apiBookBus(busId, seats) {
  const res = await fetch(`${API_BASE}/buses/book`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ busId, seats })
  });
  return handleResponse(res);
}

// ---- Bookings ----
export async function apiGetBookings(type) {
  const params = type ? `?type=${type}` : '';
  const res = await fetch(`${API_BASE}/bookings${params}`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function apiCancelBooking(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ---- User Profile ----
export async function apiGetProfile() {
  const res = await fetch(`${API_BASE}/user/profile`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

export async function apiUpdateProfile(updates) {
  const res = await fetch(`${API_BASE}/user/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates)
  });
  return handleResponse(res);
}

// ---- Contact ----
export async function apiSubmitContact(name, email, message) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });
  return handleResponse(res);
}

// ---- AI Support Chat ----
export async function apiSendChatMessage(message) {
  const res = await fetch(`${API_BASE}/chat/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return handleResponse(res);
}
