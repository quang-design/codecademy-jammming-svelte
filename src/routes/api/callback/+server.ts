import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	console.log(request.url);
	return new Response('Hello');
};
