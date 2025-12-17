const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// ========================
// SUBSCRIBER MODEL
// ========================

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: 'website',
        enum: ['website', 'mobile', 'promotion', 'other']
    },
    unsubscribeToken: {
        type: String,
        unique: true,
        sparse: true
    },
    lastNotified: {
        type: Date
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true
});

// Generate unsubscribe token before saving
subscriberSchema.pre('save', function(next) {
    if (!this.unsubscribeToken) {
        const crypto = require('crypto');
        this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
    }
    next();
});

// Index for better query performance
subscriberSchema.index({ email: 1 }, { unique: true });
subscriberSchema.index({ subscribedAt: -1 });
subscriberSchema.index({ isActive: 1 });
subscriberSchema.index({ unsubscribeToken: 1 }, { sparse: true });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// ========================
// HELPER FUNCTIONS
// ========================

// Get all subscribers (for backward compatibility)
async function getAllSubscribers() {
    try {
        const subscribers = await Subscriber.find({ isActive: true })
            .sort({ subscribedAt: -1 })
            .select('email subscribedAt -_id');
        return subscribers.map(s => s.email);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return [];
    }
}

// Get subscriber statistics
async function getSubscriberStats() {
    try {
        const total = await Subscriber.countDocuments({ isActive: true });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todaySubscribers = await Subscriber.countDocuments({
            isActive: true,
            subscribedAt: { $gte: today }
        });
        
        const recent = await Subscriber.find({ isActive: true })
            .sort({ subscribedAt: -1 })
            .limit(10)
            .select('email subscribedAt source');
        
        return {
            total,
            today: todaySubscribers,
            recent
        };
    } catch (error) {
        console.error('Error getting subscriber stats:', error);
        return { total: 0, today: 0, recent: [] };
    }
}

// ========================
// ROUTES
// ========================

// POST /subscribe - Public subscription endpoint
router.post('/subscribe', async (req, res) => {
    try {
        const { email, source = 'website', metadata = {} } = req.body;
        
        // Validate email
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }
        
        // Check if already subscribed (case-insensitive)
        const existingSubscriber = await Subscriber.findOne({ 
            email: email.toLowerCase(),
            isActive: true 
        });
        
        if (existingSubscriber) {
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed.'
            });
        }
        
        // Check if previously unsubscribed
        const previouslyUnsubscribed = await Subscriber.findOne({
            email: email.toLowerCase(),
            isActive: false
        });
        
        let subscriber;
        
        if (previouslyUnsubscribed) {
            // Reactivate the subscriber
            previouslyUnsubscribed.isActive = true;
            previouslyUnsubscribed.source = source;
            previouslyUnsubscribed.metadata = metadata;
            subscriber = await previouslyUnsubscribed.save();
        } else {
            // Create new subscriber
            subscriber = new Subscriber({
                email: email.toLowerCase(),
                source,
                metadata
            });
            await subscriber.save();
        }
        
        console.log(`New subscriber: ${email} | Total active: ${await Subscriber.countDocuments({ isActive: true })}`);
        
        // Send welcome email (optional - implement email service)
        // await sendWelcomeEmail(email, subscriber.unsubscribeToken);
        
        res.json({
            success: true,
            message: 'Thank you for subscribing to our newsletter!'
        });
        
    } catch (error) {
        console.error('Subscription error:', error);
        
        // Handle duplicate key error (email already exists)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed.'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// GET /subscribe/admin - Admin page to view subscribers
router.get('/subscribe/admin', async (req, res) => {
    try {
        // Add authentication middleware in production
        // if (!req.session.user || req.session.user.role !== 'admin') {
        //     return res.redirect('/login');
        // }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        
        // Get subscribers with pagination
        const subscribers = await Subscriber.find({})
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('email subscribedAt source isActive lastNotified');
        
        const total = await Subscriber.countDocuments({});
        const activeCount = await Subscriber.countDocuments({ isActive: true });
        const inactiveCount = await Subscriber.countDocuments({ isActive: false });
        
        // Get recent stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await Subscriber.countDocuments({
            subscribedAt: { $gte: today }
        });
        
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastWeekCount = await Subscriber.countDocuments({
            subscribedAt: { $gte: lastWeek }
        });
        
        res.render('admin/subscribers', {
            title: 'Newsletter Subscribers',
            subscribers,
            subscriberCount: total,
            activeCount,
            inactiveCount,
            todayCount,
            lastWeekCount,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            limit,
            url: '/subscribe/admin'
        });
        
    } catch (error) {
        console.error('Admin page error:', error);
        res.status(500).send('Error loading subscriber data');
    }
});

