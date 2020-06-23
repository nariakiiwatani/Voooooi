import crypto from "crypto"

export function getHashString<T extends ArrayBuffer>(data: string, algorithm: string = "sha1"): string {
	return crypto.createHash(algorithm).update(data).digest("hex");
}

export function makeQueryString(params: { [key: string]: string }): string {
	return Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&")
}