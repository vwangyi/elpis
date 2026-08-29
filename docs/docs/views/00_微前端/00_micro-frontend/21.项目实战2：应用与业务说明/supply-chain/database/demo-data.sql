-- 使用前提：
--   1. PostgreSQL 容器已经启动；
--   2. api-server 已经至少启动一次，TypeORM 已根据 Entity 自动创建表；
--   3. SQL 客户端连接的是 supply_chain 数据库，而不是默认 postgres 数据库。

BEGIN;

TRUNCATE TABLE
  fulfillment_verifications,
  settlement_items,
  settlement_batches,
  fulfillment_exceptions,
  fulfillments,
  sales_orders,
  users,
  organizations
RESTART IDENTITY CASCADE;

-- 组织与管理员。管理员密码：Admin123!
INSERT INTO organizations (code, name)
VALUES ('GROUP-HQ', '集团运营中心')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, updated_at = now();

INSERT INTO users (username, display_name, password_hash, status, organization_id)
SELECT
  'admin',
  '平台管理员',
  '$2b$12$c9rlIC7iUsQLMw/uS8ITN.x6jBzsWzzg4Kj2WLGryljePYjbUnZbm',
  'active'::user_status_enum,
  organization.id
FROM organizations AS organization
WHERE organization.code = 'GROUP-HQ'
ON CONFLICT (username) DO NOTHING;

-- 销售订单
INSERT INTO sales_orders (
  order_no,
  customer_name,
  business_unit,
  amount,
  item_count,
  order_date,
  promised_date,
  status
)
VALUES
  ('SO202608050021', '华东零售事业部', '华东事业群', 128600.00, 320, DATE '2026-08-05', DATE '2026-08-08', 'completed'),
  ('SO202608060035', '南方渠道中心', '南方事业群', 86400.00, 180, DATE '2026-08-06', DATE '2026-08-09', 'completed'),
  ('SO202608070042', '北区直营中心', '北方事业群', 52800.00, 120, DATE '2026-08-07', DATE '2026-08-10', 'partially_received'),
  ('SO202608080063', '西南分销事业部', '西南事业群', 43200.00, 96, DATE '2026-08-08', DATE '2026-08-11', 'exception'),
  ('SO202608090071', '华中商超渠道', '华中事业群', 196800.00, 410, DATE '2026-08-09', DATE '2026-08-12', 'in_transit'),
  ('SO202608090078', '华南直营网点', '南方事业群', 77600.00, 160, DATE '2026-08-09', DATE '2026-08-12', 'ready_to_ship'),
  ('SO202608100087', '西北区域公司', '西北事业群', 93400.00, 210, DATE '2026-08-10', DATE '2026-08-13', 'pending_review'),
  ('SO202608100092', '苏皖零售中心', '华东事业群', 68800.00, 140, DATE '2026-08-10', DATE '2026-08-13', 'in_transit'),
  ('SO202608110016', '粤海经销中心', '南方事业群', 112500.00, 250, DATE '2026-08-11', DATE '2026-08-14', 'ready_to_ship'),
  ('SO202608110018', '京津直营网点', '北方事业群', 158000.00, 360, DATE '2026-08-11', DATE '2026-08-14', 'pending_review')
ON CONFLICT (order_no) DO NOTHING;

-- 履约任务。通过订单号查询外键，避免依赖固定 UUID。
WITH fulfillment_input (
  order_no,
  warehouse,
  carrier,
  tracking_no,
  total_quantity,
  shipped_quantity,
  received_quantity,
  status,
  shipped_at,
  signed_at
) AS (
  VALUES
    ('SO202608050021', '上海青浦中心仓', '顺丰供应链', 'YT2026080001', 320, 320, 320, 'completed', TIMESTAMPTZ '2026-08-06 03:30:00+00', TIMESTAMPTZ '2026-08-08 08:20:00+00'),
    ('SO202608060035', '武汉东西湖中心仓', '京东物流', 'YT2026080002', 180, 180, 180, 'completed', TIMESTAMPTZ '2026-08-07 03:30:00+00', TIMESTAMPTZ '2026-08-09 08:20:00+00'),
    ('SO202608070042', '上海青浦中心仓', '顺丰供应链', 'YT2026080003', 120, 120, 80, 'partially_received', TIMESTAMPTZ '2026-08-08 03:30:00+00', NULL),
    ('SO202608080063', '武汉东西湖中心仓', '京东物流', 'YT2026080004', 96, 96, 0, 'exception', TIMESTAMPTZ '2026-08-09 03:30:00+00', NULL),
    ('SO202608090071', '上海青浦中心仓', '顺丰供应链', 'YT2026080005', 410, 410, 0, 'in_transit', TIMESTAMPTZ '2026-08-10 03:30:00+00', NULL),
    ('SO202608090078', '武汉东西湖中心仓', '京东物流', 'YT2026080006', 160, 0, 0, 'ready_to_ship', NULL, NULL),
    ('SO202608100087', '上海青浦中心仓', NULL, NULL, 210, 0, 0, 'pending_review', NULL, NULL),
    ('SO202608100092', '武汉东西湖中心仓', NULL, NULL, 140, 140, 0, 'in_transit', TIMESTAMPTZ '2026-08-13 03:30:00+00', NULL),
    ('SO202608110016', '上海青浦中心仓', NULL, NULL, 250, 0, 0, 'ready_to_ship', NULL, NULL),
    ('SO202608110018', '武汉东西湖中心仓', NULL, NULL, 360, 0, 0, 'pending_review', NULL, NULL)
)
INSERT INTO fulfillments (
  sales_order_id,
  warehouse,
  carrier,
  tracking_no,
  total_quantity,
  shipped_quantity,
  received_quantity,
  status,
  shipped_at,
  signed_at
)
SELECT
  sales_order.id,
  input.warehouse,
  input.carrier,
  input.tracking_no,
  input.total_quantity,
  input.shipped_quantity,
  input.received_quantity,
  input.status::fulfillment_status_enum,
  input.shipped_at,
  input.signed_at
