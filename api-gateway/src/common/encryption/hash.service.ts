import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  private saltOrRounds = 10;

  /**
   * Make hash
   * @param str
   */
  public make(str: string): string {
    return bcrypt.hashSync(str, this.saltOrRounds);
  }

  /**
   * Compare hash
   * @param str
   * @param hash
   */
  public compare(str: string, hash: string): boolean {
    return bcrypt.compareSync(str, hash);
  }
}
