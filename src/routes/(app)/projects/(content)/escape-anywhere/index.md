<script context="module">
	import thumbnail from './escape-anywhere.png?url';

	export const metadata = {
		id: 'escape-anywhere',
		year: '2024',
		title: 'Escape Anywhere',
		description:
			'Developed an escape room game that constantly provides new themes and puzzles using generative AI',
		thumbnail,
		tags: ['coursework', 'game'],
		selected: false,
		role: 'Web development, prompt engineering',
		links: [
			{ type: 'web', url: 'https://escape-anywhere.vercel.app' },
			{ type: 'code', url: 'https://github.com/partlyjadedyouth/escape-anywhere' }
		]
	};
</script>

![thumbnail](./escape-anywhere-thumbnail.png)

Escape room game is a game that makes players solve various puzzles and challenges within a set time to escape from a given room or space. Each room has a specific theme and story, making the experience more immersive. Clues and hints are hidden throughout the room, and players must find and decipher them to complete their mission.

However, most escape room games have **fixed themes, stories, and types of puzzles,** which means once you've played them, you might not want to play them again. Also, **you have to visit the escape room venue in person to enjoy the game.** If the venue is far away, it can be a long journey, and if something like a pandemic happens, gathering multiple people in one place becomes impossible. During the COVID-19 pandemic, escape room games using chat applications became popular, and even now, many mobile puzzle games incorporate escape room concepts to provide simulations. Yet, these games also fail to address the problem of fixed themes, stories, and puzzles.

![play](./escape-play.png)

My colleagues and I saw **the potential of generative AI** to solve these issues. With LLM (GPT-4o), **brand-new themes and puzzles for escape rooms can be automatically generated,** and players can interact with the AI via chat to solve problems and escape the rooms. Additionally, an image generation AI (DALL-E 3) can **create images of each room,** making players feel like they’re actually inside the rooms.

![prompt](./escape-prompt.png)_Part of the prompt we wrote_

To make this happen, our team set up **various mechanisms through prompt engineering.** For example, if players need hints, **we help them solve problems without giving away direct solutions.** We also used techniques like **reminders to prevent jailbreaks, ensuring players don’t escape without solving the puzzles.** We even created a system to **adjust puzzle difficulty** appropriately. By having the LLM output responses in JSON format, we could implement **room transitions and game endings.**

Through this project, I learned a lot about **the art of prompt engineering.** I also realized **the incredible potential of generative AI,** as it can set different stories, themes, and puzzles each time.
