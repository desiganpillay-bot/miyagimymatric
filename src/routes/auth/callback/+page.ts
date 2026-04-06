import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  // After Supabase handles the auth token in the URL hash,
  // redirect to the dashboard (or assessment if no profile yet)
  throw redirect(303, '/assessment');
};
