import { getAllPosts } from './_data';

export function load() {
	return { posts: getAllPosts() };
}
