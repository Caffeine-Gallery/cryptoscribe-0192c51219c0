import { backend } from "declarations/backend";

let quill;
const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize Quill editor
document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
});

// Event Listeners
document.getElementById('newPostBtn').addEventListener('click', () => {
    postForm.classList.remove('hidden');
});

document.getElementById('cancelPost').addEventListener('click', () => {
    postForm.classList.add('hidden');
    resetForm();
});

document.getElementById('submitPost').addEventListener('click', async () => {
    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('authorName').value;
    const body = quill.root.innerHTML;

    if (!title || !author || !body) {
        alert('Please fill in all fields');
        return;
    }

    showLoading();
    try {
        await backend.createPost(title, body, author);
        resetForm();
        postForm.classList.add('hidden');
        await loadPosts();
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post');
    }
    hideLoading();
});

// Helper Functions
function resetForm() {
    document.getElementById('postTitle').value = '';
    document.getElementById('authorName').value = '';
    quill.setContents([]);
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function formatDate(timestamp) {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function loadPosts() {
    showLoading();
    try {
        const posts = await backend.getPosts();
        postsContainer.innerHTML = posts.map(post => `
            <article class="post">
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span class="author">By ${post.author}</span>
                    <span class="date">${formatDate(post.timestamp)}</span>
                </div>
                <div class="post-content">${post.body}</div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<p>Failed to load posts</p>';
    }
    hideLoading();
}

// Initial load
loadPosts();
