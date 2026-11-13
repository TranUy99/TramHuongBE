export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class BusinessRuleViolationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationException';
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} với định danh "${identifier}" không tồn tại.`);
    this.name = 'EntityNotFoundException';
  }
}

export class InsufficientStockException extends DomainException {
  constructor(productName: string, available: number, requested: number) {
    super(`Sản phẩm "${productName}" chỉ còn ${available} trong kho (yêu cầu: ${requested}).`);
    this.name = 'InsufficientStockException';
  }
}

