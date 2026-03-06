import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const createDocument = async (
  operationName,
  collectionName,
  document,
  messageOnSucces,
) => {
  try {
    console.log(`Operation : Create , Operation Name : ${operationName}`);
    const docRef = await addDoc(collection(db, collectionName), {
      ...document,
      createdAt: serverTimestamp(),
      createdAtMs: Date.now(),
    });

    return {
      success: true,
      message: messageOnSucces,
      docId: docRef.id,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

export const deleteDocument = async (
  operationName,
  collectionName,
  docId,
  messageOnSucces,
) => {
  try {
    console.log(`Operation : Delete , Operation Name : ${operationName}`);
    const ref = doc(db, collectionName, docId);
    await deleteDoc(ref);

    return {
      success: true,
      message: messageOnSucces,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

export const updateDocument = async (
  operationName,
  collectionName,
  docId,
  newDocument,
  messageOnSucces,
) => {
  try {
    console.log(`Operation : Update , Operation Name : ${operationName}`);
    await setDoc(doc(db, collectionName, docId), newDocument, { merge: true });

    return {
      success: true,
      message: messageOnSucces,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

export const getDocuments = async (operationName, collectionName, order) => {
  const orderChoice = {
    newToOld: "desc",
    oldToNew: "asc",
  };

  try {
    console.log(`Operation : Read , Operation Name : ${operationName}`);
    const q = query(
      collection(db, collectionName),
      orderBy("createdAtMs", orderChoice[order]),
    );

    const snapshot = await getDocs(q);

    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const getDaftarPenghasilan = async (typePenghasilan, order) => {
  const orderChoice = {
    newToOld: "desc",
    oldToNew: "asc",
  };

  try {
    console.log(
      `Operation : Read , Operation Name : Get Daftar Penghasilan ${typePenghasilan}`,
    );
    const queryShopee = query(
      collection(db, "penghasilanJualanOnlineShopee"),
      orderBy("createdAtMs", orderChoice[order]),
      limit(limit ? limit : 10),
    );
    const queryTikTok = query(
      collection(db, "penghasilanJualanOnlineTikTok"),
      orderBy("createdAtMs", orderChoice[order]),
      limit(limit ? limit : 10),
    );

    const snapshot = await getDocs(
      typePenghasilan === "shopee" ? queryShopee : queryTikTok,
    );

    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const getDocument = async (
  operationName,
  collectionName,
  documentId,
) => {
  try {
    console.log(`Operation : Read , Operation Name : ${operationName}`);
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        data: docSnap.data(),
      };
    } else {
      return {
        success: false,
        message: "Dokumen Tidak Ditemukan",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};
