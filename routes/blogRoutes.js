const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { route } = require('./districtAreaRoutes');


// Blog topic routes
router.get('/topic', blogController.getAll);
router.get('/topic/:id', blogController.getById);
router.post('/topic', blogController.create);
router.put('/topic/:id', blogController.update);
router.delete('/topic/:id', blogController.remove);

// Blog routes
router.get('/bytopic/:topicId', blogController.getBlogsByTopic);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.removeBlog);



module.exports = router;