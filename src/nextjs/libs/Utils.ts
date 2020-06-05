import crypto from "crypto"

export function getHashString<T extends ArrayBuffer>(data: string, algorithm: string = "sha1"): string {
	return crypto.createHash(algorithm).update(data).digest("hex");
}