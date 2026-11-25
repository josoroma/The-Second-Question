# Listening people can feel

Listening makes no sound. On the first Tuesday in July, Diego did a great deal of it, and the dock supervisor beside him had no way to know.

Diego is Tolva's engineer inside Veldhaven, whose first warehouse, site one, starts running on Tolva's dock scheduler in September. After the morning trucks had gone, he laid two plans side by side on the desk in site one's dock office. One was the paper plan Veldhaven's planners had printed the evening before; the other, the plan the scheduler had made overnight from the same bookings. He had asked the supervisor, who had run site one's morning shift for eleven years, to show him where the scheduler was wrong.

The supervisor ran a finger down the scheduler's plan and stopped at 6:10. "This one. A container from the port, on door four. Then your system puts the next truck on door four at 6:50."

Diego had stopped at "your system". He was already shaping his answer.

"That container came floor-loaded," the supervisor went on. "No pallets. Boxes stacked to the roof, and two of my people take them off by hand. Two hours. Your 6:50 truck waits over an hour at the gate. Not every container is like that. Some come on pallets, and those are quick. I see which ones on the packing list the night before."

"It doesn't use a fixed time," Diego said. "It takes the length of the slot from the booking."

"And the carrier books forty minutes for everything." The supervisor glanced at his radio. "Fine."

Diego wrote "container times" in his notebook, said, "Okay. This is useful. Thanks," and left.

## Two words in a notebook

Diego had listened, and he was right about the booking. From the supervisor's side of the desk, a visitor from the software company had written down two words, corrected him once and called it useful. Until your listening comes back to people in words, they are taking it on trust. Part of the conversation had not reached Diego either. While he held his correction ready, the supervisor had told him which containers mattered and how to spot them the night before.

Your listening counts for the other person once they can check it. So give them something to check: say what you understood, what you will do about it and what you are still unsure of, then let them correct you. The moment they correct you is the moment they know they were heard, and the correction can carry the one fact you missed.

> **Line to keep:** To feel heard, people need something to correct.

On the dock, Diego told when he should have asked. "When you know the answer, say it" is right when a question is put to you and the answer is in your head, because people rely on whoever knows. A supervisor who asks whether a new rule is live wants a yes or a no. "Ask more than you tell" brings out what you don't know, and it is right on the dock, where every missing piece was in the supervisor's head. The rule for choosing: tell when the missing piece is in your head. Ask when it is in theirs, when you need them to commit, or before you decide they are wrong. Diego had decided the supervisor was wrong before the supervisor finished.

## The read-back

The tool for this is **the read-back**, in three parts: what I understood, what I will do, what I am unsure of. Use it when you receive, and ask for it when you give ("tell me your plan before you start"), with people and with agents. Skip it when the stakes are low and the other person wants speed.

- **What I understood.** Their point, in their words wherever you can: "floor-loaded", "by hand", "the packing list". People can correct only what they recognize. Give back the part you will act on, and leave the rest.
- **What I will do.** One action, and when. Repeating their words shows you heard them; this part shows that what they said changed something.
- **What I am unsure of.** One real question. It gives them the easiest way in to correct you, and it is where a missing fact can surface.

Knowing you will say it back also changes what you do while they talk: you collect their words instead of shaping your reply.

None of this is new. A pilot reads an instruction back before acting on it. In some hospitals, whoever takes over a shift sums up what they heard, asks questions and restates the key actions: the same three parts. This book adds their words instead of yours, one action with a time, and a question you can't answer yourself.

> **Research says:** In nine hospitals, the rate of medical errors fell 23 percent after a program had resident doctors hand patients over in a set order, aloud and in writing. A later independent review rated the evidence for fewer errors as moderate, but one randomized trial of a version of the program found no drop in preventable harm. The program changed several things at once, so it cannot single out one habit; giving your own handovers a fixed shape is this book's reasoning from it.

## The next morning, line by line

That evening Diego began his note to Mateo, Tolva's co-founder and chief technology officer, and stopped halfway through a sentence: "The scheduler needs to know which containers". He did not know how it would know. At ten the next morning he called the supervisor.

**Diego:** "It's Diego, from yesterday. Do you have two minutes? I want to check what I wrote down about the containers."

He asks for the time and gives the reason, which makes the supervisor the judge of his notes.

**Supervisor:** "Go on."

**Diego:** "What I understood: containers from the port come floor-loaded, boxes stacked to the roof, and two of your people unload them by hand. That takes about two hours, but the carrier books forty minutes, so the next truck on that door waits."

The first part, in the supervisor's own words. Nothing about slot lengths or booking fields, the words Diego would use with Mateo.

**Supervisor:** "Not all of them. Some come on pallets. Those are quick."

The correction is the sentence Diego missed on the dock while he held his own ready. It is also the first sign the supervisor has had that the rest went in: only one detail needed fixing.

**Diego:** "Only the floor-loaded ones, then. What I'll do is write this up today for Mateo, who builds the scheduler, so those containers get a longer slot. What I'm unsure of is how the scheduler would know which ones they are before they arrive."

The second part shows that the call will change something. The third is a real question, and the supervisor has already answered it once.

**Supervisor:** "The packing list. It comes the night before. I told you that yesterday."

