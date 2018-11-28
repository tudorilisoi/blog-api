'use strict'

const STATE = {                              //declare global STATE object
    blogPosts: null,
}

function getBlogPosts() {                   //API call to GET blog posts
    const settings = {
        url: '/blog-posts',
        dataType: 'json',
        type: 'GET'
    }

    $.ajax(settings).then((results) => {
        STATE.blogPosts = results;          //add data to STATE
        displayBlogPosts();                 //call display function
    }).catch(showError);
    
    console.log(STATE);
}

function deleteBlogPost(id) {                //API call to DELETE blog posts
    const settings = {
        url: `/blog-posts/${id}`,
        dataType: 'json',
        type: 'DELETE'
    }

    $.ajax(settings).catch(showError);
    getBlogPosts();                         //Retreive updated blog posts in STATE & display after deletion
}

function displayBlogPosts() {               //Pass each blog post to render function & update DOM
    const blogPosts = STATE.blogPosts.map((post, index) => renderBlogPost(post, index));
    $('.js-blog-posts').prop('hidden', false);
    $('.js-blog-posts').html(blogPosts);
}

function renderBlogPost(post, index) {      //HTML template for blog post
    const title = post.title;
    const content = post.content;
    const author = post.author;
    return `
        <div class="blog-post">
            <h2>${title}</h2>
            <p>${content}</p>
            <p>Published by ${author}</p>
            <button class="js-delete" data-index="${index}">Delete Post</button>
        </div>
    `
}

function clickDeletePost() {                //Event listener for Delete Post button
    $('body').on('click', '.js-delete', function(event) {
        event.preventDefault();
        const index = $(event.target).attr('data-index');
        const id = STATE.blogPosts[index].id;
        deleteBlogPost(id);                 //Delete blog post using id
    });
}

function showError() {                      //Display error if API calls fail
    $('.js-message').prop('hidden', false);
    $('.js-message').text('There was an error loading the requested data');
}

function handleBlog() {                    
    getBlogPosts();
    clickDeletePost();
}

$(handleBlog);                              //Document ready function