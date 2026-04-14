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
  Timestamp,
  where,
} from "firebase/firestore";
import { collectionName, db } from "./firebase";

export const createDocumentById = async (
  operationName,
  collectionName,
  docId,
  document,
  messageOnSucces,
) => {
  try {
    console.log(
      `Dev Only | Operation : Create To Replace , Operation Name : ${operationName}`,
    );

    await setDoc(doc(db, collectionName, docId), { ...document });

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

export const createDocument = async (
  operationName,
  collectionName,
  document,
  messageOnSucces,
  customTime = false,
  customMS = Date.now(),
) => {
  try {
    console.log(`Operation : Create , Operation Name : ${operationName}`);
    const docRef = await addDoc(collection(db, collectionName), {
      ...document,
      createdAt: customTime
        ? Timestamp.fromMillis(customMS)
        : serverTimestamp(),
      createdAtMs: customTime ? customMS : Date.now(),
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
      message: error.message,
      error,
    };
  }
};

export const getWithdrawalListByMonth = async (
  platform,
  order,
  year,
  month,
) => {
  const startMonth = new Date(year, month, 1).getTime();
  const endMonth = new Date(year, month + 1, 1).getTime();

  const orderChoice = {
    newToOld: "desc",
    oldToNew: "asc",
  };

  try {
    console.log(
      `Operation : Read , Operation Name : Get Daftar Penghasilan By Month ${platform}`,
    );
    const queryShopee = query(
      collection(db, collectionName.shopeeWithdrawals),
      where("createdAtMs", ">=", startMonth),
      where("createdAtMs", "<", endMonth),
      orderBy("createdAtMs", orderChoice[order]),
    );
    const queryTikTok = query(
      collection(db, collectionName.tiktokWithdrawals),
      where("createdAtMs", ">=", startMonth),
      where("createdAtMs", "<", endMonth),
      orderBy("createdAtMs", orderChoice[order]),
    );

    const snapshot = await getDocs(
      platform === "shopee" ? queryShopee : queryTikTok,
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
      message: error.message,
      error,
    };
  }
};

export const getWithdrawalListByDate = async (platform, order, start, end) => {
  const startDate = start.getTime();
  const date = new Date(end);
  date.setDate(date.getDate() + 2);
  const result = date.toISOString().slice(0, 10);
  const endDate = new Date(result).getTime();

  const orderChoice = {
    newToOld: "desc",
    oldToNew: "asc",
  };

  try {
    console.log(
      `Operation : Read , Operation Name : Get Daftar Penghasilan By Date ${platform}`,
    );
    const queryShopee = query(
      collection(db, collectionName.shopeeWithdrawals),
      where("createdAtMs", ">=", startDate),
      where("createdAtMs", "<", endDate),
      orderBy("createdAtMs", orderChoice[order]),
    );
    const queryTikTok = query(
      collection(db, collectionName.tiktokWithdrawals),
      where("createdAtMs", ">=", startDate),
      where("createdAtMs", "<", endDate),
      orderBy("createdAtMs", orderChoice[order]),
    );

    const snapshot = await getDocs(
      platform === "shopee" ? queryShopee : queryTikTok,
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
      message: error.message,
      error,
    };
  }
};

export const getWithdrawalList = async (platform, order, limitOffPage) => {
  const orderChoice = {
    newToOld: "desc",
    oldToNew: "asc",
  };

  try {
    console.log(
      `Operation : Read , Operation Name : Get Daftar Penghasilan ${platform}`,
    );
    const queryShopee = query(
      collection(db, collectionName.shopeeWithdrawals),
      orderBy("createdAtMs", orderChoice[order]),
      limit(limitOffPage),
    );
    const queryTikTok = query(
      collection(db, collectionName.tiktokWithdrawals),
      orderBy("createdAtMs", orderChoice[order]),
      limit(limitOffPage),
    );

    const snapshot = await getDocs(
      platform === "shopee" ? queryShopee : queryTikTok,
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
      message: error.message,
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

export const deleteCollection = async (collectionName) => {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);

  const deletePromises = snapshot.docs.map((document) =>
    deleteDoc(doc(db, collectionName, document.id)),
  );

  await Promise.all(deletePromises);
  console.log("Collection berhasil dihapus");
};
