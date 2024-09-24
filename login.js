function login() {
    const username = document.getElementById('username').value.trim();
    if (username === '') {
        document.getElementById('error-message').innerText = "Username cannot be empty!";
        return;
    }

    localStorage.setItem('currentUser', username);
    window.location.href = 'index.html'; // Redirect to the main feed
}
