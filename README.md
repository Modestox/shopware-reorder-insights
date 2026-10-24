# Shopware 6 Reorder & Product Insights

[Deutsch](README.de.md) | [Русский](README.ru.md)

A Shopware 6 plugin that links products with order history, displays purchase metrics in the Customer Profile and Admin Product View, and enables fast reordering in the Storefront.

## Features

- **Orders in Product View (Admin):** view all orders containing a specific product directly on the admin product details page with item quantities and unit prices.
- **Purchased Products in Customer Profile (Admin):** see an aggregated summary of all unique products purchased by a specific customer.
- **My Purchased Products & Reorder (Storefront):** allows customers to quickly view and repurchase previously ordered items from their account.
- **Granular Configuration:** enable or disable each of the three integration views independently via Plugin Settings.
- **Translations:** English, German and Russian.

## Requirements

- Shopware `~6.7.0`
- Tested with Shopware 6.7.15.1 and PHP 8.4

## Installation

The compiled Administration assets are **not** part of this repository, so the Administration has to be built after installation.

1. Go to the plugins directory of your Shopware project:
   `cd custom/plugins`

2. Clone the repository into a folder named `ModestoxReorderInsights`:
   `git clone https://github.com/Modestox/shopware-reorder-insights.git ModestoxReorderInsights`

3. Install and activate the plugin:
   `bin/console plugin:refresh`
   `bin/console plugin:install --activate ModestoxReorderInsights`

4. Build the Administration and clear the cache:
   `bin/build-administration.sh`
   `bin/console cache:clear`

   Tip: with `SHOPWARE_ADMIN_BUILD_ONLY_EXTENSIONS=1` the build skips the Shopware core and builds only the installed extensions, which is much faster:
   `SHOPWARE_ADMIN_BUILD_ONLY_EXTENSIONS=1 bin/build-administration.sh`

## Usage

1. Open the Shopware Administration.
2. Go to **Settings → Extensions → shopware-reorder-insights** to configure feature visibility.
3. Open any **Product** detail page: switch to the **Orders** tab to inspect all orders containing this product.
4. Open any **Customer** profile to view their total purchase history.
5. In the **Storefront**, customers can open **My Account → Purchased Products** to quickly reorder items.

## License

Released under the AGPL-3.0-or-later License. See [LICENSE](LICENSE) for details.

## Author

Sergey Kuzmitsky — [@Modestox](https://github.com/Modestox)