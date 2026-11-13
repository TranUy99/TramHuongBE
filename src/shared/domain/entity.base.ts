export abstract class BaseEntity<T> {
  protected readonly _id: string;
  protected readonly props: T;

  constructor(props: T, id?: string) {
    this._id = id ? id : '';
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  public equals(object?: BaseEntity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!this._id || !object._id) {
      return false;
    }
    return this._id === object._id;
  }
}

