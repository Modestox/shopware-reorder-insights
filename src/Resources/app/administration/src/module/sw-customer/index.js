/**
 * Modestox CMS - E-commerce Platform
 *
 * @copyright Copyright (c) 2026 Sergey Kuzmitsky
 * @license   AGPL-3.0-or-later
 * @link      https://github.com/Modestox/modestox
 */

import './page/sw-customer-detail';
import './component/sw-customer-detail-purchased-products';

const { Module } = Shopware;

Module.register('modestox-reorder-insights-customer', {
    routeMiddleware(next, currentRoute) {
        if (currentRoute.name === 'sw.customer.detail') {
            currentRoute.children.push({
                name: 'sw.customer.detail.purchasedProducts',
                path: '/sw/customer/detail/:id/purchased-products',
                component: 'sw-customer-detail-purchased-products',
                meta: {
                    parentPath: 'sw.customer.index',
                    privilege: 'customer.viewer'
                }
            });
        }
        next(currentRoute);
    }
});