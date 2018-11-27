'use strict'

const STATE = {
    blogPosts: null
}

function getBlogPosts() {
    const settings = {
        url: '/blog-posts',
        dataType: 'json',
        type: 'GET'
    }

    $.ajax(settings).then((results) => {
        STATE.blogPosts = results;
        displayBlogPosts();
    }).catch(showError);
    
    console.log(STATE);
}

function displayBlogPosts() {
    const blogPosts = STATE.blogPosts.map((post, index) => renderBlogPost(post, index));
    $('.js-blog-posts').prop('hidden', false);
    $('.js-blog-posts').html(blogPosts);
}

function renderBlogPost(post, index) {
    const title = post.title;
    const content = post.content;
    const author = post.author;
    return `
        <div class="blog-post" data-index="${index}">
            <h2>${title}</h2>
            <p>${content}</p>
            <p>Published by ${author}</p>
        </div>
    `
}

function showError() {
    $('.js-message').prop('hidden', false);
    $('.js-message').text('There was an error loading the requested data');
}

function handleBlog() {
    getBlogPosts();
}

$(handleBlog);