document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('currentUser')) {
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }
    loadFeed();
});
    function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html'; // Redirect to login
}

function createPost() {
    const content = document.getElementById('post-content').value;
    const username = localStorage.getItem('currentUser'); // Get the current username

    if (content.trim() === '') {
        alert("Post cannot be empty!");
        return;
    }

    const post = {
        content: content,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: [],
        username: username // Store the username with the post
    };

    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    document.getElementById('post-content').value = '';
    loadFeed();
}

function loadFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
            <div>
                <p class="post-content"><strong>${post.username}:</strong> ${post.content}</p>
                <p>Posted on ${post.timestamp}</p>
                <p class="counts">
                    <button class="like-btn" onclick="toggleLike(${index})">
                        ${post.likes > 0 ? '❤️' : '🤍'} ${post.likes}
                    </button>
                </p>
                <p class="counts">Comments (${post.comments.length}):</p>
                <div id="comments-${index}">${loadComments(post.comments)}</div>
                <textarea id="comment-input-${index}" placeholder="Add a comment..."></textarea>
                <button class="comment-btn" onclick="addComment(${index})">Comment💬</button>
            </div>
            <button class="delete-btn" onclick="deletePost(${index})">🗑️</button>
        `;

        feed.appendChild(postDiv);
    });
}

function loadComments(comments) {
    return comments.map(comment => `<p>${comment.username}: ${comment.text}</p>`).join('');
}

function addComment(index) {
    const commentInput = document.getElementById(`comment-input-${index}`);
    const commentText = commentInput.value.trim();
    const username = localStorage.getItem('currentUser'); // Get the current username
    
    if (commentText === '') {
        alert("Comment cannot be empty!");
        return;
    }
    
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[index].comments.push({ username, text: commentText }); // Store comment with username
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Clear the comment input
    commentInput.value = '';
    
    // Reload the feed to show the new comment
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

function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Reload the feed
    loadFeed();
}
