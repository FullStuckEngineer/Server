const dashboardService = require('../../services/dashboardService');

const getDashboardData = async (req, res) => {
    try {
        const data = await dashboardService.fetchDashboardData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

module.exports = { getDashboardData };
