import firebase from "../firebase/index";
import { doc, collection, getDoc } from "firebase/firestore";
const db = firebase.firestore();
// const auth = firebase.auth();
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
const auth = getAuth();

export const signupUser = async (user) => {
  await createUserWithEmailAndPassword(auth, user.email, user.password).then(
    async () => {
      await db
        .collection("users")
        .doc(user.email)
        .set(user)
        .then(() => {
          console.log("user added successfully");
        })
        .catch(() => {
          console.log("user is not added");
        });
    }
  );
};
export const loginUser = async (user) => {
  await signInWithEmailAndPassword(auth, user.email, user.password);
};

export const allCenters = async () => {
  await db
    .collection("centers")
    .onSnapshot((snapshot) => {
      const hist = snapshot.docs.map((r) => {
        return r.data();
      });
      return hist;
    })
    .catch((err) => {
      return 0;
    });
};

export const getAppointments = async (appointment) => {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const date = `${year}-${month}-${day}`;
  try {
    const docRef = doc(db, "appointments", appointment.name + date);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap, docSnap.data());
    return docSnap.data()["appointments"];
    // return flag
  } catch {
    return [];
  }
};

export const bookAppointment = async (appointment) => {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const date = `${year}-${month}-${day}`;
  var appointments = await getAppointments(appointment);
  if (appointments.length >= 10) {
    return -1;
  }
  let obj = appointments.find((o) => o.email == appointment.email);
  if (obj) {
    return -2;
  }
  appointments.push(appointment);
  const flag = await db
    .collection("appointments")
    .doc(appointment.name + date)
    .set({ appointments })
    .then(() => 1)
    .catch(() => 0);
  return flag;
};
