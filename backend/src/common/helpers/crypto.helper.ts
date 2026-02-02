import * as bcrypt from 'bcrypt';

export class CryptoHelper {
  static async hashPassword(
    password: string,
    saltRounds: number,
  ): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
