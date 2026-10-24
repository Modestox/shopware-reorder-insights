/**
 * Modestox - Shopware Reorder Insights
 *
 * @copyright Copyright (c) 2026 Sergey Kuzmitsky
 * @license   MIT
 * @link      https://github.com/Modestox/shopware-reorder-insights
 */

import template from './sw-product-detail.html.twig';

const {Component} = Shopware;

Component.override('sw-product-detail', {
    template,

    inject: ['systemConfigApiService'],

    data() {
        return {
            isOrdersTabEnabled: true
        };
    },

    watch: {
        '$route.name'(newRoute) {
            if (newRoute === 'sw.product.detail.orders' && !this.isOrdersTabEnabled) {
                this.redirectToBaseTab();
            }
        }
    },

    created() {
        this.checkOrdersTabConfig();
    },

    methods: {
        checkOrdersTabConfig() {
            this.systemConfigApiService.getValues('ModestoxReorderInsights.config')
                .then((response) => {
                    const isEnabled = response?.['ModestoxReorderInsights.config.enableOrdersInProductView'];

                    if (isEnabled !== undefined) {
                        this.isOrdersTabEnabled = Boolean(isEnabled);
                    }

                    if (!this.isOrdersTabEnabled && this.$route.name === 'sw.product.detail.orders') {
                        this.redirectToBaseTab();
                    }
                })
                .catch(() => {
                    this.isOrdersTabEnabled = true;
                });
        },

        /**
         * Redirect to the main (base) tab of the product detail page.
         */
        redirectToBaseTab() {
            this.$router.replace({
                name: 'sw.product.detail.base',
                params: {id: this.$route.params.id}
            });
        }
    }
});