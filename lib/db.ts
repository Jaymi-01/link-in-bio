import { db } from "./firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  writeBatch
} from "firebase/firestore";

// Private User Profile (users/{uid})
export interface UserProfile {
  uid: string;
  email: string | null;
  username: string;
  photoURL: string | null;
  createdAt: number;
}

// Public Profile (usernames/{username})
export interface PublicProfile {
  uid: string;
  username: string;
  photoURL: string | null;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  order: number;
  createdAt: number;
}

// Check if a username is already taken
export async function checkUsernameExists(username: string): Promise<boolean> {
  const docRef = doc(db, "usernames", username);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

// Get private user profile by UID (Only for authenticated user)
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

// Get public profile by Username (Publicly accessible)
export async function getUserByUsername(username: string): Promise<PublicProfile | null> {
  const docRef = doc(db, "usernames", username);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as PublicProfile;
  }
  return null;
}

// Create user profile (Batch write to both collections)
export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  if (!data.username) throw new Error("Username is required");
  
  const batch = writeBatch(db);
  
  // 1. Private Profile
  const userRef = doc(db, "users", uid);
  batch.set(userRef, { ...data, uid }, { merge: true });

  // 2. Public Mapping
  const usernameRef = doc(db, "usernames", data.username);
  batch.set(usernameRef, {
    uid: uid,
    username: data.username,
    photoURL: data.photoURL || null
  });

  await batch.commit();
}

// --- Links ---

// Add a new link
export async function addLink(uid: string, title: string, url: string) {
  // Get current count to determine order
  const linksRef = collection(db, "users", uid, "links");
  const snapshot = await getDocs(linksRef);
  const order = snapshot.size;

  await addDoc(linksRef, {
    title,
    url,
    order,
    createdAt: Date.now()
  });
}

// Get all links for a user (Publicly accessible)
export async function getUserLinks(uid: string): Promise<LinkItem[]> {
  const linksRef = collection(db, "users", uid, "links");
  const q = query(linksRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LinkItem));
}

// Delete a link
export async function deleteLink(uid: string, linkId: string) {
  await deleteDoc(doc(db, "users", uid, "links", linkId));
}

// Update a link
export async function updateLink(uid: string, linkId: string, data: Partial<LinkItem>) {
  await updateDoc(doc(db, "users", uid, "links", linkId), data);
}
