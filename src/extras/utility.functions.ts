//here I stored all utility functions used globally for my app!
import { Class } from "./custom.types";
import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';

export function httpError<T>(instance: T, exception: Class, msg: string) {
    return instance ? instance : (() => { throw new exception(msg); })();
};

export const scrypt = promisify(_scrypt);