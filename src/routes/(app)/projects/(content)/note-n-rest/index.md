<script context="module">
	import thumbnail from './thumbnail.png?url';
	import slides from './nnr_slides.pdf?url';
	import poster from './nnr_poster.pdf?url';

	export const metadata = {
		id: 'note-n-rest',
		year: '2024',
		title: 'Note & Rest',
		description:
			'Designed an AI solution to help users take care of mental well-being by extracting emotions through human-AI interaction and generate diaries and music.',
		thumbnail,
		tags: ['coursework', 'design'],
		role: 'Service design, UI/UX design',
		links: [
			{ type: 'pdf', url: slides },
			{ type: 'poster', url: poster },
			{ type: 'web', url: 'https://0804cji.wixsite.com/notenrest' }
		]
	};
</script>

![hero](./note-n-rest.png)

**Journaling** can help people identify patterns in their emotions and daily life (Kidman, 1996). It also supports acceptance and adaptation to various situations, contributing significantly to mental well-being (Bulman, 2012). However, many people are reluctant to spend time on journaling (Keech, 2021) and **find it challenging to develop a regular journaling habit due to psychological and cognitive burdens** (Ullrich, 2002).

Similarly, **music** has long been used for therapeutic purposes (Hooper, 2008). Specifically, music recommendations based on daily emotions have been found to not only increase user satisfaction with the recommendations but also benefit mental health (Cai, 2023). However, **the process of reflecting on one's emotions and finding music that matches those emotions can be quite cumbersome,** making it difficult for people to use music to care for their mental well-being.

![ui-design](./ui.png)

**Note&Rest** is designed to overcome these challenges through **human-AI interaction.** Using a large language model (LLM) with natural language processing capabilities, **it interacts with the user via voice or text to extract the emotions experienced throughout the day.** Based on the extracted emotions, **it generates a short emotional journal of about five sentences and a piece of music.**

The goal of Note&Rest is to **provide mental therapy by allowing users to end their day by listening to the generated music and reading the journal entry.** Additionally, Note&Rest includes features such as visualizing emotional changes using musical scores and emotion icons, and creating playlists of previously generated music categorized by emotions.

The Note&Rest project was developed under the premise of **designing a near-future service to be launched in 2025.** My colleagues and I conducted literature reviews, explored the potential role of AI, established mental models, and designed the UI/UX to concretize the service. Through this process, I learned about **the social changes, opportunities, challenges, and implications that AI can bring.** By planning a real product that applies human-AI interaction, I also gained **a deeper understanding of HAI (Human-AI Interaction).**

![poster](./nnr_poster.png)_The poster that I created using gen-AI_

This design work was submitted as coursework for **Creative Research Practice** course at Dept. of Information Science and Culture Studies, Seoul National University.
