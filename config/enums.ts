class Enum<T extends string | number | boolean> {
  public value: T;
  public key: string;
  constructor(name: string, value: T) {
    this.value = value;
    this.key = name;
  }
  getValue(): T {
    return this.value;
  }
  getKey(): string {
    return this.key;
  }
}

/**
 * 全局枚举（与环境无关）
 */
const enums = {
  USER: {
    STATUS: {
      RESIGNED: new Enum<number>("已离职", 0),
      EMPLOYED: new Enum<number>("在职", 1),
    },
  },
} as const;

export { Enum, enums };
