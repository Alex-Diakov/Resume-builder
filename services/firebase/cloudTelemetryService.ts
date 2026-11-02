import { 
  collection, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { ExportActivityEntry, ExportFormat } from '../analytics/analyticsTypes';

export async function recordCloudExport(
  userId: string,
  format: ExportFormat,
  resumeTitle: string = 'Professional Resume',
  resumeId: string = 'active'
): Promise<ExportActivityEntry> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const exportId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docPath = `users/${userId}/exports/${exportId}`;

  const entry: ExportActivityEntry = {
    id: exportId,
    timestamp: now.toISOString(),
    dateStr,
    resumeTitle,
    format
  };

  try {
    const exportRef = doc(db, 'users', userId, 'exports', exportId);
    await setDoc(exportRef, {
      ...entry,
      userId,
      resumeId
    });
    return entry;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
    throw error;
  }
}

export function subscribeToUserCloudExports(
  userId: string,
  onData: (entries: ExportActivityEntry[]) => void,
  onError?: (err: Error) => void
) {
  const collectionPath = `users/${userId}/exports`;
  const q = query(collection(db, 'users', userId, 'exports'), orderBy('timestamp', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const entries: ExportActivityEntry[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        id: data.id || docSnap.id,
        timestamp: data.timestamp,
        dateStr: data.dateStr,
        resumeTitle: data.resumeTitle || 'Resume Export',
        format: data.format as ExportFormat
      });
    });
    onData(entries);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    if (onError) onError(error);
  });
}

export async function fetchUserCloudExportsOnce(userId: string): Promise<ExportActivityEntry[]> {
  const collectionPath = `users/${userId}/exports`;
  try {
    const q = query(collection(db, 'users', userId, 'exports'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const entries: ExportActivityEntry[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        id: data.id || docSnap.id,
        timestamp: data.timestamp,
        dateStr: data.dateStr,
        resumeTitle: data.resumeTitle || 'Resume Export',
        format: data.format as ExportFormat
      });
    });
    return entries;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionPath);
    throw error;
  }
}
