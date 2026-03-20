import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import type { UserData } from "../models/UserData";

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<UserData>>({
    firstname: "",
    surname: "",
    age: null,
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [liveUsers, setLiveUsers] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data() as UserData;
          setProfile({
            firstname: userData.firstname,
            surname: userData.surname,
            age: userData.age,
          });
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    const usersCollection = collection(db, "users");

    if (liveUsers) {
      const unsubscribe = onSnapshot(
        usersCollection,
        (snapshot) => {
          const usersList: UserData[] = [];
          snapshot.forEach((userDoc) => {
            usersList.push(userDoc.data() as UserData);
          });
          setUsers(usersList);
        },
        (error) => {
          console.error("Error listening to users:", error);
        },
      );

      return () => unsubscribe();
    }

    const fetchAllUsers = async () => {
      try {
        const querySnapshot = await getDocs(usersCollection);
        const usersList: UserData[] = [];
        querySnapshot.forEach((userDoc) => {
          usersList.push(userDoc.data() as UserData);
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, [liveUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (user) {
      setSaving(true);
      setSaveError("");
      try {
        const updateData: Partial<UserData> = {
          firstname: profile.firstname,
          surname: profile.surname,
          age: profile.age,
        };
        await updateDoc(doc(db, "users", user.uid), updateData);
        setEditMode(false);
      } catch (error: any) {
        setSaveError(error.message || "Failed to save profile");
        console.error("Error saving profile:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your profile and account? This cannot be undone.",
    );

    if (!confirmed) return;

    setDeleting(true);
    setDeleteError("");

    try {
      // Delete Firestore document
      await deleteDoc(doc(db, "users", user.uid));

      // Delete Firebase auth user
      await deleteUser(user);

      // Sign out user
      await signOut(auth);
    } catch (error: any) {
      setDeleteError(error.message || "Failed to delete profile");
      console.error("Error deleting profile:", error);
      setDeleting(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setDeleteError("");

    try {
      await signOut(auth);
    } catch (error: any) {
      setDeleteError(error.message || "Failed to sign out");
      console.error("Error signing out:", error);
      setSigningOut(false);
    }
  };

  if (loading) return <div className="text-white">Loading profile...</div>;

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Users List */}
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
          <label className="inline-flex items-center gap-3 text-sm font-medium text-gray-700">
            <span>Live Data</span>
            <button
              type="button"
              role="switch"
              aria-checked={liveUsers}
              onClick={() => setLiveUsers((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                liveUsers ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  liveUsers ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>
        </div>
        {users.length === 0 ? (
          <p className="text-gray-600">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-gray-700 font-semibold">
                    Email
                  </th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">
                    Firstname
                  </th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">
                    Surname
                  </th>
                  <th className="px-4 py-2 text-gray-700 font-semibold">Age</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData) => (
                  <tr
                    key={userData.uid}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {userData.email}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {userData.firstname || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {userData.surname || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {userData.age || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">User Profile</h2>
        {saveError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-5 rounded text-sm">
            {saveError}
          </div>
        )}
        {deleteError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-5 rounded text-sm">
            {deleteError}
          </div>
        )}
        {editMode ? (
          <div className="space-y-4">
            <input
              name="firstname"
              value={profile.firstname || ""}
              onChange={handleChange}
              placeholder="Firstname"
              className="w-full rounded-xl px-3 py-2 text-gray-900 bg-black/10 font-bold"
            />
            <input
              name="surname"
              value={profile.surname || ""}
              onChange={handleChange}
              placeholder="Surname"
              className="w-full rounded-xl px-3 py-2 text-gray-900 bg-black/10 font-bold"
            />
            <input
              name="age"
              value={profile.age || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  age: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="Age"
              type="number"
              className="w-full rounded-xl px-3 py-2 text-gray-900 bg-black/10 font-bold"
            />
            <button
              type="button"
              disabled={saving}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <div className="space-y-2 text-black">
            <div>
              <strong>Firstname:</strong> {profile.firstname || "—"}
            </div>
            <div>
              <strong>Surname:</strong> {profile.surname || "—"}
            </div>
            <div>
              <strong>Age:</strong> {profile.age || "—"}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <button
                type="button"
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteProfile}
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
              <button
                type="button"
                disabled={signingOut}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSignOut}
              >
                {signingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
