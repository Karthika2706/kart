document.addEventListener('DOMContentLoaded', loadFeed);

function createPost() {
    const content = document.getElementById('post-content').value;
    if (content.trim() === '') {
        alert("Post cannot be empty!");
        return;
    }

    const post = {
        content: content,
        timestamp: new Date().toLocaleString(),
        likes: 0 // Initialize likes count
    };

    // Save the post in localStorage
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Clear the textarea
    document.getElementById('post-content').value = '';

    // Reload the feed
    loadFeed();
}

function loadFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        // Create the post content
        postDiv.innerHTML = `
            <div>
                <p class="post-content">${post.content}</p>
                <p>Posted on ${post.timestamp}</p>
                <p>Likes: <span id="like-count-${index}">${post.likes}</span></p>
            </div>
            <button class="like-btn" onclick="toggleLike(${index})">${post.likes > 0 ? 'Unlike' : 'Like'}</button>
            <button class="delete-btn" onclick="deletePost(${index})">Delete</button>
        `;

        feed.appendChild(postDiv);
    });
}

function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Reload the feed
    loadFeed();
}

function toggleLike(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    // Toggle likes
    if (posts[index].likes > 0) {
        posts[index].likes--;
    } else {
        posts[index].likes++;
    }
    
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Reload the feed
    loadFeed();
}
   
