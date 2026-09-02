# 集团供应链履约与业财协同平台

集团供应链订单履约、异常协同和财务结算平台，采用 Monorepo 管理三个前端应用、NestJS API 与共享 UI 包。

qiankun 中 Vue Router 与 React Router 的 native 路由隔离、实现思路和 AI 协作方法，参见 [`docs/qiankun-native-router.md`](./docs/qiankun-native-router.md)。

## 业务应用

| 应用              | 端口 | 职责                                             |
| ----------------- | ---: | ------------------------------------------------ |
| `portal-shell`    | 5173 | 登录注册、经营指标、订单趋势、履约结构和风险预警 |
| `fulfillment-app` | 5174 | 订单审核、发运、签收、履约方案填报和异常跟踪     |
| `settlement-app`  | 5175 | 三单核对、差异确认、发票登记和付款确认           |
| `api-server`      | 3000 | 认证、业务状态流转、聚合查询和数据持久化         |

## 启动

项目提供两种初始化方式，选择一种即可，不要混着执行。

### 方式一：一条命令自动准备数据库和演示数据

```bash
pnpm install
pnpm bootstrap
pnpm dev
```

`pnpm bootstrap` 会依次完成：

```text
创建或启动 PostgreSQL 容器
        ↓
TypeORM 根据 Entity 自动创建表结构
        ↓
执行 apps/api-server/src/database/seed.ts 写入演示数据
```

`db:up` 使用 `docker compose up --wait`，Compose 会根据 PostgreSQL 的健康检查等待数据库就绪，不再需要项目自己编写 `db:wait` 脚本。

这里的 `seed.ts` 称为 Seed（种子数据脚本）。它是一段使用 TypeScript 和 TypeORM 编写的自动初始化程序，负责写入管理员、订单、履约、异常和结算演示数据。

这种方式适合快速启动项目，不需要打开数据库 GUI。

### 方式二：课堂使用 SQL GUI 手动导入演示数据

如果课堂要展示“创建容器、启动后端自动建表、再通过数据库工具导入数据”，就不要执行 `pnpm bootstrap`，否则 Seed 会提前写入数据。

课堂只需要：

```bash
pnpm install
pnpm db:up
pnpm dev
```

`db:up` 会创建并启动 PostgreSQL，并等待健康检查通过。`pnpm dev` 启动 `api-server` 后，TypeORM 会读取 Entity 并自动创建业务表。看到后端启动成功后，再执行下面的 SQL。

然后让 SQL GUI 连接 `supply_chain` 数据库，打开并执行：

```text
database/demo-data.sql
```

脚本会先清空现有课堂数据，再写入管理员、订单、履约、异常和结算演示数据。页面操作导致数据变化后，重新完整执行一次该脚本并刷新页面，即可恢复初始状态。它会同时删除后来注册的用户和新增的业务数据，只能用于本地教学环境。

### Docker 数据卷是什么

PostgreSQL 在容器内把数据文件写到：

```text
/var/lib/postgresql/data
```

Compose 将这个目录连接到名为 `supply-chain-postgres-data` 的具名数据卷。最终名称通常还会带 Compose 项目前缀，例如：

```text
21_supply-chain-postgres-data
```

数据卷的作用是让数据库数据脱离容器生命周期：

```text
删除容器，保留数据卷 -> 重新创建容器后可以继续使用原数据
删除容器和数据卷     -> 下次得到真正的空数据库
```

在 macOS Docker Desktop 中，数据卷保存在 Docker Desktop 管理的 Linux 虚拟机里，不是项目目录中的普通文件夹。可以在 Docker Desktop 的 `Volumes` 页面查看，不建议进入虚拟机手工修改其中的 PostgreSQL 文件。

如果课堂开始前需要真正清空环境，可以在确认旧数据不再需要后，从 Docker Desktop 删除 `supply-chain-postgres` 容器及对应数据卷。`docker compose down -v` 也会删除当前 Compose 项目的数据卷，这是清数据操作，不要在需要保留数据库时执行。

初始管理员账号：

```text
用户名：admin
密码：Admin123!
```

## 访问地址

- 门户：http://localhost:5173
- 履约中心：http://localhost:5174
- 结算中心：http://localhost:5175
- Swagger：http://localhost:3000/api/docs

## 履约长表单与 KeepAlive

履约中心新增“履约方案填报”长表单：

```text
http://localhost:5174/plans/new
```

表单包含订单、仓储、运输、交付和风险预案。履约中心的嵌套路由只缓存 `FulfillmentPlanFormView`：填写内容后切换到订单任务、运输跟踪或异常协同，再返回表单时内容仍然存在；其他页面不会因此被缓存。

当前只演示子应用内部的 Vue KeepAlive。刷新浏览器或以后从微前端主应用卸载整个履约中心时，组件实例仍会销毁；跨应用恢复将在微前端集成阶段处理。

## 履约与结算业务闭环

项目按照下面的规则处理异常、履约和结算：

```text
异常待处理
  -> 开始处理
异常处理中
  -> 关闭异常
异常已解决
  -> 完成订单剩余运输或签收
履约已完成
  -> 后端自动创建“对账中”结算批次
  -> 结算中心刷新后继续对账、开票和付款
```

存在未关闭异常时，订单不能直接完成。只有履约状态为 `completed` 的订单才会进入正式结算；后端同时保证同一张订单不会重复生成结算明细。

初始数据只为两张已经完成履约的订单准备结算批次。其他订单在页面中推进到“已完成”后，才会动态出现在结算中心。

## 数据库

```text
Host: 127.0.0.1
Port: 5432
Database: supply_chain
User: supply_chain
Password: supply_chain_dev
Schema: public
```

业务表包括：

- `sales_orders`
- `fulfillments`
- `fulfillment_exceptions`
- `settlement_batches`
- `settlement_items`

## 常用命令

```bash
pnpm check
pnpm build
pnpm db:up
pnpm db:seed
pnpm db:logs
pnpm db:down
```

为了让课程聚焦微前端，教学项目使用 TypeORM `synchronize: true`，后端启动时根据 Entity 自动同步表结构。生产环境通常会关闭自动同步，改用经过审查的数据库变更脚本，避免应用启动时直接修改正式数据库。
当结算中心对账时发现交付金额或签收结果存在疑问，还可以点击“退回履约核实”：

```text
结算中心发现差异
  -> 创建履约核实任务
  -> 履约中心开始核实并填写实际交付金额、核实结论
  -> 结算批次回到对账中
  -> 财务重新对账、开票和付款
```

当前三个应用仍然独立运行，因此操作人员需要手动切换应用并刷新数据。后续接入微前端后，再用统一导航、业务上下文和应用通信改善这段操作体验。
