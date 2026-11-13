# Backend AI Agent Guidelines: NestJS Clean Architecture & SOLID Principles

Dự án này tuân thủ nghiêm ngặt **Clean Architecture**, **Domain-Driven Design (DDD Lite)** và **SOLID Principles**. Khi tạo mới hoặc chỉnh sửa code backend, Agent BẮT BUỘC phải tuân theo các quy tắc dưới đây.

---

## 1. Cấu Trúc Phân Lớp (Layered Architecture)

Mỗi feature module nằm trong `src/modules/<feature-name>/` và bắt buộc chia làm 4 tầng độc lập:

```
src/modules/<feature-name>/
├── domain/                      # Không phụ thuộc vào bất kỳ thư viện/framework nào
│   ├── entities/                # Rich Domain Entities, chứa business rules & invariants
│   └── repositories/            # Repository Interfaces (Ports) & Symbol Injection Tokens
├── application/                 # Điều phối nghiệp vụ, use-case driven
│   ├── dto/                     # Command, Query, Result DTOs
│   └── use-cases/               # Mỗi use-case là 1 class độc lập (Single Responsibility)
├── infrastructure/              # Chi tiết kỹ thuật & triển khai ngoại vi
│   ├── repositories/            # Prisma/DB Repository Implementations (Adapters)
│   └── mappers/                 # Data Mapper chuyển đổi giữa Prisma Model và Domain Entity
└── presentation/                # Giao tiếp người dùng / HTTP API
    ├── controllers/             # NestJS Controllers (chỉ nhận request, gọi use-case, trả response)
    └── dto/                     # Request Validation DTOs (sử dụng class-validator, class-transformer)
```

---

## 2. Quy Tắc Áp Dụng 5 Nguyên Lý SOLID

### S — Single Responsibility Principle (SRP)
- **Controller**: Chỉ làm nhiệm vụ điều hướng HTTP (parse params, validate request, trigger use-case, map status code). KHÔNG chứa logic nghiệp vụ, KHÔNG gọi ORM/Prisma trực tiếp.
- **Use-Case**: Mỗi use-case chỉ thực thi **MỘT** hành động nghiệp vụ cụ thể (vd: `CreateProductUseCase`, `GetProductBySlugUseCase`). Tên file dạng `<action>-<entity>.use-case.ts`.
- **Entity**: Chịu trách nhiệm bảo vệ toàn vẹn dữ liệu (invariants) và logic nghiệp vụ nội tại của đối tượng (vd: `product.deductStock(qty)`).
- **Mapper**: Chuyên trách convert giữa Persistence schema (Prisma) và Domain Entity.

### O — Open/Closed Principle (OCP)
- Mở rộng chức năng bằng cách tạo Use-Case mới hoặc bổ sung implementation mới, không sửa đổi code đang hoạt động ổn định.
- Sử dụng Strategy Pattern hoặc Interfaces khi có nhiều phương thức xử lý (vd: Cổng thanh toán, thông báo, chiến lược tính giá).

### L — Liskov Substitution Principle (LSP)
- Mọi Domain Entity kế thừa từ `BaseEntity<T>` (`src/shared/domain/entity.base.ts`).
- Các implementation repository (`PrismaProductRepository`) phải thay thế hoàn toàn được cho contract interface (`IProductRepository`) mà không làm thay đổi tính đúng đắn của Use-Case.

### I — Interface Segregation Principle (ISP)
- Repository Interface chỉ khai báo các phương thức thực sự cần thiết cho nghiệp vụ của aggregate đó.
- Không ép class phải implement những method không sử dụng.

### D — Dependency Inversion Principle (DIP)
- **Quy tắc vàng**: Tầng bên trong (Domain, Application) **KHÔNG ĐƯỢC** import trực tiếp từ tầng bên ngoài (Infrastructure, Prisma client, Framework controllers).
- Use-case phụ thuộc vào **Interface (Abstraction)**, không phụ thuộc vào **Implementation (Prisma)**:
  ```typescript
  // ❌ SAI:
  constructor(private readonly prisma: PrismaService) {}

  // ✅ ĐÚNG:
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}
  ```
- Cung cấp Dependency Injection thông qua Symbol Token trong Module:
  ```typescript
  {
    provide: PRODUCT_REPOSITORY,
    useClass: PrismaProductRepository,
  }
  ```

---

## 3. Quy Chuẩn Code Chi Tiết

### 3.1. Domain Entities (Rich Domain Model)
- Cấm tạo *Anemic Domain Model* (entity chỉ toàn getter/setter rỗng).
- Mọi validation nghiệp vụ (vd: giá không âm, kho không âm, tên không rỗng) phải nằm trong static factory method `create()` của Entity hoặc method nghiệp vụ.
- Bắn ra `DomainException` hoặc `BusinessRuleViolationException` (tại `src/shared/domain/exceptions/`).

### 3.2. Database & Transactions (Unit of Work)
- Không gọi `$transaction` lộn xộn trong Use-Case.
- Khi cần thao tác transaction qua nhiều repository/bảng, sử dụng port `IUnitOfWork` (`src/shared/application/ports/unit-of-work.port.ts`):
  ```typescript
  await this.unitOfWork.execute(async () => {
    await this.productRepo.deductStock(...);
    await this.orderRepo.save(order);
  });
  ```

### 3.3. DTO & Validation
- **Presentation Request DTO**: Đặt tại `presentation/dto/`, dùng `@IsString()`, `@IsNumber()`, `@IsOptional()`,...
- **Application Command/Result DTO**: Đặt tại `application/dto/`, là plain TypeScript types/classes dùng để truyền tải dữ liệu giữa Controller và Use-case.
- Tuyệt đối không để lộ Prisma types hoặc Domain Entity nguyên bản ra response JSON nếu chưa qua serialize hoặc DTO mapper.

### 3.4. Quản lý Lỗi (Exceptions)
- Domain layer ném `BusinessRuleViolationException` / `DomainException`.
- Application layer ném các HttpException phù hợp (`NotFoundException`, `BadRequestException`, `ConflictException`, `UnauthorizedException`).
- `GlobalExceptionFilter` tại `src/shared/presentation/filters/http-exception.filter.ts` sẽ tự động bắt và format response chuẩn:
  ```json
  {
    "statusCode": 400,
    "timestamp": "2026-11-06T...",
    "path": "/api/v1/...",
    "message": "Chi tiết lỗi",
    "error": "Bad Request"
  }
  ```

---

## 4. Checklist Trước Khi Commit/Sinh Code Mới

1. Module mới có đủ 4 tầng (`domain`, `application`, `infrastructure`, `presentation`) không?
2. Có file nào ở `application` hoặc `domain` import trực tiếp `PrismaService` hay `@prisma/client` không? (Nếu có -> Vi phạm DIP, phải sửa lại).
3. Đã đăng ký Symbol Injection Token trong `*.module.ts` chưa?
4. Đã viết Unit Test cho Entity logic và Use-Case chưa (dùng Jest mock repository interface)?

