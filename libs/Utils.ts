import crypto from "crypto"

export function firstOf<T>(t: T | T[]): T {
	return Array.isArray(t) ? t[0] : t
}
export function firstOfMap<K, V>(t: Map<K, V>): [K, V] {
	return (t && t.size !== 0) ? t.entries().next().value : null
}
export function firstOfObject(t: Object, keys: string[]): any {
	return keys.reduce(
		(acc, key) => ({ ...acc, [key]: firstOf(t[key]) }),
		{})
}

export function pairToMap<K, V>(pair: [K, V]): Map<K, V> {
	return new Map<K, V>([pair])
}
export function mapToArray<K, V>(t: Map<K, V>, keyOfKey: string = "id"): {}[] {
	const iterator = t.entries()
	let value
	const ret = []

	while (value = iterator.next().value) {
		ret.push({ [keyOfKey]: value[0], ...value[1] })
	}
	return ret
}
export function objectToArray(t: object, keyOfKey: string = "id"): {}[] {
	return Object.entries(t).map(([k, v]) => ({ [keyOfKey]: k, ...v }))
}
export function arrayToObject(t: [], key: string = "id"): {} {
	const ret = {}
	t.forEach(t => {
		ret[t[key]] = t
	})
	return ret
}

export function filterProp<T>(dict: Map<string | number, T>, key: string, value: any): Map<string | number, T> {
	return Object.entries(dict).reduce(
		(acc, [k, v]) => {
			if (v.hasOwnProperty(key) && v[key] === value) {
				acc.set(k, v)
			}
			return acc
		}
		, new Map<string | number, T>())
}

export function findByProps<T>(target: T[], props: {}): T[] {
	return target.filter(t =>
		Object.entries(props).every(([k, v]) => t[k] === v)
	)
}
export function findOneByProps<T>(target: T[], props: {}): T {
	const found = findByProps(target, props)
	return found.length > 0 ? found[0] : null
}

export function getHashString<T extends ArrayBuffer>(data: string, algorithm: string = "sha1"): string {
	return crypto.createHash(algorithm).update(data).digest("hex");
}