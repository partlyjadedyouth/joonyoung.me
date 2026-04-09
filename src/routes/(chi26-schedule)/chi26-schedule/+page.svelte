<script lang="ts">
	/**
	 * [(chi26-schedule)/chi26-schedule/+page.svelte]
	 * CHI 2026 Conference Schedule — week-view calendar planner.
	 *
	 * Left panel  → searchable session browser; click a session to see papers, then add papers to calendar.
	 * Right panel → Mon–Fri week-view calendar grid showing selected papers.
	 *
	 * "Export .ics" downloads all selected papers in CET (Europe/Berlin).
	 */

	import { browser } from '$app/environment';
	import sessionsData from '$lib/data/chi26-sessions.json';

	// ─── Types ────────────────────────────────────────────────────────

	/** Author within a paper */
	interface Author {
		name: string;
		affiliation: string;
	}

	/** A paper / presentation within a session */
	interface Paper {
		id: string;
		title: string;
		authors: Author[];
		abstract: string;
		startTime: string | null;
		endTime: string | null;
		type: string;
		awards: string[];
	}

	/** A conference session containing papers */
	interface Session {
		id: string;
		title: string;
		type: string;
		chairs: Author[];
		room: string;
		date: string;
		startTime: string | null;
		endTime: string | null;
		rawTime: string;
		papers: Paper[];
	}

	/** A paper enriched with its parent session's metadata for the calendar */
	interface CalendarPaper extends Paper {
		sessionId: string;
		sessionTitle: string;
		sessionType: string;
		room: string;
		date: string;
		_key: string;
	}

	// ─── Constants ────────────────────────────────────────────────────

	/** Conference days with ISO dates and labels */
	const DAYS = [
		{ iso: '2026-04-13', short: 'Mon 13', long: 'Mon, Apr 13' },
		{ iso: '2026-04-14', short: 'Tue 14', long: 'Tue, Apr 14' },
		{ iso: '2026-04-15', short: 'Wed 15', long: 'Wed, Apr 15' },
		{ iso: '2026-04-16', short: 'Thu 16', long: 'Thu, Apr 16' },
		{ iso: '2026-04-17', short: 'Fri 17', long: 'Fri, Apr 17' }
	];

	/** Accent colour per session type (names from official SIGCHI data) */
	const TYPE_COLORS: Record<string, string> = {
		Paper: '#3b82f6',
		Workshop: '#8b5cf6',
		'Plenary and Keynote': '#06b6d4',
		Event: '#f59e0b',
		Panels: '#10b981',
		'Meet-Ups': '#ec4899',
		Journals: '#6366f1',
		Posters: '#14b8a6',
		'Student Mentoring Program': '#f97316',
		'Global Science Program': '#84cc16',
		'Global Plaza': '#a855f7',
		'Interactive Demos': '#0ea5e9',
		'SIGCHI Awards': '#e11d48',
		'Student Research Competition': '#d946ef',
		Course: '#64748b',
		unspecified: '#9ca3af'
	};

	/** Minimum pixels per minute — scales up when the time range is narrow */
	const MIN_PX = 1.2;
	/** Minimum grid height in pixels (ensures usability) */
	const MIN_GRID_PX = 500;
	/** Maximum grid height in pixels — fits calendar within its sticky container.
	 *  Container is max-height:calc(100vh - 6rem); day headers ~34px; border 2px. */
	const MAX_GRID_PX = browser ? window.innerHeight - 96 - 36 : 600;

	/** Hour-label generator */
	function hourLabel(h: number): string {
		return h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
	}

	// ─── Data ─────────────────────────────────────────────────────────

	/** All sessions from the official SIGCHI program data */
	const sessions: Session[] = sessionsData as Session[];
	/** All unique types for the filter dropdown */
	const allTypes = [...new Set(sessions.map((s) => s.type))].filter(Boolean).sort();

	// ─── State ────────────────────────────────────────────────────────

	/** Search query for session browser */
	let searchQuery = $state('');
	/** Type filter */
	let selectedType = $state('');
	/** Day filter for the session browser (empty = all days) */
	let browserDay = $state('');
	/** Set of paper IDs added to the calendar (using "sessionId:paperIdx" as key).
	 *  Initialised from the URL query string (?s=key1,key2,...) if present. */
	let selectedPapers = $state<Set<string>>(initSelectionFromURL());
	/** Whether the "Copied!" toast is showing */
	let copiedToast = $state(false);
	/** Whether the reset confirmation prompt is visible */
	let showResetConfirm = $state(false);
	/** Currently expanded session in browser (shows papers) */
	let expandedSessionId = $state<string | null>(null);
	/** While searching: sessions manually folded by user (default is expanded) */
	let collapsedSearchSessionIds = $state<Set<string>>(new Set());
	/** Paper shown in detail modal */
	let detailPaper = $state<CalendarPaper | null>(null);
	/** Mobile: which panel is visible */
	let showBrowser = $state(true);

	// ─── URL persistence ─────────────────────────────────────────────

	/** Parse the ?s= query param into a Set of paper keys on initial load */
	function initSelectionFromURL(): Set<string> {
		if (!browser) return new Set();
		const params = new URLSearchParams(window.location.search);
		const raw = params.get('s');
		if (!raw) return new Set();
		// Keys are comma-separated "sessionId:paperIdx" strings
		return new Set(raw.split(',').filter(Boolean));
	}

	/** Sync selectedPapers → URL query string whenever it changes */
	$effect(() => {
		if (!browser) return;
		const url = new URL(window.location.href);
		if (selectedPapers.size === 0) {
			// Remove the param entirely when nothing is selected
			url.searchParams.delete('s');
		} else {
			// Encode all selected keys as a comma-separated list
			url.searchParams.set('s', [...selectedPapers].join(','));
		}
		// Update URL without reloading the page
		history.replaceState(history.state, '', url.toString());
	});

	/** Copy the current URL (with selections) to clipboard */
	async function copyURL(): Promise<void> {
		try {
			await navigator.clipboard.writeText(window.location.href);
			copiedToast = true;
			setTimeout(() => (copiedToast = false), 2000);
		} catch {
			// Fallback for older browsers
			const input = document.createElement('input');
			input.value = window.location.href;
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			input.remove();
			copiedToast = true;
			setTimeout(() => (copiedToast = false), 2000);
		}
	}

	/** Clear all selections and reset the calendar */
	function resetAll(): void {
		selectedPapers = new Set();
		showResetConfirm = false;
		expandedSessionId = null;
		collapsedSearchSessionIds = new Set();
		detailPaper = null;
		searchQuery = '';
		selectedType = '';
		browserDay = '';
	}

	/** Reset manual folds whenever search query changes */
	$effect(() => {
		searchQuery;
		collapsedSearchSessionIds = new Set();
	});

	// ─── Derived ─────────────────────────────────────────────────────

	/** Check if a single paper matches the current search query */
	function paperMatchesQuery(p: Paper, q: string): boolean {
		return (
			p.title.toLowerCase().includes(q) ||
			p.authors?.some(
				(a) => a.name.toLowerCase().includes(q) || a.affiliation.toLowerCase().includes(q)
			) ||
			false
		);
	}

	/** Check if session-level fields match the current search query */
	function sessionMatchesQuery(s: Session, q: string): boolean {
		return (
			s.title.toLowerCase().includes(q) ||
			s.chairs.some((c) => c.name.toLowerCase().includes(q)) ||
			s.room.toLowerCase().includes(q) ||
			s.type.toLowerCase().includes(q)
		);
	}

	/** Set of paper keys ("sessionId:idx") that match the current search query */
	let matchingPaperKeys = $derived.by(() => {
		const keys = new Set<string>();
		const q = searchQuery.trim().toLowerCase();
		if (!q) return keys;
		for (const s of sessions) {
			for (let i = 0; i < (s.papers?.length || 0); i++) {
				if (paperMatchesQuery(s.papers[i], q)) {
					keys.add(paperKey(s.id, i));
				}
			}
		}
		return keys;
	});

	/** Whether the search is currently active (non-empty query) */
	let isSearching = $derived(searchQuery.trim().length > 0);

	/** Filtered sessions for the browser */
	let browseSessions = $derived.by(() => {
		let r = sessions;
		if (browserDay) r = r.filter((s) => s.date === browserDay);
		if (selectedType) r = r.filter((s) => s.type === selectedType);
		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			r = r.filter((s) => sessionMatchesQuery(s, q) || s.papers?.some((p) => paperMatchesQuery(p, q)));
		}
		return r;
	});

	/** Build the flat list of CalendarPapers for the calendar grid */
	let calPapers = $derived.by(() => {
		const result: CalendarPaper[] = [];
		for (const s of sessions) {
			for (let i = 0; i < (s.papers?.length || 0); i++) {
				const k = `${s.id}:${i}`;
				if (!selectedPapers.has(k)) continue;
				const p = s.papers[i];
				result.push({
					...p,
					sessionId: s.id,
					sessionTitle: s.title,
					sessionType: s.type,
					room: s.room,
					date: s.date,
					_key: k
				});
			}
		}
		return result;
	});

	/** Papers grouped by day for the week view */
	let papersByDay = $derived.by(() => {
		const map = new Map<string, CalendarPaper[]>();
		for (const d of DAYS) map.set(d.iso, []);
		for (const p of calPapers) {
			if (map.has(p.date)) map.get(p.date)!.push(p);
		}
		return map;
	});

	/** Count of selected papers */
	let selectedCount = $derived(selectedPapers.size);

	/** Dynamic calendar grid: auto-fit to the time range of selected papers */
	let calGrid = $derived.by(() => {
		if (calPapers.length === 0)
			return {
				start: 8,
				end: 20,
				px: MIN_PX,
				h: MIN_GRID_PX,
				hours: [] as { h: number; label: string }[]
			};
		// Find earliest start and latest end across all selected papers
		let earliest = 24 * 60;
		let latest = 0;
		for (const p of calPapers) {
			const s = toMinRaw(p.startTime);
			const e = p.endTime ? toMinRaw(p.endTime) : s + 12;
			if (s < earliest) earliest = s;
			if (e > latest) latest = e;
		}
		// Pad by 1 hour on each side, snap to whole hours
		const startHour = Math.max(0, Math.floor(earliest / 60) - 1);
		const endHour = Math.min(24, Math.ceil(latest / 60) + 1);
		const rangeMin = (endHour - startHour) * 60;
		// Scale px/min: fill at least MIN_GRID_PX but never exceed MAX_GRID_PX
		const px = Math.min(MAX_GRID_PX / rangeMin, Math.max(MIN_PX, MIN_GRID_PX / rangeMin));
		const h = rangeMin * px;
		const hours = Array.from({ length: endHour - startHour }, (_, i) => ({
			h: startHour + i,
			label: hourLabel(startHour + i)
		}));
		return { start: startHour, end: endHour, px, h, hours };
	});

	// ─── Helpers ──────────────────────────────────────────────────────

	/** Minutes from midnight (pure, no dependency on calGrid) */
	function toMinRaw(t: string | null): number {
		if (!t) return 0;
		const [h, m] = t.split(':').map(Number);
		return h * 60 + m;
	}

	/** Paper key (unique identifier in the selected set) */
	function paperKey(sessionId: string, idx: number): string {
		return `${sessionId}:${idx}`;
	}

	/** Toggle a paper in/out of selected set */
	function togglePaper(sessionId: string, idx: number): void {
		const key = paperKey(sessionId, idx);
		const next = new Set(selectedPapers);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		selectedPapers = next;
	}

	/** Visible papers in a session (filtered when searching) */
	function visiblePapers(session: Session): { paper: Paper; idx: number }[] {
		const q = searchQuery.trim().toLowerCase();
		const showAllPapers = !q || sessionMatchesQuery(session, q);
		const out: { paper: Paper; idx: number }[] = [];
		for (let i = 0; i < (session.papers?.length || 0); i++) {
			if (showAllPapers || matchingPaperKeys.has(paperKey(session.id, i))) {
				out.push({ paper: session.papers[i], idx: i });
			}
		}
		return out;
	}

	/** Add papers in a session, optionally limited to specific indexes */
	function addAllPapers(session: Session, indexes?: number[]): void {
		const next = new Set(selectedPapers);
		const targets = indexes ?? [...Array(session.papers?.length || 0).keys()];
		for (const i of targets) {
			next.add(paperKey(session.id, i));
		}
		selectedPapers = next;
	}

	/** Remove papers in a session, optionally limited to specific indexes */
	function removeAllPapers(session: Session, indexes?: number[]): void {
		const next = new Set(selectedPapers);
		const targets = indexes ?? [...Array(session.papers?.length || 0).keys()];
		for (const i of targets) {
			next.delete(paperKey(session.id, i));
		}
		selectedPapers = next;
	}

	/** Check if any paper from a session is selected (optionally within specific indexes) */
	function hasAnySelected(session: Session, indexes?: number[]): boolean {
		const targets = indexes ?? [...Array(session.papers?.length || 0).keys()];
		for (const i of targets) {
			if (selectedPapers.has(paperKey(session.id, i))) return true;
		}
		return false;
	}

	/** Toggle expand/collapse of a session in the browser */
	function toggleExpand(sessionId: string): void {
		if (isSearching) {
			const next = new Set(collapsedSearchSessionIds);
			if (next.has(sessionId)) next.delete(sessionId);
			else next.add(sessionId);
			collapsedSearchSessionIds = next;
			return;
		}
		expandedSessionId = expandedSessionId === sessionId ? null : sessionId;
	}

	/** Search mode: default expanded; non-search mode: single expanded session */
	function isSessionExpanded(sessionId: string): boolean {
		if (isSearching) return !collapsedSearchSessionIds.has(sessionId);
		return expandedSessionId === sessionId;
	}

	/** Minutes from midnight (uses calGrid.start as fallback) */
	function toMin(t: string | null): number {
		if (!t) return calGrid.start * 60;
		const [h, m] = t.split(':').map(Number);
		return h * 60 + m;
	}

	/** Top px relative to the dynamic grid */
	function topPx(t: string | null): number {
		return (toMin(t) - calGrid.start * 60) * calGrid.px;
	}

	/** Height px for a paper block */
	function htPx(start: string | null, end: string | null): number {
		const s = toMin(start);
		const e = end ? toMin(end) : s + 12;
		return Math.max((e - s) * calGrid.px, 18);
	}

	/** Column layout for overlapping papers in a single day */
	function layout(items: CalendarPaper[]): { paper: CalendarPaper; col: number; cols: number }[] {
		if (!items.length) return [];
		const sorted = [...items].sort((a, b) => toMin(a.startTime) - toMin(b.startTime));
		const ends: number[] = [];
		const out: { paper: CalendarPaper; col: number; cols: number }[] = [];
		for (const p of sorted) {
			const s = toMin(p.startTime);
			const e = p.endTime ? toMin(p.endTime) : s + 15;
			let c = ends.findIndex((x) => x <= s);
			if (c === -1) {
				c = ends.length;
				ends.push(0);
			}
			ends[c] = e;
			out.push({ paper: p, col: c, cols: 0 });
		}
		const total = ends.length;
		for (const o of out) o.cols = total;
		return out;
	}

	/** Accent colour */
	function col(type: string): string {
		return TYPE_COLORS[type] || '#9ca3af';
	}

	/** Format 24h to 12h */
	function fmt(t: string | null): string {
		if (!t) return '';
		const [h, m] = t.split(':').map(Number);
		const ap = h >= 12 ? 'PM' : 'AM';
		return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${ap}`;
	}

	// ─── ICS ─────────────────────────────────────────────────────────

	function toIcsDT(date: string, time: string | null): string {
		return `${date.replace(/-/g, '')}T${time ? time.replace(':', '') + '00' : '000000'}`;
	}
	function esc(t: string): string {
		return t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
	}
	function addM(time: string, min: number): string {
		const [h, m] = time.split(':').map(Number);
		const t = h * 60 + m + min;
		return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
	}
	function exportSelected(): void {
		if (calPapers.length === 0) return;
		const l = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//CHI2026//joonyoung.me//EN',
			'CALSCALE:GREGORIAN',
			'METHOD:PUBLISH',
			'BEGIN:VTIMEZONE',
			'TZID:Europe/Berlin',
			'BEGIN:DAYLIGHT',
			'TZOFFSETFROM:+0100',
			'TZOFFSETTO:+0200',
			'TZNAME:CEST',
			'DTSTART:19700329T020000',
			'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
			'END:DAYLIGHT',
			'BEGIN:STANDARD',
			'TZOFFSETFROM:+0200',
			'TZOFFSETTO:+0100',
			'TZNAME:CET',
			'DTSTART:19701025T030000',
			'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
			'END:STANDARD',
			'END:VTIMEZONE'
		];
		for (const p of calPapers) {
			const desc = [
				`Session: ${p.sessionTitle}`,
				p.authors?.length ? `Authors: ${p.authors.map((a) => a.name).join(', ')}` : ''
			]
				.filter(Boolean)
				.join('\\n');
			l.push('BEGIN:VEVENT', `UID:chi2026-p${p.id || p.title.substring(0, 20)}@joonyoung.me`);
			l.push(`DTSTART;TZID=Europe/Berlin:${toIcsDT(p.date, p.startTime)}`);
			l.push(
				`DTEND;TZID=Europe/Berlin:${toIcsDT(p.date, p.endTime || (p.startTime ? addM(p.startTime, 15) : null))}`
			);
			l.push(`SUMMARY:${esc(p.title)}`);
			if (p.room) l.push(`LOCATION:${esc(p.room)}`);
			if (desc) l.push(`DESCRIPTION:${esc(desc)}`);
			l.push('END:VEVENT');
		}
		l.push('END:VCALENDAR');
		const blob = new Blob([l.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'chi26_my_schedule.ics';
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
</script>

<svelte:head>
	<title>CHI 2026 Schedule | joonyoung park</title>
	<meta
		name="description"
		content="Plan your CHI 2026 week. Browse papers, build your personal calendar, export to .ics."
	/>
</svelte:head>

<!-- ─── Header ───────────────────────────────────────────────────── -->
<section class="pt-6 pb-3">
	<div class="flex justify-center mb-6">
		<p class="border rounded p-3 border-red-500 text-center text-red-500">
			The schedule is subject to change. Please double check from the <a
				href="https://programs.sigchi.org/chi/2026/program/all?itemsType=SESSION&sortDirection=asc&sortType=TIME&viewType=LIST"
				class="hover:underline">official CHI 2026 programs</a
			>.
		</p>
	</div>
	<div class="flex items-end justify-between flex-wrap gap-2">
		<div>
			<h1 class="font-ibm font-semibold text-2xl sm:text-3xl">CHI 2026 Schedule</h1>
			<p class="font-ibm text-xs font-light text-gray-500 mt-0.5">
				April 13-17, 2026 &middot; Barcelona
			</p>
		</div>
		<div class="flex gap-2 items-center">
			<!-- Reset button — clears all selections after confirmation -->
			<button
				onclick={() => (showResetConfirm = true)}
				disabled={selectedCount === 0}
				class="font-ibm text-sm px-4 py-1.5 border border-red-300 text-red-600 rounded-lg
					hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors
					disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
			>
				Reset
			</button>
			<!-- Copy URL button — shares the current selection via URL -->
			<button
				onclick={copyURL}
				disabled={selectedCount === 0}
				class="font-ibm text-sm px-4 py-1.5 border border-gray-500 rounded-lg
					hover:bg-black hover:text-white transition-colors
					disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
			>
				{copiedToast ? '✓ Copied!' : 'Copy URL'}
			</button>
			<!-- Export .ics button — downloads selected papers as a calendar file -->
			<button
				onclick={exportSelected}
				disabled={selectedCount === 0}
				class="font-ibm text-sm px-4 py-1.5 border border-gray-500 rounded-lg
					hover:bg-black hover:text-white transition-colors
					disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
			>
				Export .ics ({selectedCount})
			</button>
		</div>
	</div>
</section>

<!-- ─── Mobile panel toggle ──────────────────────────────────────── -->
<div class="flex lg:hidden gap-2 mb-3">
	<button
		class="flex-1 font-ibm text-xs py-1.5 rounded border transition-colors
			{showBrowser ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-600'}"
		onclick={() => (showBrowser = true)}>Sessions</button
	>
	<button
		class="flex-1 font-ibm text-xs py-1.5 rounded border transition-colors
			{!showBrowser ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-600'}"
		onclick={() => (showBrowser = false)}>Calendar ({selectedCount})</button
	>
</div>

<!-- ─── Two-panel layout ─────────────────────────────────────────── -->
<div class="flex gap-3 pb-10" style="min-height:600px; align-items:flex-start">
	<!-- ═══ LEFT: Session browser ═══════════════════════════════════ -->
	<div
		class="w-full lg:w-[360px] lg:min-w-[320px] lg:flex-shrink-0 flex flex-col border border-gray-200 rounded-lg overflow-hidden
		{showBrowser ? '' : 'hidden lg:flex'}"
	>
		<!-- Filters -->
		<div class="p-2.5 border-b border-gray-200 space-y-1.5 bg-gray-50">
			<div class="relative">
				<input
					type="text"
					placeholder="Search sessions, papers, people..."
					bind:value={searchQuery}
					class="w-full font-ibm text-xs border border-gray-300 rounded px-3 py-1.5 pl-7
						focus:outline-none focus:ring-1 focus:ring-black"
				/>
				<svg
					class="absolute left-2 top-[7px] w-3.5 h-3.5 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<div class="flex gap-1.5">
				<select
					bind:value={browserDay}
					class="flex-1 font-ibm text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-black"
				>
					<option value="">All days</option>
					{#each DAYS as d (d.iso)}<option value={d.iso}>{d.short}</option>{/each}
				</select>
				<select
					bind:value={selectedType}
					class="flex-1 font-ibm text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-black"
				>
					<option value="">All types</option>
					{#each allTypes as t (t)}<option value={t}>{t}</option>{/each}
				</select>
			</div>
		</div>

		<!-- Session list -->
		<div class="flex-1 overflow-y-auto">
			{#if browseSessions.length === 0}
				<p class="font-ibm text-xs text-gray-400 text-center py-10">No sessions found.</p>
			{:else}
				{#each browseSessions as session (session.id)}
					{@const visiblePaperEntries = visiblePapers(session)}
					{@const visiblePaperIndexes = visiblePaperEntries.map(({ idx }) => idx)}
					<!-- Session row -->
					<div class="border-b border-gray-100" style="border-left: 3px solid {col(session.type)}">
						<!-- Session header (clickable to expand) -->
						<button
							class="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-start gap-2"
							onclick={() => toggleExpand(session.id)}
						>
							<!-- Expand chevron -->
							<svg
								class="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400 transition-transform
								{isSessionExpanded(session.id) ? 'rotate-90' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
							<div class="flex-1 min-w-0">
								<p class="font-ibm text-xs font-medium leading-snug">{session.title}</p>
								<div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
									<span
										class="text-[10px] font-ibm px-1.5 rounded-full"
										style="background:{col(session.type)}20;color:{col(session.type)}"
									>
										{session.type || 'Session'}
									</span>
									<span class="text-[10px] font-ibm text-gray-400">{session.rawTime}</span>
									{#if session.room}
										<span class="text-[10px] font-ibm text-gray-400">{session.room}</span>
									{/if}
								</div>
								{#if session.papers?.length}
									<span class="text-[10px] font-ibm text-gray-400">
										{visiblePaperEntries.length} paper{visiblePaperEntries.length > 1 ? 's' : ''}
									</span>
								{/if}
							</div>
						</button>

						<!-- Expanded: default-on while searching, toggleable by click -->
						{#if isSessionExpanded(session.id)}
							<div class="bg-gray-50/50 border-t border-gray-100">
								<!-- Add/remove all button -->
								{#if visiblePaperEntries.length}
									<div class="px-3 py-1.5 flex gap-2">
										<button
											class="font-ibm text-[10px] px-2 py-0.5 rounded border border-gray-300 hover:bg-black hover:text-white transition-colors"
											onclick={() => addAllPapers(session, visiblePaperIndexes)}>Add all</button
										>
										{#if hasAnySelected(session, visiblePaperIndexes)}
											<button
												class="font-ibm text-[10px] px-2 py-0.5 rounded border border-gray-300 hover:bg-black hover:text-white transition-colors"
												onclick={() => removeAllPapers(session, visiblePaperIndexes)}>Remove all</button
											>
										{/if}
									</div>
								{/if}

								<!-- Individual papers -->
								{#each visiblePaperEntries as { paper, idx } (paper.id || idx)}
									<div
										class="flex items-start gap-2 px-3 py-1.5 hover:bg-white group/paper transition-colors
										{isSearching ? 'bg-blue-50 border-l-2 border-l-blue-400' : ''}"
									>
										<!-- Toggle checkbox -->
										<button
											onclick={() => togglePaper(session.id, idx)}
											class="mt-0.5 w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center text-[10px] transition-colors
												{selectedPapers.has(paperKey(session.id, idx))
												? 'bg-black text-white border-black'
												: 'border-gray-300 text-gray-400 hover:border-black'}"
										>
											{selectedPapers.has(paperKey(session.id, idx)) ? '✓' : ''}
										</button>
										<!-- Paper info (click for detail) -->
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_static_element_interactions -->
										<div
											class="flex-1 min-w-0 cursor-pointer"
											onclick={() => {
												const p = session.papers[idx];
												detailPaper = {
													...p,
													sessionId: session.id,
													sessionTitle: session.title,
													sessionType: session.type,
													room: session.room,
													date: session.date,
													_key: paperKey(session.id, idx)
												};
											}}
										>
											<p
												class="font-ibm text-[11px] leading-snug group-hover/paper:text-blue-700 transition-colors"
											>
												{paper.title}
												{#each paper.awards || [] as award}
													<span
														class="ml-1 text-[9px] px-1 py-0 rounded bg-yellow-100 text-yellow-700 font-medium"
														>{award}</span
													>
												{/each}
											</p>
											{#if paper.startTime && paper.endTime}
												<p class="font-ibm text-[10px] text-gray-400 mt-0.5">
													{fmt(paper.startTime)} – {fmt(paper.endTime)}
												</p>
											{/if}
											{#if paper.authors?.length}
												<p class="font-ibm text-[10px] text-gray-400 truncate">
													{paper.authors.map((a) => a.name).join(', ')}
												</p>
											{/if}
										</div>
									</div>
								{/each}

								{#if !session.papers?.length}
									<p class="px-3 py-2 font-ibm text-[10px] text-gray-400">No papers listed.</p>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<!-- ═══ RIGHT: Week calendar grid (sticky — stays in viewport while browser scrolls) ══ -->
	<div
		class="flex-1 border border-gray-200 rounded-lg overflow-hidden lg:sticky lg:top-4 {!showBrowser
			? ''
			: 'hidden lg:block'}"
		style="max-height:calc(100vh - 6rem)"
	>
		{#if selectedCount === 0}
			<div class="flex flex-col items-center justify-center h-full text-center p-8">
				<svg
					class="w-12 h-12 text-gray-200 mb-3"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<p class="font-ibm text-sm text-gray-400">Your calendar is empty.</p>
				<p class="font-ibm text-xs text-gray-300 mt-1">
					Expand a session and check papers to add them here.
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto overflow-y-hidden h-full">
				<!-- Scrollable inner container — min-width ensures all 5 day columns are reachable -->
				<div class="min-w-[660px]">
					<!-- Day headers -->
					<div class="flex sticky top-0 z-20 bg-white border-b border-gray-200">
						<!-- Time gutter spacer -->
						<div class="w-12 flex-shrink-0 border-r border-gray-200"></div>
						<!-- Day columns -->
						{#each DAYS as day (day.iso)}
							{@const count = papersByDay.get(day.iso)?.length || 0}
							<div class="flex-1 text-center py-1.5 border-r border-gray-100 min-w-[120px]">
								<span class="font-ibm text-[11px] font-medium">{day.short}</span>
								{#if count > 0}
									<span class="font-ibm text-[10px] text-gray-400 ml-1">({count})</span>
								{/if}
							</div>
						{/each}
					</div>

					<!-- Grid body -->
					<div class="flex" style="height:{calGrid.h}px">
						<!-- Time gutter -->
						<div class="w-12 flex-shrink-0 border-r border-gray-200 relative bg-gray-50/50">
							{#each calGrid.hours as { h, label } (h)}
								<div
									class="absolute w-full text-right pr-1.5 font-ibm text-[9px] text-gray-400 -translate-y-1/2"
									style="top:{(h - calGrid.start) * 60 * calGrid.px}px"
								>
									{label}
								</div>
							{/each}
						</div>

						<!-- Day columns -->
						{#each DAYS as day (day.iso)}
							{@const items = papersByDay.get(day.iso) || []}
							{@const laid = layout(items)}
							<div class="flex-1 relative border-r border-gray-100 min-w-[120px]">
								<!-- Hour lines -->
								{#each calGrid.hours as { h } (h)}
									<div
										class="absolute w-full border-t border-gray-100"
										style="top:{(h - calGrid.start) * 60 * calGrid.px}px"
									></div>
								{/each}

								<!-- Paper blocks -->
								{#each laid as { paper, col: c, cols } (paper._key)}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="absolute rounded-sm px-1 py-0.5 overflow-hidden cursor-pointer
										hover:brightness-90 transition-all text-[10px] font-ibm leading-tight"
										style="
										top:{topPx(paper.startTime)}px;
										height:{htPx(paper.startTime, paper.endTime)}px;
										left:calc({(c / cols) * 100}% + 1px);
										width:calc({100 / cols}% - 2px);
										background:{col(paper.sessionType)}25;
										border-left:2px solid {col(paper.sessionType)};
									"
										title="{paper.title}\n{fmt(paper.startTime)} – {fmt(
											paper.endTime
										)}\n{paper.room}"
										onclick={() => (detailPaper = paper)}
									>
										<span class="font-medium line-clamp-2">{paper.title}</span>
										{#if htPx(paper.startTime, paper.endTime) > 24}
											<span class="text-gray-500 block truncate">{fmt(paper.startTime)}</span>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					</div>
				</div>
				<!-- /min-w-[660px] scrollable inner -->
			</div>
		{/if}
	</div>
</div>

<!-- ─── Reset confirmation modal ──────────────────────────────────── -->
{#if showResetConfirm}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 bg-black/30 z-40" onclick={() => (showResetConfirm = false)}></div>
	<div
		class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
		bg-white rounded-xl shadow-xl p-6 w-[340px] text-center"
	>
		<p class="font-ibm text-sm font-medium mb-1">Reset your schedule?</p>
		<p class="font-ibm text-xs text-gray-500 mb-5">
			This will remove all {selectedCount} selected item{selectedCount > 1 ? 's' : ''} from your calendar.
		</p>
		<div class="flex gap-2 justify-center">
			<button
				onclick={() => (showResetConfirm = false)}
				class="font-ibm text-sm px-5 py-1.5 border border-gray-300 rounded-lg
					hover:bg-gray-100 transition-colors"
			>
				Cancel
			</button>
			<button
				onclick={resetAll}
				class="font-ibm text-sm px-5 py-1.5 bg-red-600 text-white rounded-lg
					hover:bg-red-700 transition-colors"
			>
				Reset
			</button>
		</div>
	</div>
{/if}

<!-- ─── Paper detail modal ───────────────────────────────────────── -->
{#if detailPaper}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 bg-black/30 z-40" onclick={() => (detailPaper = null)}></div>
	<div
		class="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white z-50 shadow-xl overflow-y-auto"
	>
		<div class="p-5">
			<!-- Close + calendar toggle -->
			<div class="flex justify-between items-center mb-3">
				<button
					onclick={() => {
						const k = detailPaper?._key;
						if (k) {
							const n = new Set(selectedPapers);
							n.has(k) ? n.delete(k) : n.add(k);
							selectedPapers = n;
						}
					}}
					class="font-ibm text-xs px-3 py-1 rounded border transition-colors
						{selectedPapers.has(detailPaper._key)
						? 'bg-black text-white border-black'
						: 'border-gray-400 text-gray-700 hover:bg-black hover:text-white'}"
				>
					{selectedPapers.has(detailPaper._key) ? '✓ In calendar' : '+ Add to calendar'}
				</button>
				<button
					onclick={() => (detailPaper = null)}
					class="text-gray-400 hover:text-black p-1"
					title="Close"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Awards badges -->
			{#if detailPaper.awards?.length}
				<div class="flex gap-1.5 mb-2 flex-wrap">
					{#each detailPaper.awards as award}
						<span
							class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-ibm font-medium"
							>🏆 {award}</span
						>
					{/each}
				</div>
			{/if}

			<!-- Title -->
			<h2 class="font-ibm font-semibold text-lg leading-snug">{detailPaper.title}</h2>

			<!-- Meta: type + time -->
			<div class="flex flex-wrap gap-2 mt-2">
				<span
					class="text-xs font-ibm px-2 py-0.5 rounded-full"
					style="background:{col(detailPaper.sessionType)}20;color:{col(detailPaper.sessionType)}"
				>
					{detailPaper.sessionType}
				</span>
				{#if detailPaper.startTime}
					<span class="font-ibm text-xs text-gray-500">
						{fmt(detailPaper.startTime)}{detailPaper.endTime
							? ` – ${fmt(detailPaper.endTime)}`
							: ''}
					</span>
				{/if}
			</div>

			<!-- Room -->
			{#if detailPaper.room}
				<p class="font-ibm text-xs text-gray-500 mt-1.5 flex items-center gap-1">
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					{detailPaper.room}
				</p>
			{/if}
			<p class="font-ibm text-xs text-gray-400 mt-1">Session: {detailPaper.sessionTitle}</p>

			<!-- Abstract -->
			{#if detailPaper.abstract}
				<div class="mt-4">
					<h3 class="font-ibm text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
						Abstract
					</h3>
					<p class="font-ibm text-sm text-gray-700 leading-relaxed">{detailPaper.abstract}</p>
				</div>
			{/if}

			<!-- Authors with affiliations -->
			{#if detailPaper.authors?.length}
				<div class="mt-4">
					<h3 class="font-ibm text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
						Authors ({detailPaper.authors.length})
					</h3>
					<div class="space-y-1.5">
						{#each detailPaper.authors as author (author.name)}
							<div>
								<p class="font-ibm text-sm font-medium">{author.name}</p>
								{#if author.affiliation}
									<p class="font-ibm text-xs text-gray-500">{author.affiliation}</p>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
