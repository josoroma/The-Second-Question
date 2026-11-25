# Give it a shape

This update holds one request. Find it.

"Okay, last week. On Monday I finally got access to the test copy of their warehouse system, so I spent the day reading booking records. On Tuesday I mapped their fields to ours, and most of it is clean. On Wednesday I ran one morning of test bookings through the scheduler. When a carrier changes a booking, the change comes in as a new record, so that truck appears twice. I wrote to their warehouse-system team that afternoon to ask which field marks the newer copy, but they're busy with their own upgrade, so nothing yet. On Thursday I wrote tests for the import. On Friday we moved desks to the third floor, so I lost the morning. This week I'll keep going on the import, and at some point it would help if someone from their side looked at the duplicates, because of Thursday's test run."

Diego, Tolva's forward-deployed engineer, opened the weekly call with it on a Monday in late April. In March he had moved to Rotterdam to work inside Veldhaven, Tolva's largest client, connecting Tolva's scheduler to its warehouse system. It was two in the afternoon for him and nine in the morning in Montevideo. Listening there were Tolva's co-founders: Lucía, its chief executive, and Mateo, its chief technology officer.

Mateo asked whether the records carried a timestamp. "The time of the booking, not the time of the change," Diego said. Lucía said, "Thanks, Diego. Busy week," and moved to the next item.

On Wednesday evening, Diego wrote to her:

"Their warehouse-system team still hasn't told us which copy of a changed booking is the newer one. Without an answer by tomorrow morning, Thursday's test run moves a week. Can you ask Claire to find us an hour with one of their engineers?"

Lucía answered within a minute: "Why didn't you say this on Monday?"

"I did," Diego wrote. "Thursday was in my last sentence."

It was. The duplicates were in his fifth sentence. The problem and Thursday had both reached her on Monday, each at the same weight as the desk move. Mateo kept the duplicates, because they were a puzzle in his field. Lucía kept "busy week". Neither kept Thursday. Within the hour, Lucía wrote to Claire, who runs operations at Veldhaven. Claire found an engineer the next morning, and the test run started a day late.

## A listener can't scroll back

Diego's writing is exact: his Wednesday message gave the problem, the cost and the request in three sentences. Out loud on Monday, he told the week the way he had lived it, so the days of the week decided what came first.

Speech arrives sentence by sentence, and on a live call nobody can go back to check which one mattered. So the order you choose tells the listener what to keep, and the week in order tells them the wrong thing. What the listener must act on is where things stand now, and a chronology reaches now last. Diego works on software that sends each truck to the right door at the right time. His update sent the trucks in the order they arrived and left Lucía to find the doors.

Give every answer a shape instead. Anything you say is easy to follow when each sentence in it is one this listener would ask for, placed where they would need it. You want the listener's effort spent on judging what you said, not on sorting it.

> **Line to keep:** Say first what they must act on, and let the next question be theirs.

## The listener's next question

The tool for building that shape is next-question order:

1. Start with the point sentence.
2. After each sentence, ask what this listener would ask next, and answer that.
3. Stop when the next question is theirs to ask.

The first two steps are old advice in business writing: lead with the answer, then answer the reader's questions in turn. What this chapter adds is where those questions come from, what to leave out and when to stop, for one person listening.

The point sentence is the one from *Know what you think*: what this listener should believe or do, and the one reason. Aloud, open with what they should believe or do; the reason can wait one sentence, for their "Why?"

The listener sketch from *Who is listening* tells you both what goes first and what this person will ask next. Lucía decides what Tolva asks of Veldhaven, so for her the request is the point. She knows the plan and the September date, so neither needs explaining. The warehouse system is new to her, so she will ask why. She stands to lose the date in the contract, so she will ask what a delay costs and whether it reaches September. When two questions compete, answer the one they need in order to decide, and let the other wait until they ask it.

A question is theirs when only they can answer it: whether they agree, what they will do, how much more they want to hear. When you reach one, stop. This is the hardest step to obey, because stopping feels like leaving something out.

Here is what Diego could have said on Monday, with Lucía's unspoken questions in brackets:

"Lucía, could you ask Claire today for an hour with someone on their warehouse-system team, before Thursday?" [Why?] "In a morning of their test bookings, every changed booking reached us twice, and only their team knows which copy is newer." [And if nobody comes?] "Thursday's test run moves a week." [Does that touch September?] "Not yet, and nothing else is blocked."

That takes about twenty seconds to say, close to the target this book sets for a short spoken answer: about fifty words.

It stops at "nothing else is blocked". What comes next is theirs to decide: whether Mateo wants the field names, whether Lucía wants the rest of the week.

Asking Lucía's next questions also changed what went in. It brought out two facts Monday left out: what it costs if nobody comes, and what is not blocked. The desk move and the import tests are gone, because no question she would ask leads to them. That is how you decide what to cut: a sentence that no question of this listener leads to stays in your notes.

> **From practice:** Before a call, say your first sentence on its own and imagine the call ends right after it. If the listener would still have what they must act on, keep it. If not, find the sentence that would give it to them and open with that.

## Where the order comes from

Had Diego been reporting to Mateo alone, the order would change after the first sentence. Mateo's next question was the one he asked on Monday, about the timestamp. So the second sentence would be: "The records carry the time of the booking, not the time of the change, so I can't tell which copy is newer."

When you can't guess someone's next question, the sketch is thin, and the quickest repair is to ask them: "Which helps first, the date or the reason?"

