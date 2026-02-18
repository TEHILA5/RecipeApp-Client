// ===============================================
// Redux Typed Hooks
// ===============================================
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';

// ⭐ Typed hooks - במקום useDispatch ו-useSelector רגילים
// השתמשי באלה בכל הקומפוננטות!

/**
 * Typed useDispatch hook
 * דוגמה: const dispatch = useAppDispatch();
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed useSelector hook
 * דוגמה: const user = useAppSelector((state) => state.auth.user);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;