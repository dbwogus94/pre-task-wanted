export interface BaseDomainProps {
  uid: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseDomain<PROPS> implements BaseDomainProps {
  protected props: PROPS;

  #uid: string;
  #id: number;
  #createdAt: Date;
  #updatedAt: Date;

  protected constructor(props: PROPS) {
    this.props = props;
  }

  get uid(): string {
    return this.#uid;
  }

  get id(): number {
    return this.#id;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  setBase(uid: string, id: number, createdAt: Date, updatedAt: Date) {
    this.#uid = uid;
    this.#id = id;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    return this;
  }
}
