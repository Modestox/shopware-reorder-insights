/**
 * Modestox - Shopware Reorder Insights
 *
 * @copyright Copyright (c) 2026 Sergey Kuzmitsky
 * @license   MIT
 * @link      https://github.com/Modestox/shopware-reorder-insights
 */

import template from './sw-customer-detail.html.twig';

const {Component} = Shopware;

Component.override('sw-customer-detail', {
    template,

    inject: ['systemConfigApiService'],

    data() {
        return {
            isPurchasedProductsTabEnabled: true
        };
    },

    watch: {
        '$route.name'(newRoute) {
            if (newRoute === 'sw.customer.detail.purchasedProducts' && !this.isPurchasedProductsTabEnabled) {
                this.redirectToBaseTab();
            }
        }
    },

    created() {
        this.checkPurchasedProductsTabConfig();
    },

    methods: {
        checkPurchasedProductsTabConfig() {
            this.systemConfigApiService.getValues('ModestoxReorderInsights.config')
                .then((response) => {
                    const isEnabled = response?.['ModestoxReorderInsights.config.enablePurchasedProductsInCustomer'];

                    if (isEnabled !== undefined) {
                        this.isPurchasedProductsTabEnabled = Boolean(isEnabled);
                    }

                    if (!this.isPurchasedProductsTabEnabled && this.$route.name === 'sw.customer.detail.purchasedProducts') {
                        this.redirectToBaseTab();
                    }
                })
                .catch(() => {
                    this.isPurchasedProductsTabEnabled = true;
                });
        },

        /**
         * Redirect to the main (base) tab of the customer detail page.
         */
        redirectToBaseTab() {
            this.$router.replace({
                name: 'sw.customer.detail.base',
                params: {id: this.$route.params.id}
            });
        }
    }
});