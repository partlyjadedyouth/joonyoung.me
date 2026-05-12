export interface LinkDetails {
	type: string;
	url: string;
}

export interface Project {
	id: string;
	year: string;
	title: string;
	description: string;
	thumbnail: string;
	tags: string[];
	role: string;
	award?: string;
	links: LinkDetails[];
}

export interface BlogPost {
	id: string;
	date: string;
	title: string;
	description: string;
	thumbnail?: string;
}
