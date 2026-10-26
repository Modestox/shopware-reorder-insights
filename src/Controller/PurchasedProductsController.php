<?php declare(strict_types=1);
/**
 * Modestox - Shopware Reorder Insights
 *
 * @copyright Copyright (c) 2026 Sergey Kuzmitsky
 * @license   MIT
 * @link      https://github.com/Modestox/shopware-reorder-insights
 */

namespace Modestox\ReorderInsights\Controller;

use Doctrine\DBAL\Connection;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Uuid\Uuid;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['api']])]
class PurchasedProductsController extends AbstractController
{
    private const MAX_LIMIT = 100;
    private const MAX_SEARCH_LENGTH = 100;

    private const SORTABLE_FIELDS = [
        'label' => 'label',
        'productNumber' => 'productNumber',
        'totalQuantity' => 'totalQuantity',
        'lastOrderDate' => 'lastOrderDate',
    ];

    public function __construct(private readonly Connection $connection)
    {
    }

    #[Route(
        path: '/api/_action/modestox/customer/{customerId}/purchased-products',
        name: 'api.action.modestox.customer.purchased_products',
        defaults: ['_acl' => ['customer:read']],
        methods: ['GET']
    )]
    public function list(string $customerId, Request $request): JsonResponse
    {
        if (!Uuid::isValid($customerId)) {
            return new JsonResponse(['message' => 'Invalid customer id'], 400);
        }

        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(self::MAX_LIMIT, max(1, $request->query->getInt('limit', 25)));
        $offset = ($page - 1) * $limit;

        $search = trim((string) $request->query->get('search', ''));
        $search = mb_substr($search, 0, self::MAX_SEARCH_LENGTH);

        $sortKey = (string) $request->query->get('sortBy', 'lastOrderDate');
        $sortColumn = self::SORTABLE_FIELDS[$sortKey] ?? self::SORTABLE_FIELDS['lastOrderDate'];
        $sortDirection = strtoupper((string) $request->query->get('sortDirection', 'DESC')) === 'ASC'
            ? 'ASC'
            : 'DESC';

        $params = [
            'customerId' => Uuid::fromHexToBytes($customerId),
            'version' => Uuid::fromHexToBytes(Defaults::LIVE_VERSION),
        ];

        $having = '';
        if ($search !== '') {
            $escaped = addcslashes($search, '\\%_');
            $params['search'] = '%' . $escaped . '%';
            $having = 'HAVING MAX(li.label) LIKE :search
                        OR MAX(JSON_UNQUOTE(JSON_EXTRACT(li.payload, \'$.productNumber\'))) LIKE :search';
        }

        $grouped = <<<SQL
            SELECT LOWER(HEX(li.product_id)) AS id,
                   MAX(li.label) AS label,
                   MAX(JSON_UNQUOTE(JSON_EXTRACT(li.payload, '$.productNumber'))) AS productNumber,
                   SUM(li.quantity) AS totalQuantity,
                   MAX(li.created_at) AS lastOrderDate
            FROM order_line_item li
            INNER JOIN order_customer oc
                ON oc.order_id = li.order_id
               AND oc.order_version_id = li.order_version_id
            WHERE oc.customer_id = :customerId
              AND li.type = 'product'
              AND li.version_id = :version
              AND li.product_id IS NOT NULL
            GROUP BY li.product_id
            {$having}
            SQL;

        $total = (int) $this->connection->fetchOne(
            'SELECT COUNT(*) FROM (' . $grouped . ') AS grouped_products',
            $params
        );

        $rows = $this->connection->fetchAllAssociative(
            $grouped
            . ' ORDER BY ' . $sortColumn . ' ' . $sortDirection . ', id ASC'
            . ' LIMIT ' . $limit . ' OFFSET ' . $offset,
            $params
        );

        $items = array_map(static function (array $row): array {
            $dateFormatted = null;
            if (!empty($row['lastOrderDate'])) {
                $dateFormatted = (new \DateTimeImmutable($row['lastOrderDate'], new \DateTimeZone('UTC')))
                    ->format(\DATE_ATOM);
            }

            return [
                'id' => $row['id'],
                'label' => $row['label'],
                'productNumber' => $row['productNumber'] ?? '-',
                'totalQuantity' => (int) $row['totalQuantity'],
                'lastOrderDate' => $dateFormatted,
            ];
        }, $rows);

        return new JsonResponse(['total' => $total, 'items' => $items]);
    }
}