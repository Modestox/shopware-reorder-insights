# Shopware 6 Reorder & Product Insights

[English](README.md) | [Русский](README.ru.md)

Ein Shopware 6 Plugin, das Produkte mit der Bestellhistorie verknüpft, Kaufmetriken im Kundenprofil und der Admin-Produktansicht anzeigt sowie eine schnelle Nachbestellung im Storefront ermöglicht.

## Funktionen

- **Bestellungen in Produktansicht (Admin):** zeige alle Bestellungen, die ein bestimmtes Produkt enthalten, direkt in den Produktdetails mit Mengen und Einzelpreisen an.
- **Gekaufte Produkte im Kundenprofil (Admin):** zeige eine zusammengefasste Übersicht aller von einem Kunden gekauften Produkte an.
- **Meine gekauften Produkte & Nachbestellung (Storefront):** ermöglicht Kunden die schnelle Nachbestellung zuvor bestellter Artikel direkt aus ihrem Kundenkonto.
- **Granulare Konfiguration:** aktiviere oder deaktiviere jede der drei Ansichten unabhängig voneinander über die Plugin-Einstellungen.
- **Übersetzungen:** Englisch, Deutsch und Russisch.

## Anforderungen

- Shopware `~6.7.0`
- Getestet mit Shopware 6.7.15.1 und PHP 8.4

## Installation

Die kompilierten Administration-Assets sind **kein** Bestandteil dieses Repositories, daher muss die Administration nach der Installation gebaut werden.

1. Gehe in das Plugin-Verzeichnis deines Shopware-Projekts:

   ```bash
   cd custom/plugins
   ```

2. Klone das Repository in einen Ordner namens `ModestoxReorderInsights`:
   
   ```bash
   git clone https://github.com/Modestox/shopware-reorder-insights.git ModestoxReorderInsights
   ```
   
3. Installiere und aktiviere das Plugin:
   
    ```bash
   bin/console plugin:refresh
   bin/console plugin:install --activate ModestoxReorderInsights
   ```

4. Baue die Administration und leere den Cache:

   ```bash
   bin/build-administration.sh
   bin/console cache:clear
   ```

   Tipp: Mit `SHOPWARE_ADMIN_BUILD_ONLY_EXTENSIONS=1` überspringt der Build den Shopware-Core und baut nur die installierten Erweiterungen, was wesentlich schneller ist:

   ```bash
   SHOPWARE_ADMIN_BUILD_ONLY_EXTENSIONS=1 bin/build-administration.sh
   ```

## Nutzung

1. Öffne die Shopware Administration.
2. Gehe zu **Einstellungen → Erweiterungen → shopware-reorder-insights**, um die Sichtbarkeit der Funktionen zu konfigurieren.
3. Öffne eine beliebige **Produkt-Detailseite**: Wechsle zum Tab **Bestellungen**, um alle Bestellungen mit diesem Produkt einzusehen.
4. Öffne ein **Kundenprofil**, um die gesamte Kaufhistorie des Kunden zu sehen.
5. Im **Storefront** können Kunden **Mein Konto → Gekaufte Produkte** aufrufen, um Artikel schnell nachzubestellen.

## Lizenz

Freigegeben unter der Lizenz AGPL-3.0-or-later. Siehe [LICENSE](LICENSE) für Details.

## Autor

Sergey Kuzmitsky — [@Modestox](https://github.com/Modestox)