// GET /api/subscribers - API endpoint to get subscribers (JSON)
router.get('/api/subscribers', async (req, res) => {
    try {
        // Add authentication middleware in production
        const { 
            active = 'true', 
            page = 1, 
            limit = 100,
            sort = '-subscribedAt',
            format = 'json'
        } = req.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        
        // Build query
        const query = {};
        if (active !== 'all') {
            query.isActive = active === 'true';
        }
        
        // Search by email if provided
        if (req.query.search) {
            query.email = { $regex: req.query.search, $options: 'i' };
        }
        
        // Date range filter
        if (req.query.startDate || req.query.endDate) {
            query.subscribedAt = {};
            if (req.query.startDate) {
                query.subscribedAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                query.subscribedAt.$lte = new Date(req.query.endDate);
            }
        }
        
        const subscribers = await Subscriber.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .select('email subscribedAt source isActive');
        
        const total = await Subscriber.countDocuments(query);
        
        res.json({
            success: true,
            count: subscribers.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            subscribers,
            lastUpdated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscribers'
        });
    }
});

// GET /subscribe/export - Export subscribers as CSV
router.get('/subscribe/export', async (req, res) => {
    try {
        // Add authentication in production
        const { 
            active = 'true',
            format = 'csv'
        } = req.query;
        
        // Build query
        const query = {};
        if (active !== 'all') {
            query.isActive = active === 'true';
        }
        
        const subscribers = await Subscriber.find(query)
            .sort({ subscribedAt: -1 })
            .select('email subscribedAt source');
        
        if (format === 'json') {
            return res.json({
                success: true,
                count: subscribers.length,
                subscribers
            });
        }
        
        // CSV format
        const csvContent = "Email,Subscription Date,Source,Status\n" + 
            subscribers.map(sub => 
                `${sub.email},${sub.subscribedAt.toISOString()},${sub.source},${sub.isActive ? 'Active' : 'Inactive'}`
            ).join("\n");
        
        const filename = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(csvContent);
        
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).send('Error exporting subscribers');
    }
});

// GET /subscribe/clear - Clear all subscribers (protected)
router.get('/subscribe/clear', async (req, res) => {
    try {
        // SECURITY: Protect this route in production!
        // Add proper authentication and authorization
        // if (!req.session.user || req.session.user.role !== 'super-admin') {
        //     return res.status(403).json({ success: false, message: 'Unauthorized' });
        // }
        
        const count = await Subscriber.countDocuments({});
        await Subscriber.deleteMany({});
        
        console.log(`Cleared all ${count} subscribers from database`);
        
        res.json({
            success: true,
            message: `Cleared ${count} subscribers from database`,
            count: 0
        });
        
    } catch (error) {
        console.error('Clear error:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing subscribers'
        });
    }
});

// POST /subscribe/bulk - Bulk add subscribers (admin only)
router.post('/subscribe/bulk', async (req, res) => {
    try {
        // Add authentication middleware in production
        const { emails, source = 'bulk-upload' } = req.body;
        
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of email addresses'
            });
        }
        
        const results = {
            total: emails.length,
            added: 0,
            duplicates: 0,
            errors: 0,
            details: []
        };
        
        for (const email of emails) {
            try {
                const normalizedEmail = email.trim().toLowerCase();
                
                if (!normalizedEmail.includes('@')) {
                    results.errors++;
                    results.details.push({ email, status: 'invalid' });
                    continue;
                }
                
                // Check if already exists
                const existing = await Subscriber.findOne({ email: normalizedEmail });
                
                if (existing) {
                    if (!existing.isActive) {
                        // Reactivate inactive subscriber
                        existing.isActive = true;
                        existing.source = source;
                        await existing.save();
                        results.added++;
                        results.details.push({ email, status: 'reactivated' });
                    } else {
                        results.duplicates++;
                        results.details.push({ email, status: 'duplicate' });
                    }
                } else {
                    // Create new subscriber
                    await Subscriber.create({
                        email: normalizedEmail,
                        source,
                        metadata: { addedVia: 'bulk-upload' }
                    });
                    results.added++;
                    results.details.push({ email, status: 'added' });
                }
            } catch (error) {
                results.errors++;
                results.details.push({ email, status: 'error', error: error.message });
            }
        }
        
        console.log(`Bulk import: ${results.added} added, ${results.duplicates} duplicates, ${results.errors} errors`);
        
        res.json({
            success: true,
            message: `Bulk import completed: ${results.added} added, ${results.duplicates} duplicates`,
            results
        });
        
    } catch (error) {
        console.error('Bulk import error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing bulk import'
        });
    }
});