**Diego:** "You did, and I missed it. Does the packing list reach Veldhaven's warehouse system, or only your inbox?"

He owns the miss in one short sentence and moves on. The question after it is one the supervisor can't answer, which tells Diego where the next fact lives.

**Supervisor:** "I don't know. Ask the office." Then, after a moment: "Come on Friday at six. Two containers are due. You can watch one come off."

Diego hadn't asked him for that. The call took under three minutes. Diego's note to Mateo that afternoon held two facts he did not have when he left the dock, and one question for Veldhaven's office. What the dock knew reached Mateo intact, which is the translator's habit.

> **From practice:** End a read-back on a question that makes correcting you easy. A question that a polite yes can answer may get only the yes. "What did I miss?" asks for the gap itself.

## When you hand the work over

The read-back turns around when you are the one giving the work. The next week Diego gave a coding agent the job of writing tests for the container rule. Before it wrote a line, he asked: "Tell me your plan before you start: what you understood, what you will do, what you are unsure of." Its plan gave every container two hours, and its third part said it was unsure of nothing. That empty line was the warning. The packing list, the one thing that decides which containers get the longer slot, was missing from the plan. An agent's read-back shows you its guess while one sentence can still fix it. With a colleague, ask for the same three parts in plain words.

## Practice: say it back in their words

**Situation.** A video call. A customer's head of support has spent four minutes on why her team stopped trusting your product's ticket routing. One morning it sent two billing complaints to the technical queue, and nobody noticed until one of those customers called back angry. Since then her agents sort every ticket by hand before they start.

**First draft (what a founder who knows the product says).** "Got it. So the classifier's confidence threshold is too low, the misroutes eroded trust, and you've fallen back to manual triage. We'll tune the threshold this sprint."

**What's wrong.** It is a read-back in the founder's language. She can't correct "confidence threshold" or "manual triage", so the safe reply is "I suppose so." The part that hurt, nobody noticing until a customer called, is missing. And it names a cause nobody has checked.

**Better.** "Two billing complaints went to the technical queue, nobody saw it until a customer called back, and now your team sorts every ticket by hand. I'll find out why those two went wrong and tell you by Thursday. What I can't tell yet is which hurt more: the wrong queue, or not seeing it."

**Why it works.** Her words come back to her, so she can correct them. One action has a day on it. The last sentence is a question only she can answer, and her answer decides what to fix first: the routing, or the fact that nobody could see it fail.

**Your turn (5 minutes).** Take the last time someone explained a problem to you at length. Write your read-back in three sentences, one for each part, using at least two of their words for the problem and none of your field's words they would not use. Say it aloud once. **Done means** someone outside your field, hearing it once, can tell you what the problem was and what you will do.

## Practice: one read-back this week

**With a person.** This week, when someone explains a problem to you or hands you work, say back the three parts before you act. End on a question that makes correcting you easy. Then watch the reply: look for a correction, something they add, or a point they stop repeating. A quick "yes" with nothing after it means your third part needs asking again, more plainly. Once this week, turn it around: when you hand someone a task, ask for their plan before they start.

**Done means** your notes hold one thing the other person corrected or added after your read-back, in their words. If they changed nothing, your notes hold the question you asked and their answer.

**If you do only one, do this one.**

## Words to use

- **To start a read-back.** "Let me say back what I took from that."
- **The three parts.** "What I understood is [their point, in their words]." "What I'll do is [one action] by [day]." "What I'm not sure of is [one thing]."
- **To make correcting you easy.** "What did I miss?" "Which part did I get wrong?"
- **When they have to repeat something.** "You've said that twice, so I haven't shown you I got it. Here's what I have: [your read-back]."
- **When you hand over work.** "Before you start, tell me your plan in two sentences: what you'll do first, and what you're not sure of."

### Phrases you will hear

- "I hear you." (I heard what you said. It doesn't say what they will do about it, so ask.)
- "Point taken." (Your point is fair. It may still change nothing.)
- "Let me play that back." (A read-back is coming. Correct anything that is off.)
- "I'm all ears." (I'm listening. Go ahead.)

## When it backfires

**When they want speed.** Two weeks after the call, at five past six, a container stood at door four and trucks were lined up at the gate. The supervisor called across the dock: "Is your container rule in yet?" Diego began, "So what I understood is that you want the floor-loaded ones to—" "Diego. Yes or no." "No. It's still in testing." The tool was right and the moment was wrong. A quick question in a rush, with nothing new at stake, gets the answer and nothing else.

**When it turns into a script.** A read-back that hands back every sentence, in the order it was said, can sound like a technique being used on someone. Give back only the part you will act on, in plain words, then your action and your question.

**When power is uneven.** With a client or someone senior, a full read-back can sound as if you doubt they were clear. Lead with what you will do: "So I get this right: I'll [action] by [day]. Is that what you need?" When you hold the power, asking for a read-back can sound like a test. Put the reason on your own side: "Tell me your plan, so I know my brief was clear."

**When the team has its own habit.** In some teams a spoken read-back can sound as if you didn't trust the speaker. There, send it in writing after the call.

**In a second language.** The read-back is the cheapest check you have, because it catches a misheard word on either side before anyone acts on it. Use their words for the thing, even when yours would be more exact, and keep each sentence short.
