/**
 * Modestox - Shopware Reorder Insights
 *
 * @copyright Copyright (c) 2026 Sergey Kuzmitsky
 * @license   MIT
 * @link      https://github.com/Modestox/shopware-reorder-insights
 */

import deDE from '../../snippet/de-DE.json';
import enGB from '../../snippet/en-GB.json';
import ruRU from '../../snippet/ru-RU.json';

Shopware.Module.register('modestox-product-detail-orders', {
    type: 'plugin',
    name: 'ModestoxReorderInsights',
    title: 'modestox-reorder-insights.productDetail.tabOrders',
    description: 'modestox-reorder-insights.productDetail.tabOrders',
    color: '#eb5202',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB,
        'ru-RU': ruRU
    },

    routeMiddleware(next, currentRoute) {
        if (currentRoute.name === 'sw.product.detail') {
            currentRoute.children.push({
                name: 'sw.product.detail.orders',
                path: '/sw/product/detail/:id/orders',
                component: 'sw-product-detail-orders',
                meta: {
                    parentPath: 'sw.product.index'
                }
            });
        }
        next(currentRoute);
    }
});