
export function firstOf<T>(t: T | T[]): T {
	return Array.isArray(t) ? t[0] : t
}
