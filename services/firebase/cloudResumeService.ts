import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { UserResumeMeta } from '../../types/auth';
import { INITIAL_RESUME_DATA } from '../../constants';
import { ResumeData, DEFAULT_STYLE_SETTINGS } from '../../types';

export function subscribeToUserResumes(
  userId: string, 
  onData: (resumes: UserResumeMeta[]) => void,
  onError?: (err: Error) => void
) {
  const collectionPath = `users/${userId}/resumes`;
  const q = query(collection(db, 'users', userId, 'resumes'), orderBy('updatedAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const resumes: UserResumeMeta[] = [];
    snapshot.forEach((docSnap) => {
      resumes.push(docSnap.data() as UserResumeMeta);
    });
    onData(resumes);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    if (onError) onError(error);
  });
}

export async function saveResumeToCloud(userId: string, resume: UserResumeMeta): Promise<void> {
  const docPath = `users/${userId}/resumes/${resume.id}`;
  try {
    const resumeRef = doc(db, 'users', userId, 'resumes', resume.id);
    const updated: UserResumeMeta = {
      ...resume,
      updatedAt: new Date().toISOString()
    };
    await setDoc(resumeRef, updated, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    throw error;
  }
}

export async function createNewResumeInCloud(
  userId: string, 
  title: string = 'Executive Software Engineer', 
  targetRole: string = 'Staff / Lead Engineer',
  initialData?: ResumeData
): Promise<UserResumeMeta> {
  const resumeId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docPath = `users/${userId}/resumes/${resumeId}`;
  
  const newResume: UserResumeMeta = {
    id: resumeId,
    userId,
    title,
    targetRole,
    data: initialData ? { ...initialData } : { ...INITIAL_RESUME_DATA, title },
    layoutSettings: {
      paddingTopBottom: 12.7,
      paddingLeftRight: 14.0,
      sectionSpacing: 1.0,
      itemSpacing: 1.0,
      spacingPreset: 'standard'
    },
    styleSettings: DEFAULT_STYLE_SETTINGS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
    await setDoc(resumeRef, newResume);
    return newResume;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
    throw error;
  }
}

export async function duplicateResumeInCloud(
  userId: string, 
  source: UserResumeMeta, 
  newTitle?: string
): Promise<UserResumeMeta> {
  const newId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docPath = `users/${userId}/resumes/${newId}`;

  const duplicated: UserResumeMeta = {
    ...source,
    id: newId,
    title: newTitle || `${source.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const resumeRef = doc(db, 'users', userId, 'resumes', newId);
    await setDoc(resumeRef, duplicated);
    return duplicated;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
    throw error;
  }
}

export async function updateResumeMetadataInCloud(
  userId: string, 
  resumeId: string, 
  updates: { title?: string; targetRole?: string }
): Promise<void> {
  const docPath = `users/${userId}/resumes/${resumeId}`;
  try {
    const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
    await setDoc(resumeRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    throw error;
  }
}

export async function deleteResumeFromCloud(userId: string, resumeId: string): Promise<void> {
  const docPath = `users/${userId}/resumes/${resumeId}`;
  try {
    const resumeRef = doc(db, 'users', userId, 'resumes', resumeId);
    await deleteDoc(resumeRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
    throw error;
  }
}

export async function fetchUserResumesOnce(userId: string): Promise<UserResumeMeta[]> {
  const collectionPath = `users/${userId}/resumes`;
  try {
    const q = query(collection(db, 'users', userId, 'resumes'), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    const results: UserResumeMeta[] = [];
    snapshot.forEach(d => results.push(d.data() as UserResumeMeta));
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionPath);
    throw error;
  }
}
