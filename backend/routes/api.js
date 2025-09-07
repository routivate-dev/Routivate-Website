const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interaction');
const Contact = require('../models/Contact');

// POST /api/track - Log user interactions
router.post('/track', async (req, res) => {
    try {
        const { type, page, element, sessionId, metadata } = req.body;

        const interaction = new Interaction({
            type,
            page,
            element,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            sessionId,
            metadata
        });

        await interaction.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error logging interaction:', error);
        res.status(500).json({ success: false, error: 'Failed to log interaction' });
    }
});

// POST /api/contact - Handle contact form submissions
router.post('/contact', async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body;

        const contact = new Contact({
            name,
            email,
            mobile,
            message,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        await contact.save();
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// GET /api/analytics - Get analytics data (basic)
router.get('/analytics', async (req, res) => {
    try {
        const pageViews = await Interaction.countDocuments({ type: 'page_view' });
        const clicks = await Interaction.countDocuments({ type: 'click' });
        const formSubmits = await Contact.countDocuments();

        const recentInteractions = await Interaction.find({ limit: 10 });

        res.json({
            pageViews,
            clicks,
            formSubmits,
            recentInteractions
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
