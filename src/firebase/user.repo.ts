import { deleteUser, signOut } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import type { UserData } from "../models/UserData";
import { auth, db } from "./config";

const usersCollection = collection(db, "users");

function mapUsersSnapshot(
  snapshot: Awaited<ReturnType<typeof getDocs>>,
): UserData[] {
  const users: UserData[] = [];
  snapshot.forEach((userDoc) => {
    users.push(userDoc.data() as UserData);
  });
  return users;
}

export async function createEmptyUserProfile(user: User): Promise<UserData> {
  const profile: UserData = {
    uid: user.uid,
    email: user.email || "",
    firstname: "",
    surname: "",
    age: null,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, "users", user.uid), profile);
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserData | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data() as UserData;
}

export async function updateUserProfile(
  uid: string,
  payload: Partial<Pick<UserData, "firstname" | "surname" | "age">>,
): Promise<void> {
  await updateDoc(doc(db, "users", uid), payload);
}

export async function deleteUserProfile(uid: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid));
}

export async function getAllUsers(): Promise<UserData[]> {
  const snapshot = await getDocs(usersCollection);
  return mapUsersSnapshot(snapshot);
}

export function subscribeToUsers(
  onUsers: (users: UserData[]) => void,
  onError?: (error: Error) => void,
): () => void {
  return onSnapshot(
    usersCollection,
    (snapshot) => {
      onUsers(
        mapUsersSnapshot(snapshot as Awaited<ReturnType<typeof getDocs>>),
      );
    },
    (error) => {
      if (onError) {
        onError(error as Error);
      }
    },
  );
}

export async function signOutCurrentUser(): Promise<void> {
  await signOut(auth);
}

export async function deleteAuthUser(user: User): Promise<void> {
  await deleteUser(user);
}

export async function deleteProfileAndAccount(user: User): Promise<void> {
  await deleteUserProfile(user.uid);
  await deleteAuthUser(user);
  await signOutCurrentUser();
}
