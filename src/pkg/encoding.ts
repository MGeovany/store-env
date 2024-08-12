import { fromBase58, toBase58 } from "@/util/base58";
import { ENCRYPTION_KEY_LENGTH, ID_LENGTH } from "./constants";

/**
 * To share links easily, we encode the id, where the data is stored in redis, together with the secret encryption key.
 */
export function encodeCompositeKey(
  version: number,
  id: string,
  encryptionKey: Uint8Array
): string {
  if (version < 0 || version > 255) {
    throw new Error("Version must fit in a byte");
  }

  const idArray = Array.from(fromBase58(id));
  const encryptionKeyArray = Array.from(encryptionKey);

  const compositeKey = new Uint8Array([
    version,
    ...idArray,
    ...encryptionKeyArray,
  ]);

  return toBase58(compositeKey);
}

/**
 * To share links easily, we encode the id, where the data is stored in redis, together with the secret encryption key.
 */
export function decodeCompositeKey(compositeKey: string): {
  id: string;
  encryptionKey: Uint8Array;
  version: number;
} {
  const decoded = fromBase58(compositeKey);
  const version = decoded.at(0);

  if (version === 1 || version === 2) {
    return {
      id: toBase58(decoded.slice(1, 1 + ID_LENGTH)),
      encryptionKey: decoded.slice(
        1 + ID_LENGTH,
        1 + ID_LENGTH + ENCRYPTION_KEY_LENGTH
      ),
      version,
    };
  }

  throw new Error(`Unsupported composite key version: ${version}`);
}
