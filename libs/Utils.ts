export function firstOf<T>(t: T | T[]): T {
	return Array.isArray(t) ? t[0] : t
}

export function firstOfObject(t: Object, keys: string[]): any {
	return keys.reduce(
		(acc, key) => ({ ...acc, [key]: firstOf(t[key]) }),
		{})
}

export function values(t: object, keys: string[]): object {
	return keys.reduce(
		(acc, key) => ({ ...acc, [key]: t[key] }),
		{})
}