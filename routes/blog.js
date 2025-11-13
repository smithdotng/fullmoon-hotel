const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// GET /blog - Blog listing
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    const popularPosts = await Blog.find({ published: true })
      .sort({ views: -1 })
      .limit(5);
    
    res.render('blog/list', { 
      title: 'Blog - Full Moon Hotels',
      blogs,
      popularPosts
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Server Error',
      error: 'Failed to load blog' 
    });
  }
});

// GET /blog/:slug - Single blog post
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) {
      return res.status(404).render('error', { 
        title: 'Blog Post Not Found',
        error: 'The requested blog post was not found.' 
      });
    }

    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    
    // Get related posts
    const relatedPosts = await Blog.find({ 
      _id: { $ne: blog._id },
      category: blog.category,
      published: true 
    }).limit(3);

    // Get popular posts for sidebar
    const popularPosts = await Blog.find({ published: true })
      .sort({ views: -1 })
      .limit(5);

    res.render('blog/detail', { 
      title: blog.title + ' - Full Moon Hotels',
      blog,
      relatedPosts,
      popularPosts
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Server Error',
      error: 'Failed to load blog post' 
    });
  }
});

// GET /blog/category/:category - Blog posts by category
router.get('/category/:category', async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      category: req.params.category, 
      published: true 
    }).sort({ createdAt: -1 });
    
    const popularPosts = await Blog.find({ published: true })
      .sort({ views: -1 })
      .limit(5);

    res.render('blog/list', { 
      title: `${req.params.category} - Full Moon Hotels Blog`,
      blogs,
      popularPosts
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Server Error',
      error: 'Failed to load blog category' 
    });
  }
});

// GET /blog/tag/:tag - Blog posts by tag
router.get('/tag/:tag', async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      tags: req.params.tag, 
      published: true 
    }).sort({ createdAt: -1 });
    
    const popularPosts = await Blog.find({ published: true })
      .sort({ views: -1 })
      .limit(5);

    res.render('blog/list', { 
      title: `Posts tagged with "${req.params.tag}" - Full Moon Hotels Blog`,
      blogs,
      popularPosts
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Server Error',
      error: 'Failed to load blog tag' 
    });
  }
});

module.exports = router;