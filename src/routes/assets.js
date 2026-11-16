// asset pages (list, create, edit, delete)
// ref: https://expressjs.com/en/guide/routing.html
const express = require('express');
const { Asset } = require('../models');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

// every asset page needs a login
router.use('/assets', requireLogin);

// list all assets
router.get('/assets', async (req, res) => {
    const assets = await Asset.findAll({ order: [['name', 'ASC']] });
    res.render('assets/index', { title: 'Assets', assets });
});

// show the empty form
router.get('/assets/new', (req, res) => {
    res.render('assets/form', { title: 'New asset', asset: null, error: null });
});

// save a new asset
router.post('/assets', async (req, res) => {
    const { name, type, serialNumber } = req.body;

    if (!name || !type) {
        return res.status(400).render('assets/form', {
            title: 'New asset',
            asset: req.body,
            error: 'Name and type are required',
        });
    }

    await Asset.create({ name, type, serialNumber });
    res.redirect('/assets');
});

// show the form filled in
router.get('/assets/:id/edit', async (req, res) => {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
        return res.status(404).send('Asset not found');
    }

    res.render('assets/form', { title: 'Edit asset', asset, error: null });
});

// save changes to an asset
router.post('/assets/:id', async (req, res) => {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
        return res.status(404).send('Asset not found');
    }

    const { name, type, serialNumber } = req.body;

    if (!name || !type) {
        return res.status(400).render('assets/form', {
            title: 'Edit asset',
            asset: { ...req.body, id: asset.id },
            error: 'Name and type are required',
        });
    }

    await asset.update({ name, type, serialNumber });
    res.redirect('/assets');
});

// delete an asset
router.post('/assets/:id/delete', async (req, res) => {
    const asset = await Asset.findByPk(req.params.id);
    if (asset) {
        await asset.destroy();
    }

    res.redirect('/assets');
});

module.exports = router;
