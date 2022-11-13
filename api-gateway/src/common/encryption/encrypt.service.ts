import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptionConfig } from '../config/interface/encryption.config';

@Injectable()
export class EncryptDataService {
  private readonly resizedIV: Buffer;
  private readonly key: Buffer;
  private encryptConfig: EncryptionConfig;

  constructor(private readonly configService: ConfigService) {
    this.encryptConfig = configService.get<EncryptionConfig>('encryption');
    // Initialization vector
    this.resizedIV = Buffer.allocUnsafe(16);

    const iv = crypto
      .createHash('sha256')
      .update(this.encryptConfig.initializationVector)
      .digest();

    iv.copy(this.resizedIV);
    // key
    this.key = crypto
      .createHash('sha256')
      .update(this.encryptConfig.encryptionKey)
      .digest();
  }

  /**
   * Encrypt Data
   * @param data
   * @returns encrypted string
   */
  encrypt(data: string) {
    const cipher = crypto.createCipheriv('aes256', this.key, this.resizedIV);

    const msg = [];
    const buffer = Buffer.from(data, 'utf-8');
    const hexString = buffer.toString('hex');
    msg.push(cipher.update(hexString, 'binary', 'hex'));
    msg.push(cipher.final('hex'));
    return msg.join('');
  }

  /**
   * Decrypt Cipher Text
   *
   * @param {String} ciphertext
   * @returns {String} data text
   */
  decrypt(ciphertext: string) {
    const decipher = crypto.createDecipheriv(
      'aes256',
      this.key,
      this.resizedIV,
    );
    const msg = [];
    msg.push(decipher.update(ciphertext, 'hex', 'binary'));
    msg.push(decipher.final('binary'));
    const rawString = msg.join('');
    const buffer = Buffer.from(rawString, 'hex');
    return buffer.toString('utf-8');
  }
}
