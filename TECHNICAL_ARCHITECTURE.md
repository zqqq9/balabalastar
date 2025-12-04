# DestinyStar 技术架构文档

## 一、技术栈详细说明

### 1.1 前端框架：Next.js 14+ (App Router)

**选择理由**:
- 支持 React Server Components，提升性能
- 内置路由和 API 路由，全栈解决方案
- 优秀的 SEO 支持
- 自动代码分割和优化
- Vercel 部署无缝集成

**关键特性使用**:
- App Router 用于路由管理
- Server Components 用于数据获取和渲染
- Route Handlers 用于 API 端点
- Metadata API 用于 SEO
- Image Optimization 用于图片优化

### 1.2 类型系统：TypeScript

**配置要点**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

**类型定义组织**:
- `types/` 目录存放全局类型定义
- 组件类型定义在组件文件内
- API 类型定义在 API 路由附近

### 1.3 UI 组件库：Shadcn UI + Radix UI

**组件选择策略**:
- 基础组件：Button, Input, Card, Dialog
- 表单组件：Form, Select, Checkbox, Radio
- 导航组件：Tabs, Navigation Menu
- 反馈组件：Toast, Alert, Skeleton
- 数据展示：Table, Calendar

**自定义主题**:
- 深色/浅色模式切换
- 神秘主题色彩（紫色、金色）
- 自定义字体和间距

### 1.4 样式方案：Tailwind CSS

**配置要点**:
- 移动端优先的响应式设计
- 自定义颜色主题
- 自定义动画和过渡效果
- 使用 CSS Variables 支持主题切换

**最佳实践**:
- 使用 `@apply` 谨慎，优先使用工具类
- 组件样式使用 `cn()` 工具函数合并
- 响应式断点：sm, md, lg, xl, 2xl

### 1.5 状态管理策略

**Server Components (优先)**:
- 数据获取使用 Server Components
- 减少客户端 JavaScript 体积
- 提升首屏加载速度

**客户端状态管理**:
- 简单状态：useState
- 复杂状态：Zustand（轻量级）
- URL 状态：nuqs（搜索参数）

**数据获取**:
- Server Components: 直接 fetch
- Client Components: React Query（如需要）

### 1.6 表单处理：React Hook Form + Zod

**优势**:
- 性能优化（非受控组件）
- 类型安全的验证
- 易于集成 Shadcn UI

**使用模式**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
```

## 二、后端架构

### 2.1 API 设计

**路由结构**:
```
app/api/
├── auth/          # 认证相关
├── horoscope/     # 星座相关
├── fortune/       # 占卜相关
├── calendar/      # 黄历相关
└── user/          # 用户相关
```

**API 规范**:
- RESTful API 设计
- 统一错误处理
- 统一响应格式
- API 版本控制（如需要）

**响应格式**:
```typescript
{
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}
```

### 2.2 数据库设计

**使用 Prisma ORM**:
- 类型安全的数据库访问
- 自动生成 TypeScript 类型
- 迁移管理

**核心数据模型**:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String?  @unique
  phone     String?  @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  queries   Query[]
  favorites Favorite[]
}

model Query {
  id        String   @id @default(cuid())
  userId    String?
  type      String   // 'bazi', 'tarot', 'horoscope', etc.
  input     Json     // 输入数据
  result    Json     // 结果数据
  createdAt DateTime @default(now())
  
  user      User?    @relation(fields: [userId], references: [id])
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  type      String
  contentId String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}
```

### 2.3 认证系统：NextAuth.js

**配置**:
- Email/Password 认证
- 手机号认证（可选）
- JWT Token 管理
- Session 管理

**安全措施**:
- 密码加密（bcrypt）
- CSRF 保护
- Rate Limiting
- 输入验证和清理

## 三、核心算法实现

### 3.1 八字算命算法

**实现思路**:
1. 公历转农历（使用算法库）
2. 计算天干地支
3. 计算五行属性
4. 分析八字关系
5. 生成解读内容

**依赖库考虑**:
- `lunar-javascript` - 农历转换
- 或自行实现算法

**性能优化**:
- 结果缓存
- 预计算常用数据
- Web Worker（如需要）

### 3.2 黄历算法

**实现思路**:
1. 计算农历日期
2. 计算天干地支
3. 查询宜忌规则
4. 生成黄历内容

**数据存储**:
- 规则数据库
- 或算法生成

### 3.3 塔罗牌算法

**实现思路**:
1. 使用加密安全的随机数生成器
2. 洗牌算法（Fisher-Yates）
3. 抽牌逻辑
4. 牌面解读匹配

**随机性保证**:
```typescript
import { randomBytes } from 'crypto'

function secureRandom(max: number): number {
  const randomValue = randomBytes(4).readUInt32BE(0)
  return randomValue % max
}
```

## 四、性能优化策略

### 4.1 前端优化

**代码分割**:
- 路由级别的代码分割（自动）
- 组件懒加载
- 第三方库按需加载

**图片优化**:
- 使用 Next.js Image 组件
- WebP 格式
- 懒加载
- 响应式图片

**缓存策略**:
- 静态资源缓存
- API 响应缓存
- 浏览器缓存

### 4.2 后端优化

**数据库优化**:
- 索引优化
- 查询优化
- 连接池配置
- 读写分离（如需要）

