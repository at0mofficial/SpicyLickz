import bcrypt from "bcryptjs";
import * as crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;

  return new Promise(async (resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.error(`error hashing password: ${err.message}`);
        reject(new Error(`${err}`));
        return;
      }
      resolve(hash);
    });
  });
}

export async function comparePassword(
  userPass: string,
  hashPass: string
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    bcrypt.compare(userPass, hashPass, function (err, result) {
      if (err) {
        console.error(`error hashing password: ${err.message}`);
        reject(new Error(`${err}`));
      }
      resolve(result);
    });
  });
}
export async function generateVerificationCode(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Generate a random UUID using crypto
      const part1 = crypto.randomUUID();
      const part2 = crypto.randomUUID();
      const vCode = `${part1}${part2}`.replace(/-/g, "");
      resolve(vCode);
    } catch (err: any) {
      console.error(`Error generating verification Code: ${err.message}`);
      reject(new Error(`${err}`));
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
