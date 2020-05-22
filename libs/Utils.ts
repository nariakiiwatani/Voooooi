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

export function filter<T>(dict: Map<string | number, T>, key: string | number): T[] {
	return Object.entries(dict).reduce((acc, [k, v]) => {
		if (key === k) acc.push(v)
		return acc
	}, [])
}

export function filterProp<T>(dict: Map<string | number, T>, key: string, value: any): T[] {
	return Object.values(dict).filter(t => t.hasOwnProperty(key) && t[key] === value);
}