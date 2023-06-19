//here I stored all utility functions used globally for my app!
import { Class } from "./custom.types";

export function httpError<T>(instance: T, exception: Class, msg: string) {
    return instance ? instance : (() => { throw new exception(msg); })();
};