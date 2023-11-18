import bcrypt from "bcryptjs";
import * as crypto from "crypto";

export async  function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        reject(new Error(`error hashing password: ${err.message}`));
      }
      resolve(hash);
    });
  });
}

export async function generateVerificationCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Generate a random UUID using crypto
      const part1 = crypto.randomUUID();
      const part2 = crypto.randomUUID();
      const vCode = `${part1}${part2}`.replace(/-/g, "");
      resolve(vCode);
    } catch (error: any) {
      reject(new Error(`error generating verification code: ${error.message}`));
    }
  });
}

export function testPassword(password: string) {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  return passwordPattern.test(password);
}

export function testEmail(email: string) {
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailPattern.test(email.trim());
}
export function testFullName(fullName: string) {
  const invalidCharacters = /[^a-zA-Z\s]/;
  return !invalidCharacters.test(fullName);
}
