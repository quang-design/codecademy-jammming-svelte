import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const userId = cookies.get('user_id');
	const accessToken = cookies.get('spotify_access_token');

	return {
		userId,
		isAuthenticated: Boolean(accessToken)
	};
};