// POST /subscribe/unsubscribe/:token - Unsubscribe via token
router.post('/subscribe/unsubscribe/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
        
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Invalid unsubscribe link'
            });
        }
        
        if (!subscriber.isActive) {
            return res.json({
                success: true,
                message: 'You are already unsubscribed'
            });
        }
        
        subscriber.isActive = false;
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();
        
        res.json({
            success: true,
            message: 'You have been successfully unsubscribed from our newsletter'
        });
        
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing unsubscribe request'
        });
    }
});

// GET /subscribe/test - Test endpoint
router.get('/subscribe/test', async (req, res) => {
    try {
        const total = await Subscriber.countDocuments({});
        const active = await Subscriber.countDocuments({ isActive: true });
        
        res.json({
            success: true,
            message: 'Subscription API is working!',
            database: 'connected',
            subscriberCount: total,
            activeSubscribers: active,
            inactiveSubscribers: total - active
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.json({
            success: false,
            message: 'Database connection error',
            error: error.message
        });
    }
});

// GET /subscribe/stats - Get subscription statistics
router.get('/subscribe/stats', async (req, res) => {
    try {
        const stats = await getSubscriberStats();
        
        // Monthly growth data
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - i);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            
            const count = await Subscriber.countDocuments({
                subscribedAt: { $gte: startDate, $lt: endDate }
            });
            
            monthlyData.push({
                month: startDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
                count
            });
        }
        
        // Source distribution
        const sourceDistribution = await Subscriber.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        res.json({
            success: true,
            ...stats,
            monthlyGrowth: monthlyData,
            sourceDistribution,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
});

// ========================
// BACKWARD COMPATIBILITY
// ========================

// For backward compatibility with existing code that uses the in-memory array
router.get('/subscribe/array', async (req, res) => {
    try {
        const subscribers = await getAllSubscribers();
        res.json({
            success: true,
            subscribers,
            count: subscribers.length
        });
    } catch (error) {
        console.error('Array endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscribers'
        });
    }
});

// ========================
// MIGRATION ENDPOINT (one-time use)
// ========================

// This endpoint migrates existing in-memory subscribers to database
// Run this once after deploying the new version
router.post('/subscribe/migrate', async (req, res) => {
    try {
        // SECURITY: Protect this route!
        // Get existing subscribers from your old storage
        const oldSubscribers = []; // Replace with your old data source
        
        let migrated = 0;
        let duplicates = 0;
        let errors = 0;
        
        for (const email of oldSubscribers) {
            try {
                const normalizedEmail = email.trim().toLowerCase();
                
                // Check if already exists
                const existing = await Subscriber.findOne({ email: normalizedEmail });
                
                if (!existing) {
                    await Subscriber.create({
                        email: normalizedEmail,
                        source: 'migration',
                        metadata: { migrated: true }
                    });
                    migrated++;
                } else {
                    duplicates++;
                }
            } catch (error) {
                errors++;
                console.error(`Migration error for ${email}:`, error.message);
            }
        }
        
        res.json({
            success: true,
            message: `Migration completed: ${migrated} migrated, ${duplicates} duplicates, ${errors} errors`,
            migrated,
            duplicates,
            errors
        });
        
    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({
            success: false,
            message: 'Migration failed'
        });
    }
});

// Export individual functions
module.exports = {
    router,
    getSubscriberStats,
    getAllSubscribers,
    Subscriber // Export the model if needed
};


module.exports = router;