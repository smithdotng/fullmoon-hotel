const Menu = require('../models/Menu');

exports.getMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find({ available: true });
    const categories = [...new Set(menuItems.map(item => item.category))];
    
    res.render('menu/list', { 
      menuItems, 
      categories,
      title: 'Restaurant Menu'
    });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to fetch menu' });
  }
};

exports.getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await Menu.find({ category, available: true });
    
    res.render('menu/category', { 
      menuItems, 
      category,
      title: category + ' Menu'
    });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to fetch menu items' });
  }
};