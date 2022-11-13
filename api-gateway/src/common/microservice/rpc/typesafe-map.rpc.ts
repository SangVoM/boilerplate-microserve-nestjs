/**
 * This class lets you define a type-safe key to use with TypeSafe maps, such as
 * the RPC context custom data map.
 *
 * To use this class, simply instantiate a const key (which you may want to export)
 *
 * ```typescript
 * export const MyExtraInfo =
 *   new TypesafeKey<ExtraInfoInterface>('myapp:info:ExtraInfo');
 * ```
 *
 * Note that you must take care to use a unique namespace string for the key.
 *
 * You can now use the key like so:
 *
 * ```typescript
 * import {MyExtraInfo} from './local-module'
 *
 * someMap.set(MyExtraInfo, ObjectOfExtraInfoInterface)
 *
 * someMap.get(MyExtraInfo)
 * // result is of type ExtraInfoInterface | undefined
 * ```
 */
export class TypesafeKey<T> {
  private ' __brand'!: T;

  constructor(private namespace: string) {}

  toString() {
    return this.namespace;
  }
}

export class TypesafeMap {
  private map = new Map();

  /**
   * Retreive a typesafe value stored in the map
   * @param key the {@link TypesafeKey} to retreive a value for
   */
  get<T>(key: TypesafeKey<T>): T | undefined {
    return this.map.get(key.toString());
  }

  /**
   * Set a typesafe value
   * @param key the {@link TypesafeKey} to set the value for
   * @param value the actual value. Must be of the correct type
   */
  set<T>(key: TypesafeKey<T>, value: T) {
    this.map.set(key.toString(), value);
    return this;
  }

  /**
   * Delete a typesafe value stored in the map
   * @param key the {@link TypesafeKey} to delete
   */
  delete<T>(key: TypesafeKey<T>) {
    return this.map.delete(key.toString());
  }

  /**
   * Check if the map has a value set for the typesafe key
   * @param key the {@link TypesafeKey} to check
   */
  has<T>(key: TypesafeKey<T>) {
    return this.map.has(key.toString());
  }
}
