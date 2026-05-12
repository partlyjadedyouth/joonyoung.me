<script context="module">
	import thumbnail from './NoRe_Write.jpeg?url';

	export const metadata = {
		id: 'nore',
		year: '2024-2025',
		title: 'NoRe: Augmenting Journaling Experience with Generative AI for Music Creation',
		description:
			"Developed NoRe, a system transforms users' written journal entries into emotionally resonant musical compositions",
		thumbnail,
		tags: ['DIS25', 'cross-modal interaction', 'AI-generated music'],
		selected: true,
		role: 'Co-project leader (Project planning, user research, developing, paper writing)',
		links: [
			{ type: 'pdf', url: '/pdfs/dis25nore.pdf' },
			{ type: 'doi', url: 'https://doi.org/10.1145/3715336.3735845' },
			{ type: 'arxiv', url: 'https://arxiv.org/abs/2506.01395' }
		]
	};
</script>

![pipeline](./Fig_prompt_pipeline.png)

This project is an extension of **[Note & Rest](/projects/note-n-rest)**, which was initially developed as coursework, into an HCI academic research.

In the **formative study**, we conducted in-depth interviews to understand journal writers' behaviors and purposes, and collected evaluations of journal-based AI-generated music created using four self-developed prompts.

The research revealed that the main purposes of journaling were **'archiving'** and **'emotion regulation,'** with participants commonly seeking to moderate extreme emotions and achieve a calm state. For journals with positive emotions, participants wanted to maintain and enhance those emotions, while for journals with negative emotions, they preferred to resolve or transform them into positive ones. We confirmed the potential of journal-based AI-generated music to effectively support these emotional coping strategies and identified the prompt that best reflected the emotions and context of the journal.

![hero](./NoRe_overall.jpeg)

Based on this formative study, the research team developed **'NoRe' (Note & Rest),** a journal-based AI music generation app. This system aims to help with emotional expression and self-reflection by creating personalized music based on participants' journals. Participants could choose music according to their emotion regulation strategies and decide whether to include lyrics. During a **7-day in-the-wild evaluation**, we analyzed 50 journals and their corresponding AI-generated music. The results showed that participants found the generated music effectively reflected their journal's emotions and narratives, with particularly high satisfaction for journals containing positive emotions. Participants also reported experiencing better recollection, emotion regulation, and self-understanding through NoRe.

Through this research, we confirmed **the potential of AI-generated music to extend the therapeutic effects of journaling.** However, **challenges such as music customization and privacy protection were also identified.**

The formative study was published in **[Proceedings of HCI Korea 2025](https://conference.hcikorea.org/hcik2025/main/main.asp),** and a full-paper including the whole study process was published in **[DIS 2025](https://dis.acm.org/2025/).**
