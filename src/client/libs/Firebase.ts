import * as firebase from 'firebase';
import { Room, Team } from './Models';

try {
	firebase.initializeApp({
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		databaseURL: process.env.FIREBASE_DATABASE_URL,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.FIREBASE_APP_ID
	})
} catch (error) {
	//	console.error('Firebase initialization error', error);
}

const db = firebase.firestore()

export const docToRoom = (doc): Room => {
	return {
		id: doc.id,
		name: doc.get("name"),
		pwd: doc.get("pwd")
	}
}
export const docToTeam = (doc): Team => {
	return {
		id: doc.id,
		name: doc.get("name"),
		color: doc.get("color")
	}
}

export const getTeamsByRoomId = async ({ id, pwd }): Promise<Team[]> => {
	try {
		const doc = await db.collection('rooms').doc(id).get()
		if (doc.get("pwd") !== pwd) {
			throw Error("password incorrect")
		}
		const teams = doc.get("teams")
		return teams.map(t => docToTeam(t))
	}
	catch (err) {
		console.log('Error getting documents', err);
		return null;
	};
}
export const findRoomByName = async ({ name, pwd }): Promise<Room[]> => {
	try {
		const snapshot = await db.collection('rooms')
			.where("name", "==", name)
			.where("pwd", "==", pwd)
			.get();
		return snapshot.docs.map(doc => docToRoom(doc))
	}
	catch (err) {
		console.log('Error getting documents', err);
		return null;
	};
}

export default firebase
export { db }

