const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fetchDashboardData = async () => {
    const totalUsers = await prisma.user.count();
    const totalProductsActive = await prisma.product.count({
        where: {
            status: 'Active'
        }
    });
    const totalProductsInactive = await prisma.product.count({
        where: {
            status: 'Inactive'
        }
    });

    console.log("Total Products Active", totalProductsActive);
    console.log("Total Products Inactive", totalProductsInactive);
    const totalOrders = await prisma.checkout.count();
    const totalRevenue = await prisma.checkout.aggregate({
        _sum: {
            net_price: true
        }
    });

    const ordersByStatus = await prisma.checkout.groupBy({
        by: ['status'],
        _count: {
            status: true
        }
    });

    const topSellingProducts = await prisma.checkoutProduct.groupBy({
        by: ['product_id'],
        _sum: {
            quantity: true
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: 5
    });

    const topSellingProductDetails = await Promise.all(topSellingProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
            where: {
                id: item.product_id
            }
        });
        return {
            ...product,
            quantity: item._sum.quantity
        };
    }));

    const totalCities = await prisma.city.count();
    const totalStores = await prisma.store.count();

    return {
        totalUsers,
        totalProducts: {
            active: totalProductsActive,
            inactive: totalProductsInactive
        },
        totalOrders,
        totalRevenue: totalRevenue._sum.net_price,
        ordersByStatus,
        topSellingProducts: topSellingProductDetails,
        totalCities,
        totalStores
    };
};

module.exports = { fetchDashboardData };