export declare interface AuthConfig {
  initializationVector: string;
  encryptionKey: string;
  expiresIn: number;
  refreshExpiresIn: string;
  ignore: string[];
  publicKey: string;
  privateKey: string;
  iotToken: string;
}
