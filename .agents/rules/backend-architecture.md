---
description: NestJS Clean Architecture and SOLID Guidelines for Backend Development
globs: src/**/*.ts
alwaysApply: true
---

# Backend NestJS Clean Architecture & SOLID Rules

Dự án này sử dụng mô hình **Clean Architecture + DDD Lite** với 4 tầng:

1. **Domain Layer (`domain/`)**:
   - Entities: Kế thừa `BaseEntity<T>`, chứa business invariants trong static `create()` và các methods nghiệp vụ.
   - Repositories: Chỉ chứa `interface I<Entity>Repository` và `Symbol('<ENTITY>_REPOSITORY')`. Tuyệt đối không import thư viện ngoài hoặc framework.

2. **Application Layer (`application/`)**:
   - Use-Cases: Mỗi use-case là 1 class đơn lẻ có method `execute()`.
   - Phụ thuộc vào Repository thông qua `@Inject(<ENTITY>_REPOSITORY) private readonly repo: I<Entity>Repository`.
   - Giao dịch liên module/bảng sử dụng `IUnitOfWork`.

3. **Infrastructure Layer (`infrastructure/`)**:
   - Chứa `Prisma<Entity>Repository` implement `I<Entity>Repository`.
   - Chứa `<Entity>Mapper` để ánh xạ giữa Prisma Schema và Domain Entity.

4. **Presentation Layer (`presentation/`)**:
   - Controllers: Nhận HTTP request, gọi use-case tương ứng và trả response.
   - Không được inject `PrismaService` vào controller.
   - DTO request dùng `class-validator`.

## Các nguyên tắc cấm kỵ (Violations):
- KHÔNG import `@prisma/client` hoặc `PrismaService` bên trong `domain/` hoặc `application/`.
- KHÔNG viết logic nghiệp vụ trong Controller.
- KHÔNG bỏ qua DTO validation.
- KHÔNG để Entity thành Anemic (phải đóng gói invariant validation).

