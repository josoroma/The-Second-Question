# Seeing the system

What happens to the forklifts when trucks stop waiting?

On Thursday 12 November, two messages were waiting in Montevideo when Mateo woke up. He runs technology at Tolva, whose scheduler tells each arriving truck which door to use. On Monday it had gone live, quietly, at the second warehouse of Veldhaven, a food wholesaler in Rotterdam.

The first message came from Claire, who runs operations there: "Site two: six minutes from gate to door. In June it was nineteen. For December I want to move twelve trucks a morning there from site one. Can it take them? I tell the carriers tomorrow at three."

The second came from site two's manager: a photo of pallets, four deep on the floor behind the doors, and one line. "Your trucks don't wait any more. My pallets do."

Mateo began with Claire's. "Yes. In May the scheduler ran three busy sites with room to spare." He didn't send it. His test had measured software. Nobody had measured the floor.

He phoned the manager. Behind each door runs a lane, a strip of floor where pallets stand until a forklift carries them to the racks. At half past seven that morning, nine lanes had been full. Four trucks stood at doors they had reached in six minutes, unable to unload. The gate log stops its clock at the door, so on paper nobody was waiting.

## Where the queue went

A change has a first effect, and you'll be watching it, because it's why you made the change. Then it sets off others, and they land on people who weren't in the meeting. Those are its second-order effects, and you can trace them aloud before anyone decides. Find the constraint that limits the change, the loop it sits in and who feels it next. Then say how sure you are of each.

The terms are standard. What this chapter adds is how to use them with someone who has to choose by three. Learn it, and you become the person who can tell a room what comes after the good news.

> **Line to keep:** Before you end one wait, find out who waits next.

## And then what?

You already have the tool: next-question order, from *Give it a shape*, asked of consequences. Start with the change. After each effect, ask "and then what?", an old question, and answer with the observable version: what a recording would show or a number would state. "More efficient" doesn't pass. Stop when the next answer wouldn't change the decision.

Mateo's page on Thursday:

1. A truck at site two reaches its door in six minutes. *And then what?*
2. Its pallets stand on the floor sooner, and so do its neighbors'. *And then what?*
3. Ten forklifts carry pallets no faster than they did in June, so lanes fill. *And then what?*
4. A truck gets a door with a full lane behind it and can't unload. *And then what?*
5. Twelve more trucks, and the wait is back, at the door, where no clock runs.

Line three holds the **constraint**: the step that sets the pace of the whole, however fast the others go. Speed up any other step and you only move the queue. The way to find it is old in factories: go where things pile up, and ask what they are waiting for. The trucks had waited for doors, the doors for lanes, and the lanes for forklifts.

That broke the belief Tolva was founded on: that the doors run out first. Ask which belief your own change was built on, and who shares it.

## Two loops on the dock

A **loop** is an effect that comes back to its own cause. Say it as one chain that ends where it began.

A **reinforcing loop** feeds itself. When a lane is full, a forklift driver sets pallets down in the nearest gap. The next driver has to move them to reach the right ones, so each trip takes longer. More lanes stay full, and more pallets go into the nearest gap.

A **balancing loop** pushes back. In June, drivers walked to a window for their door, and the planner behind the glass could see the lanes. When they were full, the planner kept the next truck in the yard. Fewer pallets reached the floor, the lanes emptied, and the truck was called in.

Since 9 November, most drivers get their door by text. Tolva had removed an eight-minute walk and, with it, the one person who looked at the floor before saying yes. Nobody had asked what else the walk was for.

Two questions bring loops into a conversation. "If nobody touches this for a month, does it grow or settle?" And, of any step you're about to remove: "What else was the person doing while they did it?"

## How sure of each line

A predicted effect is a claim, so make it a sized claim, as in *How sure are you? Say that*. The four basis words give you three levels:

- **Checked or told.** It has already happened, and you counted, or somebody who did told you: nine full lanes.
- **Reasoned.** It follows from things checked or told: twelve more trucks would fill the lanes faster.
- **Assumed.** You're taking it as given, often because it depends on people you haven't asked.

Pallets stay where they are put. People adjust, so keep every line about people at *assumed* until you've heard from them.

One of those lines arrived on Thursday evening from Naomi, the consultant in Seattle whose forecast tells the scheduler when trucks will come. "At site two, drivers who get the text have stopped coming early. I checked four mornings against the gate log. My forecast learned from the early ones, so it expects those trucks too soon. I don't know yet whether the drivers will keep it up."

She had found a loop with herself inside it. Her forecast had helped end the wait, the end of the wait had changed the drivers, and the drivers were changing her forecast.

## Friday, out loud

On Friday morning site two's manager borrowed two forklifts and their drivers from the afternoon shift. He and Mateo had agreed the test beforehand: five full lanes or fewer at half past seven would point to the forklifts. At one o'clock, two hours before her deadline, they had Claire on a video call.

