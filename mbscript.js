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
        likes: 0, // Initialize likes count
        comments: [] // Initialize comments array
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
    return comments.map(comment => `<p>${comment}</p>`).join('');
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

function addComment(index) {
    const commentInput = document.getElementById(`comment-input-${index}`);
    const comment = commentInput.value.trim();
    
    if (comment === '') {
        alert("Comment cannot be empty!");
        return;
    }
    
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[index].comments.push(comment);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Clear the comment input
    commentInput.value = '';
    
    // Reload the feed to show the new comment
    loadFeed();
}
function loadComments(comments) {
    return comments.map(comment => `<div class="comment">${comment}</div>`).join('');
}
