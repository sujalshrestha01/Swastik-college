import Blog from '../models/Blog.js';

const createSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') + `-${Date.now()}`;

// GET /api/blogs — public (all posts for admin uses ?all=true)
export async function listBlogs(req, res) {
  try {
    const filter = req.query.all === 'true' ? {} : { published: true };
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
}

// GET /api/blogs/:identifier
export async function getBlog(req, res) {
  try {
    const { identifier } = req.params;
    const blog = await Blog.findOne({
      $or: [{ slug: identifier }, { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }],
    });
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
}

// POST /api/blogs — admin only
export async function createBlog(req, res) {
  try {
    const { title, excerpt, content, category, author, imageUrl, published } = req.body;
    const slug = createSlug(title);

    const newBlog = new Blog({
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      imageUrl,
      published,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ message: 'Error creating blog post', error: err.message });
  }
}

// PUT /api/blogs/:id — admin only
export async function updateBlog(req, res) {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBlog) return res.status(404).json({ message: 'Blog post not found' });
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: 'Error updating blog post', error: err.message });
  }
}

// DELETE /api/blogs/:id — admin only
export async function deleteBlog(req, res) {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog post', error: err.message });
  }
}
