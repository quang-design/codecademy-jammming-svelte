import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const userId = cookies.get('user_id');

	return {
		userId
	};
};