**API 优化**:
- 响应压缩
- 数据分页
- 字段选择（避免过度获取）
- 批量操作

**缓存策略**:
- Redis 缓存热点数据
- 计算结果缓存
- CDN 缓存静态资源

### 4.3 监控和分析

**性能监控**:
- Web Vitals 监控
- API 响应时间监控
- 错误追踪（Sentry）

**分析工具**:
- Vercel Analytics
- Google Analytics（可选）
- 自定义分析

## 五、安全考虑

### 5.1 数据安全

**用户数据**:
- 密码加密存储
- 敏感信息加密
- 数据访问控制
- 定期备份

**API 安全**:
- 输入验证和清理
- SQL 注入防护（Prisma 自动处理）
- XSS 防护
- CSRF 防护

### 5.2 隐私保护

**合规性**:
- 用户隐私政策
- 数据使用说明
- Cookie 政策
- GDPR 合规（如需要）

**数据最小化**:
- 只收集必要数据
- 定期清理过期数据
- 用户数据删除功能

## 六、部署架构

### 6.0 服务器需求说明

**重要说明**: 当前架构需要服务器能力，但有两种部署方式：

#### 方式一：Serverless 部署（推荐，无需自管服务器）✅

**特点**:
- 使用 Vercel、Netlify 等 Serverless 平台
- **不需要自己购买和管理服务器**
- Next.js API Routes 和 Server Components 在 Serverless Functions 中运行
- 按需自动扩缩容，按使用量付费
- 零运维成本，自动处理服务器管理

**适用场景**: 
- ✅ 中小型项目（推荐）
- ✅ 快速上线
- ✅ 成本控制
- ✅ 无需运维团队

#### 方式二：传统服务器部署（需要自管服务器）

**特点**:
- 需要购买云服务器（如阿里云、腾讯云、AWS）
- 需要自己安装和配置 Node.js 环境
- 需要自己管理服务器、监控、备份
- 需要处理服务器扩展和负载均衡

**适用场景**:
- 大型项目，需要更多控制
- 有特殊服务器需求
- 有运维团队

**当前架构推荐**: 使用 **Serverless 部署（Vercel）**，无需自管服务器！

### 6.1 部署平台：Vercel（Serverless）

**优势**:
- Next.js 原生支持
- **Serverless Functions，无需管理服务器**
- 自动 CI/CD
- 全球 CDN
- 自动 HTTPS
- 环境变量管理
- 免费额度充足（适合中小型项目）

**部署流程**:
1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署（Serverless Functions）
4. 域名配置

**成本**: 
- 免费版：适合个人项目和小型项目
- Pro版：$20/月，适合商业项目

### 6.2 数据库部署（托管服务，无需自管服务器）

**推荐选项（托管数据库服务）**:
- **Vercel Postgres**（推荐）- 与 Vercel 无缝集成，Serverless 数据库
- **Supabase** - 开源 Firebase 替代品，免费额度充足
- **Railway** - 简单易用的数据库托管
- **PlanetScale** - MySQL 兼容，Serverless 数据库

**自建选项（需要服务器）**:
- 自建 PostgreSQL - 需要购买服务器，自己安装和维护

**推荐方案**: 使用 **Vercel Postgres** 或 **Supabase**，无需管理数据库服务器！

**连接配置**:
- 使用连接池（托管服务自动处理）
- SSL 连接（自动启用）
- 环境变量管理（通过平台管理）

### 6.3 CI/CD 流程

**GitHub Actions**:
```yaml
# .github/workflows/deploy.yml
- 代码检查（ESLint, TypeScript）
- 测试运行
- 构建验证
- 自动部署到 Vercel
```

## 七、开发工具和流程

### 7.1 开发工具

**必需工具**:
- Node.js 18+
- pnpm / npm / yarn
- Git
- VS Code（推荐）

**VS Code 扩展**:
- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense
- Prisma

### 7.2 代码规范

**ESLint 配置**:
- Next.js 推荐配置
- TypeScript 严格模式
- React Hooks 规则

**Prettier 配置**:
- 统一的代码格式
- 自动格式化

**Git 工作流**:
- 功能分支开发
- Pull Request 审查
- 语义化提交信息

### 7.3 测试策略

**测试类型**:
- 单元测试（Jest + React Testing Library）
- 集成测试
- E2E 测试（Playwright，可选）

**测试覆盖**:
- 核心算法测试
- 关键功能测试
- API 端点测试

## 八、扩展性考虑

### 8.1 水平扩展

**无状态设计**:
- API 无状态
- Session 外部存储
- 文件存储外部化

**负载均衡**:
- Vercel 自动处理
- CDN 分发

### 8.2 功能扩展

**插件化设计**:
- 占卜功能模块化
- 易于添加新功能
- 配置化内容管理

**API 扩展**:
- RESTful API 设计
- 版本控制
- 文档完善

## 九、技术债务管理

### 9.1 代码质量

**定期审查**:
- Code Review
- 重构计划
- 技术债务记录

**文档维护**:
- 代码注释
- API 文档
- 架构文档更新

### 9.2 依赖管理

**依赖更新**:
- 定期更新依赖
- 安全漏洞检查
- 版本锁定策略

---

**文档版本**: v1.0  
**最后更新**: 2024年

