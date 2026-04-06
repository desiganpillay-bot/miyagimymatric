import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  // After Supabase handles the auth token in the URL hash, go to dashboard
  throw redirect(303, '/dashboard');
};