"I wouldn't move twelve," Mateo said. "The gate has room and the floor hasn't. Yesterday at half past seven, nine lanes were full and four trucks couldn't unload. Today, with two more forklifts, three lanes and one truck. That's counted, one morning each. Twelve more trucks would fill the lanes again. That's reasoned. How the drivers will arrive in December, I'm assuming."

Then came the second question.

"In March your company told me it was the doors," Claire said. "Now it's the forklifts. What will it be in December?"

"I was wrong about the doors at site two," Mateo said. "I saw trucks waiting for them, and I never asked what the doors were waiting for. It can move again. With more forklifts, I'd expect the aisles to be next. I'm told two can't pass between the racks. So don't rest December on my word. Count the full lanes at half past seven. Above five, add no trucks until you know why."

"And the afternoon wants its forklifts back," the manager said.

"Then I rent two," Claire said. "Four trucks move in the first week of December, and four more after each week the count stays at five or under. I'll see it every morning by eight."

She had asked whether site two could take twelve. She left with a way to find out, and a number that would stop her. That is the system reader's work: follow a change to whoever feels it next.

### Practice: fresh numbers every hour

**Situation.** You're a data engineer. The head of sales decides today whether the store dashboard refreshes every hour instead of every night.

**First draft (what a careful engineer says).**
"We can refresh it hourly now. The pipeline handles it easily, and the store managers have wanted fresher numbers all year. I can't see a downside."

**What's wrong.** It's accurate, and it stops at the first effect. "Easily" and "fresher" are labels. "I can't see a downside" reports only where the speaker looked: at the pipeline.

**Better.**
"Hourly works: I ran it for a week. I'd start with two stores. On three days we refreshed at noon, and each time our two analysts got about a dozen questions, so I expect the queue to move to them. That managers won't change prices after one slow hour, I'm assuming. Shall we run two weeks and count the questions?"

**Your turn (5 minutes).** Take a change you want this month. Say aloud what you recommend, its first effect, the constraint, who feels it next and what you would count. Give each effect its level. **Done means** a colleague who hears it once can name who feels it next and which part is assumed.

## The same trace, for work done with agents

Site two had an obvious fix: let the scheduler call a door free only when its lane is empty. A coding agent could have drafted it on Thursday. And then what?

By the standards Tolva had written down the week before, a named engineer reads the change, checks it against tests a person wrote, and signs. Nothing is signed on a Thursday. A signature on Friday would have filled Monday for the two reviewers who work for Otávio, Veldhaven's head of information security. And then what? Those two were also reading for site three, due on the 23rd. And then what? The scheduler can't see a lane. Somebody would have to tell it: one more button for the forklift drivers, the people everything was already waiting for. Mateo left the fix unwritten.

Now trace any team that hands agents more of the writing. This is our reasoning, so leave it at *reasoned* until you've counted. Drafts arrive sooner, so reading becomes the constraint, and the reinforcing loop Mateo described in *Who does well now* can start there. A rule that holds gives you a balancing one: when nothing runs unsigned, a full queue tells people to start less.

Trust sits in a loop too. Each quiet month can make the next reading feel less necessary, until something gets through and every reading slows again. And ask what else the person was doing. Whoever wrote a change by hand was also learning that corner of the system, and you may need that knowledge the day they read an agent's version.

Ask for what you would see. How many days does a change wait for its reader? When did a reader last send one back?

## When it backfires

**When it can be undone by lunch.** If a change is local and easy to reverse, make it and report it. Trace what is hard to undo or lands on somebody else.

**When it becomes a way to say no.** Anyone can imagine a terrible fifth effect. A page with every line at *assumed* is a worry. Offer the smallest trial that would check one line.

**When the constraint is a person.** Name the step. "Changes wait two days to be read" invites a fix; "she's the bottleneck" invites a defense.

**When they hold the power.** Give the recommendation first and offer the trace. If someone senior has already praised the first effect, take them the count in private. Where following an effect into another team's work sounds like blame, ask that team first.

**In a second language.** "And then what?" can sound like a challenge. "What happens after that?" and "Who gets that next?" are gentler.

## Practice: one page before the change

The critical-thinking strand that opened with *Know what you think* closes here: there you tested a sentence, and now you test what it sets off.

**If you do only one, do this one.** **With a person.** Pick a change due in the next two weeks, yours or an agent's.

1. Write it at the top of a page. Ask "And then what?", answering with what a recording would show or a number would state, until the next answer wouldn't change the decision.
2. Beside each answer write checked, told, reasoned or assumed. Circle the constraint.
3. Where an answer leads back to an earlier one, write *feeds itself* or *pushes back*.
4. Send the page to whoever feels it next: "I think this reaches you as [what you would see]. What did I miss?"

**Done means** that person has confirmed or corrected their line in writing, and one line has a count and a day to check it. On that day, go and look.