For a short answer you also have a default order, the first four questions of the second-question test from *Start here*: *What is the point? What does it rest on? Where does it stop? What do you want from me?* Anyone who has to act on your words needs those four answers, so they make a safe sequence when you know little about the listener. Next-question order is how you leave that sequence when you know more, as the rebuilt Monday update does by putting the request first.

Diego's job sits between two companies. He is growing toward the translator, one of the six thinker types: the habit of carrying meaning across a boundary intact. The last two bracketed questions show the habit of another type, the system reader: following a change past its first effect to whoever feels it next.

## The answer first, the history on request

"Where do things stand?" is a direct question, and a direct question gets the answer first. The week in order is a story told in place of that answer. The story still answers questions the listener may ask next, such as "How did you find it?" If they ask, tell that part, in order, briefly. *Story for people who think in systems* covers when to tell one: when there is time and you want to be remembered, and never in place of an answer.

Stopping also tells you something. The listener's first words after your last sentence show what arrived. If Lucía answers "I'll write to Claire now," the update did its work. If she says "Sorry, what do you need from me?", the first sentence never arrived, and Diego knows to say it again, more slowly.

## Practice: answer the question they would ask next

**Situation.** One morning at site one, the site manager stops Diego at the coffee machine: "Can your system handle a truck that arrives two hours early?"

**First draft (what a careful engineer says).** "So, the scheduler re-plans every time a truck checks in at the gate. An early truck has no matching slot, so it goes into the unassigned list, and the planner looks for a door it can take without moving trucks already booked. It weighs door type, trailer length and how long each truck has waited, so in most cases it finds something."

**What's wrong.** Each detail gets the same weight: the gate, the unassigned list, door type, trailer length, waiting time. She asked whether her dock can handle an early truck, and the answer is buried in "in most cases", which says neither yes nor when not.

**Better.** "Yes, if a door that fits it is free. It gets the first such door free long enough to unload it. On-time trucks keep their doors. If every door that fits is busy, the driver waits, and your screen shows how long. The system can't add doors: a morning full of early trucks still means a queue."

**Why it works.** The first word answers her question, and the first sentence fills a pattern you can reuse: `[the answer to their exact words], if [the one condition it depends on]`. Each sentence after it answers a question she would ask: which door, what about the trucks already booked, what if none is free. Her next question, what happens on her busiest mornings, is hers to ask, because only she knows how many early trucks they bring.

**Your turn (10 minutes).** Take a question someone asked you this week that you answered at length. Write their exact words at the top of a page. Below them, write one sentence that answers exactly that question, short enough to say in one breath. Before each next sentence, write in brackets the question this person would ask next, then answer it. Stop at the first bracket only they can fill. Say the result aloud without the brackets. **Done means** a colleague who hears it once can repeat your answer in one sentence, and every sentence you kept has a bracket above it.

**If you do only one, do this one.**

Three mistakes to watch for:

| Mistake | Fix |
|---|---|
| Starting with what happened first | Start with what they must act on |
| Answering the question you prepared | Repeat their words, then answer those |
| One more sentence after the stop | Say where the rest is, then stop |

**Timed drill (60 seconds).** The night before your next update, say it aloud: the point, then one sentence for each question your listener will ask, then stop. One constraint: no day of the week in your first two sentences. No recording needed.

**Untimed form.** Write the update with the listener's questions in brackets, then read it aloud once.

## Words to use

**To lead with the point**

- "I need one thing from you today: [the request], by [when]."
- "Where things stand today: [one sentence]."
- "I'll start with the end." (when you hear yourself starting from Monday)

**To answer the next question**

- "If that doesn't happen by [when], [what moves]."
- "It doesn't touch [what they care about], as far as I know today."

**To check your guess**

- "Is that the part you need, or would the reason help more?"

**To stop**

- "That's all from me. The rest of the week is in my notes."

**When someone gives you the week in order**

- "Can I ask first: do you need anything from me?"
- "What's the one thing I should take from this?"

### Phrases you will hear

- "To make a long story short": here is the summary.
- "Bring me up to speed": tell me where things stand now.
- "Take it from the top": start from the beginning.
- "What's the ask?": what do you need from me?

## When it backfires

**When the question is about the order.** "Walk me through what happened" asks for a chronology, and so does an incident review. There the order of events is the order of the listener's questions, because each one is "and then?" Give the outcome in one sentence first, so they know where the story ends, then tell it in order.

**When you guess the wrong question.** You answer September, and Lucía wanted to know whether Mateo could work around the duplicates without Veldhaven's team. You'll hear it in the next thing she says. Ask, rather than guess twice.

**When they hold the power.** A senior person may set the order: "Start from the beginning." Then start there. Someone who decides may want to judge the history for themselves. If they allow it, give one sentence of the end first: "Short version: Thursday may move. From the beginning, then." When your first sentence asks something of someone above you, keep it first and word it as a request, as the rebuilt Monday update does.

**When the room expects a frame.** In some teams, a request with no frame at all sounds abrupt. One short clause fixes it without moving the point: "One problem from the test data, and one request." Watch how respected people there open, or ask how they like to hear news.

**When it becomes a habit.** An answer cut to its last necessary sentence, every time, can sound curt, or as if you are hiding the rest. Say where the rest is, so the stop sounds like an offer.

**In a second language.** Building the order live while you look for words is a lot to do at once. Prepare only the first sentence and the stop. The middle can be plain, short sentences, because each one has only one question to answer.