FROM fulfillment_input AS input
INNER JOIN sales_orders AS sales_order ON sales_order.order_no = input.order_no
ON CONFLICT (sales_order_id) DO NOTHING;

-- 履约异常
WITH exception_input (order_no, exception_type, description, owner, status, deadline_at) AS (
  VALUES
    ('SO202608080063', '运输延误', '干线车辆临时故障，预计晚到 8 小时', '周敏', 'processing', TIMESTAMPTZ '2026-08-12 10:00:00+08'),
    ('SO202608070042', '签收差异', '客户实收数量与发运数量相差 40 件', '陈涛', 'open', TIMESTAMPTZ '2026-08-12 16:00:00+08'),
    ('SO202608050021', '外包装破损', '已完成现场取证并确认不影响商品销售', '李倩', 'resolved', TIMESTAMPTZ '2026-08-09 18:00:00+08')
)
INSERT INTO fulfillment_exceptions (
  fulfillment_id,
  exception_type,
  description,
  owner,
  status,
  deadline_at
)
SELECT
  fulfillment.id,
  input.exception_type,
  input.description,
  input.owner,
  input.status::fulfillment_exception_status_enum,
  input.deadline_at
FROM exception_input AS input
INNER JOIN sales_orders AS sales_order ON sales_order.order_no = input.order_no
INNER JOIN fulfillments AS fulfillment ON fulfillment.sales_order_id = sales_order.id
WHERE NOT EXISTS (
  SELECT 1
  FROM fulfillment_exceptions AS existing
  WHERE existing.fulfillment_id = fulfillment.id
    AND existing.exception_type = input.exception_type
);

-- 结算批次
INSERT INTO settlement_batches (
  batch_no,
  partner_name,
  period,
  payable_amount,
  difference_amount,
  status,
  invoice_no,
  paid_at,
  created_at
)
VALUES
  ('ST202608-0010', '华东零售事业部', '2026-08', 128600.00, 0.00, 'paid', 'FP2026080018', TIMESTAMPTZ '2026-08-11 09:00:00+08', TIMESTAMPTZ '2026-08-06 02:00:00+00'),
  ('ST202608-0011', '南方渠道中心', '2026-08', 86400.00, 0.00, 'invoiced', 'FP2026080021', NULL, TIMESTAMPTZ '2026-08-07 02:00:00+00')
ON CONFLICT (batch_no) DO NOTHING;

-- 结算明细
WITH settlement_item_input (
  batch_no,
  order_no,
  order_amount,
  delivery_amount,
  invoice_amount,
  difference_reason
) AS (
  VALUES
    ('ST202608-0010', 'SO202608050021', 128600.00, 128600.00, 128600.00, NULL),
    ('ST202608-0011', 'SO202608060035', 86400.00, 86400.00, 86400.00, NULL)
)
INSERT INTO settlement_items (
  batch_id,
  sales_order_id,
  order_amount,
  delivery_amount,
  invoice_amount,
  difference_reason
)
SELECT
  batch.id,
  sales_order.id,
  input.order_amount,
  input.delivery_amount,
  input.invoice_amount,
  input.difference_reason
FROM settlement_item_input AS input
INNER JOIN settlement_batches AS batch ON batch.batch_no = input.batch_no
INNER JOIN sales_orders AS sales_order ON sales_order.order_no = input.order_no
WHERE NOT EXISTS (
  SELECT 1
  FROM settlement_items AS existing
  WHERE existing.batch_id = batch.id
    AND existing.sales_order_id = sales_order.id
);

COMMIT;

-- 执行结果检查。正常情况下应返回：组织 1、用户 1、订单 10、履约 10、异常 3、履约核实 0、批次 2、明细 2。
SELECT 'organizations' AS table_name, count(*) AS row_count FROM organizations
UNION ALL
SELECT 'users', count(*) FROM users
UNION ALL
SELECT 'sales_orders', count(*) FROM sales_orders
UNION ALL
SELECT 'fulfillments', count(*) FROM fulfillments
UNION ALL
SELECT 'fulfillment_exceptions', count(*) FROM fulfillment_exceptions
UNION ALL
SELECT 'fulfillment_verifications', count(*) FROM fulfillment_verifications
UNION ALL
SELECT 'settlement_batches', count(*) FROM settlement_batches
UNION ALL
SELECT 'settlement_items', count(*) FROM settlement_items
ORDER BY table_name;
