/**
 * Modestox - Shopware Reorder Insights
 *
 * @copyright Copyright (c) 2026 Sergey Kuzmitsky
 * @license   MIT
 * @link      https://github.com/Modestox/shopware-reorder-insights
 */

import template from './sw-customer-detail-purchased-products.html.twig';
import './sw-customer-detail-purchased-products.scss';

const {Component} = Shopware;

Component.register('sw-customer-detail-purchased-products', {
    template,

    inject: ['loginService'],

    props: {
        customer: {
            type: Object,
            required: false,
            default: null
        }
    },

    data() {
        return {
            purchasedProducts: [],
            total: 0,
            page: 1,
            limit: 25,
            searchTerm: '',
            sortBy: 'lastOrderDate',
            sortDirection: 'DESC',
            isLoading: true,
            requestCounter: 0
        };
    },

    computed: {
        customerId() {
            return this.customer?.id || this.$route.params.id;
        },

        gridSortBy() {
            return this.sortBy === 'lastOrderDate' ? 'lastOrderDateFormatted' : this.sortBy;
        },

        columns() {
            return [
                {
                    property: 'index',
                    label: '#',
                    width: '50px',
                    align: 'center',
                    allowResize: false,
                    sortable: false
                },
                {
                    property: 'label',
                    label: this.$tc('modestox-reorder-insights.detailPurchasedProducts.columnProductName'),
                    primary: true,
                    allowResize: true,
                    sortable: true
                },
                {
                    property: 'productNumber',
                    label: this.$tc('modestox-reorder-insights.detailPurchasedProducts.columnProductNumber'),
                    width: '160px',
                    allowResize: true,
                    sortable: true
                },
                {
                    property: 'totalQuantity',
                    label: this.$tc('modestox-reorder-insights.detailPurchasedProducts.columnTotalQuantity'),
                    width: '100px',
                    align: 'right',
                    allowResize: false,
                    sortable: true
                },
                {
                    property: 'lastOrderDateFormatted',
                    label: this.$tc('modestox-reorder-insights.detailPurchasedProducts.columnLastOrderDate'),
                    width: '140px',
                    align: 'right',
                    allowResize: false,
                    sortable: true
                }
            ];
        },

        cardTitle() {
            const titlePrefix = this.$tc('modestox-reorder-insights.customerDetail.purchasedProductsTitle') || 'Purchased Products Summary';
            return `${titlePrefix} (${this.total})`;
        }
    },

    created() {
        this.loadPage();
    },

    methods: {

        onClearSearch() {
            this.searchTerm = '';
            this.onSearch('');
        },

        async loadPage() {
            if (!this.customerId) {
                this.isLoading = false;
                return;
            }

            this.isLoading = true;

            this.requestCounter += 1;
            const currentRequest = this.requestCounter;

            try {
                const httpClient = Shopware.Application.getContainer('init').httpClient;

                const response = await httpClient.get(
                    `/_action/modestox/customer/${this.customerId}/purchased-products`,
                    {
                        params: {
                            page: this.page,
                            limit: this.limit,
                            search: this.searchTerm,
                            sortBy: this.sortBy,
                            sortDirection: this.sortDirection
                        },
                        headers: {
                            Authorization: `Bearer ${this.loginService.getToken()}`
                        }
                    }
                );

                if (currentRequest !== this.requestCounter) {
                    return;
                }

                this.purchasedProducts = (response.data.items || []).map((item) => ({
                    ...item,
                    lastOrderDateFormatted: this.formatDate(item.lastOrderDate ? new Date(item.lastOrderDate) : null)
                }));
                this.total = response.data.total || 0;
            } catch (error) {
                if (currentRequest !== this.requestCounter) {
                    return;
                }

                this.purchasedProducts = [];
                this.total = 0;
            } finally {
                if (currentRequest === this.requestCounter) {
                    this.isLoading = false;
                }
            }
        },

        formatDate(date) {
            if (!date || Number.isNaN(date.getTime())) {
                return '';
            }

            return new Intl.DateTimeFormat(Shopware.Store.get('session').currentLocale || 'en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        },

        onSearch(term) {
            this.searchTerm = term || '';
            this.page = 1;
            this.loadPage();
        },

        onSortColumn(column) {
            const property = column.dataIndex || column.property;
            const field = property === 'lastOrderDateFormatted' ? 'lastOrderDate' : property;

            if (this.sortBy === field) {
                this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
            } else {
                this.sortBy = field;
                this.sortDirection = 'ASC';
            }

            this.page = 1;
            this.loadPage();
        },

        onPageChange({page, limit}) {
            this.page = page;
            this.limit = limit;
            this.loadPage();
        }
    }
});