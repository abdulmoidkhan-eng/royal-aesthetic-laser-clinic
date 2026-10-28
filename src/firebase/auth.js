import { getAuth } from 'firebase/auth';
import app, { setAuthInstance } from './config.js';

export const auth = getAuth(app);
setAuthInstance(auth);
export default auth;
