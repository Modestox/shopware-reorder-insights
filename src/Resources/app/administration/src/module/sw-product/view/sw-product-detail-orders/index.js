/**
 * Modestox - Shopware Reorder Insights
 *
 * @copyright Copyright (c) 2026 Sergey Kuzmitsky
 * @license   MIT
 * @link      https://github.com/Modestox/shopware-reorder-insights
 */

import template from './sw-product-detail-orders.html.twig';
import './sw-product-detail-orders.scss'

const {Component} = Shopware;
const {Criteria} = Shopware.Data;

Component.register('sw-product-detail-orders', {
    template,

    inject: ['repositoryFactory'],

    data() {
        return {
            orders: null,
            isLoading: true,
            total: 0
        };
    },

    computed: {
        productId() {
            return this.$route.params.id;
        },

        orderRepository() {
            return this.repositoryFactory.create('order');
        },

        orderColumns() {
            return [
                {
                    property: 'orderNumber',
                    label: 'sw-order.list.columnOrderNumber',
                    routerLink: 'sw.order.detail',
                    allowResize: true,
                    primary: true,
                },
                {
                    property: 'orderCustomer.firstName',
                    label: 'sw-order.list.columnCustomerName',
                    allowResize: true,
                },
                {
                    property: 'quantity',
                    label: 'sw-order.detailBase.columnQuantity',
                    allowResize: true,
                },
                {
                    property: 'unitPrice',
                    label: 'sw-order.detailBase.columnPrice',
                    allowResize: true,
                },
                {
                    property: 'orderDateTime',
                    label: 'sw-order.list.orderDate',
                    allowResize: true,
                }
            ];
        }
    },

    watch: {
        productId() {
            this.loadOrders();
        }
    },

    created() {
        this.loadOrders();
    },

    methods: {
        loadOrders() {
            if (!this.productId) {
                this.isLoading = false;
                return;
            }

            this.isLoading = true;

            const criteria = new Criteria(1, 25);
            criteria.addFilter(Criteria.equals('lineItems.productId', this.productId));
            criteria.addAssociation('orderCustomer');
            criteria.addAssociation('lineItems');
            criteria.addAssociation('currency');
            criteria.addSorting(Criteria.sort('orderDateTime', 'DESC'));

            this.orderRepository.search(criteria, Shopware.Context.api)
                .then((result) => {
                    this.orders = result;
                    this.total = result.total;
                })
                .catch((error) => {
                    console.error('[ModestoxReorderInsights] Failed to load orders', error);
                    this.orders = [];
                    this.total = 0;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        /**
         * Get current line item for active product.
         *
         * @param {Object} order
         * @returns {Object|null}
         */
        getLineItem(order) {
            if (!order || !order.lineItems) {
                return null;
            }

            return order.lineItems.find(item => item.productId === this.productId) || null;
        },

        /**
         * Get formatted price for the item.
         *
         * @param {Object} order
         * @returns {string}
         */
        getItemPrice(order) {
            const lineItem = this.getLineItem(order);
            if (!lineItem || lineItem.price === null || lineItem.price === undefined) {
                return '';
            }

            const currencyIso = order.currency ? order.currency.isoCode : 'EUR';
            const price = lineItem.price.unitPrice ?? lineItem.unitPrice;

            return Shopware.Utils.format.currency(price, currencyIso);
        }
    }
});