async function createPost() {
    const content = document.getElementById('post-content').value;
    const response = await fetch('/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });
    if (response.ok) {
        document.getElementById('post-content').value = '';
        loadFeed();
    }
}

async function loadFeed() {
    const response = await fetch('/feed');
    const feed = await response.json();
    
    const feedDiv = document.getElementById('feed');
    feedDiv.innerHTML = '';
    
    feed.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.textContent = post.content;
        feedDiv.appendChild(postDiv);
    });
}

document.addEventListener('DOMContentLoaded', loadFeed);