# The demo

Two minutes into the demo, door seven stops moving.

On the screen in Veldhaven's boardroom in Rotterdam, one morning at site one is playing back: fourteen trucks at the gate between 5:40 and 6:00, and twelve doors. Tolva's scheduler is sending each truck to a door. A moment ago Lucía, Tolva's chief executive, said "Watch door seven", and the board did. Now the truck above door seven hangs where it is, and a small circle turns in the corner of the screen.

Site one, the first of Veldhaven's three food warehouses, went live two days ago, on 28 September, two weeks late. The board approved the project on the word of Claire, Veldhaven's vice president of operations, who has stopped looking at the screen. She is looking at her chief executive, who in June told this board "September" on Lucía's word.

Diego, the engineer Tolva placed with Veldhaven, types at the laptop, then says to Lucía, "The test feed timed out. Live is fine. I'm watching it now."

Lucía lets eight seconds pass in silence. That is too long: the room has begun to guess how bad it is. Then she steps back from the laptop and turns to the room.

"The screen has stopped. Our test connection to your warehouse system has timed out. Site one's live scheduler runs on a separate connection, and Diego has just checked it: it is assigning doors normally. I can restart, which takes about five minutes, or show you yesterday's rehearsal of these same minutes. That one is a recording, and I'll say so. Either way, you'll have the cause in writing from me tonight."

Veldhaven's chief executive asks what the room is thinking. "Does it stop at three in the morning too, when nobody is watching?"

"Once since go-live," Lucía says. "On its first night, the live scheduler stalled for forty minutes. Your dock supervisors went back to the paper plan, and we had the cause by seven. It was in that morning's report. This is a different fault, in the test copy, and I would rather show you the recording than guess."

He chooses the recording: the same twenty minutes, one morning earlier, with the same late truck. She says "recording" as it starts, and again when the truck reaches door seven. The last slide holds one line: "Keep 9 and 23 November for sites two and three?" The board decides two days later, after reading her note on the cause, and keeps both dates.

## What a demo is for

A demo has one job: to let the person who decides watch their own problem being solved, so the decision you need becomes easy to make. Everything else is a tour.

Build it backward from the decision, and show one real moment in the first two minutes, a target this book sets. Say plainly what is real and what is staged, and rehearse the failure as carefully as the success. Then the demo can break without taking the decision with it.

> **Line to keep:** When the screen stops, the room starts watching you.

## Build it backward from the decision

The first two minutes are a working story, from *Story for people who think in systems*, with the product showing the moment. In Lucía's demo:

- **The decision**, written first, never told first. Her card opened with "Keep 9 and 23 November for sites two and three." Every other line had to serve it.
- **One moment**: one real morning at one site, with one late truck added.
- **The count**: the pilot's shorter wait per truck, from Veldhaven's own gate log, at its real size: one dock, six weeks. Site one, she said, had run two days, too few to count.
- **The handover**: the decision, asked in one sentence, on the last slide.

Over the moving trucks, before the freeze, she said only this:

"It's twenty to six: fourteen trucks, twelve doors. This one is an hour late, so under site one's own rule it lost its door after fifteen minutes. Watch door seven."

It is the board's own gate and a rule its own site manager asked for; the product shows up as a door for one truck.

Showing the result before the features is old advice; the working story adds the decision that chooses the moment. The ask waits until the room has seen it, unless someone asks a direct question or time is short. Then the decision goes first.

### Practice: the demo card

**Situation.** Tomorrow you show your product to a client's leadership team. You have thirty minutes and, so far, an agenda.

**First draft (what a busy founder writes the night before).** "Agenda: platform overview; dashboard and door view; carrier rules and time windows; reporting; roadmap; questions."

**What's wrong.** It is the product in the order it was built, every screen at the same volume. Nothing on it says whose problem gets solved or what the room should decide.

**Better.** Lucía's card for the board, six lines, its moment filled in that morning:

- Decision: keep 9 and 23 November for sites two and three.
- Moment: site one this morning, 5:40 to 6:00, fourteen trucks, twelve doors. Watch door seven.
- Real or staged: real arrivals, replayed on a test copy of their system. One late water truck is ours.
- Count: pilot dock last year, average wait per truck down from about fifty minutes to about thirty, from their gate log.
- Handover: "Do we keep both dates?"
- If it breaks: what broke, what we checked, where it stops, the choice, who sends the cause. Fallback: yesterday's recording, labeled.

**Why it works.** Every line has to earn its place against the first, and the breakdown is planned before anything breaks.

**Your turn (10 minutes).** Write the card for your next demo: six lines, the decision first. **Done means** a colleague who reads only your card can tell you what you will ask the room to decide and what it will watch first.

## Say what is real

A working story's moment must have happened. A demo often adds something that didn't, and a demo is a claim: this is what the product does. Size it as in *How sure are you? Say that*, with its basis and its limit. Before the first click, Lucía said:

"Everything you'll see is this morning's arrivals at site one, replayed on a test copy of your warehouse system. One truck is ours: a water delivery that arrives an hour late. We added it so you can watch what happens when a truck misses its slot."

It cost her a little magic and bought her the rest of the meeting. If a board member learns afterward that something was staged, they may wonder what else was, and the doubt can run backward over everything they saw.

Staging a truck is fine. Letting the room believe it was real is where persuasion ends. Keeping a recording in reserve is a common habit, and the label keeps it honest: said aloud and shown on the screen. Passed off as live, it works only if nobody notices, and that is the line this book does not cross.

## When it breaks

The first move is physical: step back from the keyboard, face the people, and let someone else fix it if anyone can. Then answer the room's next question before anyone asks it. The second-question test, from *Start here*, fits a frozen screen exactly:

1. **What is the point?** What broke, in one sentence.
2. **What does it rest on?** How you know, and whether you checked it or were told.
3. **Where does it stop?** What is not affected, and what you don't know yet.
4. **What do you want from me?** The choice you are putting to the room.
5. **Who answers for it?** Who will send the cause, and when.

Lucía's recovery took about thirty seconds and answered every question in the test. In May, one question from Claire had drawn two minutes of history from her. The difference was her card's sixth line, written while nothing was wrong.

Diego did his part. In June he had answered "It should be fine" about label printers he had only partly tested. Here he said "Live is fine" while looking at it, and she passed the check on with his name.

Look at what she left out: no "this never happens", no stack of apologies, no blame. The feed belongs to Veldhaven's own test system, and the people who answer for it were at the table. "Our test connection to your warehouse system" is true and names the side Tolva answers for, so nobody had to defend a team in front of the board.

Then she went back to the decision. A recovery is a detour; the handover is why you came.

> **Myth check:** You may have heard that a failure handled well wins a more loyal customer than no failure at all. Pooled studies of hotels, restaurants and other services found that a good recovery left customers more satisfied than those with no failure, but no more inclined to return or recommend. One field study saw no such lift after a second failure, and none tested demos, so our advice: recover well and never count on a failure to help.

### Practice: the recovery

**Situation.** Twenty minutes into a demo for a client's finance team, the screen freezes.

**First draft (the defense before the answer).** "Oh no, sorry, sorry. This never happens, it worked perfectly this morning. Honestly, I think it's your network, it's been slow all week. Let me just try refreshing. Sorry, one second."

**What's wrong.** Three apologies and a defense arrive before a single fact. "Never happens" has no basis, and blaming the network makes the client's own people defend themselves in front of their boss.

**Better.** "The screen has frozen, and I don't know why yet. Your data and your live system are safe: this demo runs on a copy. I can restart, which takes about three minutes, or show you yesterday's run as a recording. You'll have the cause from me by tomorrow morning."

"Has this happened to your other customers?" asks their finance director.

"Not that I know of, and I haven't checked. Tomorrow's note will answer that. Shall I restart, or show you the recording?"

**Why it works.** The first answer covers the whole test in under fifty words, with what you don't know in the first sentence. The second admits what you haven't checked, adds it to the promise and hands the choice back.

**If you do only one, do this one.** **With a person.** Take ten minutes to prepare and five to rehearse. On three slips of paper, write the three things most likely to break the next time you share your screen, such as the test data or an expired login. On a fourth, write "It stopped, and nobody knows why." For each, plan two lines that answer the test, and a fallback. Then start the demo for a colleague. Two minutes in, they turn over one slip (on a call, they pick a number), and you act as if it had happened. Ask them to listen for what stopped and what is safe, before you touch the keyboard. **Done means** your colleague can write down, after hearing you once, what stopped, what is not affected and what you asked the room to choose.

In the real demo, watch the first question after anything goes wrong. If it is about the decision, your recovery worked; if it is "So is it fixed?", one of your answers was missing.

**Spar with an AI.** Rehearse the worst minute first.

```text
You are the head of finance at a client company, watching my product demo. I will tell you, step by step, what is on the screen. Interrupt once with a failure: a frozen screen, a wrong total or a refused login, and no cause. After each answer I give, ask the one question it leaves open. When none is left, list your questions in order and mark any answer that claimed more than I could know.
```

*Safe practice: before you paste anything into an assistant, change names and figures and leave out anything confidential, or use a tool your employer has approved; treat its feedback as one agreeable opinion, not a grade.*

## Words to use

To open:

- "Here is one real morning at [place]. Watch [one thing]."
- "Everything you'll see is real data from [when], except [one thing], which we added so you can see [what]."

When it stops:

- "The screen has stopped. Here is what I know."
- "Your live system is not affected. [Name] has just checked."
- "I can restart, which takes about [time], or show you yesterday's run. That one is a recording."
- "You'll have the cause in writing from me by [time]."

To close:

- "We're out of time, so here is the one thing to decide."

### Phrases you will hear

- "Smoke and mirrors": it looks as if it works, but it is staged.
- "Kick the tires": try it yourself before you trust it.
- "The happy path": the route through the product where nothing goes wrong.

## When it backfires

**Technical audiences.** To engineers and evaluators, one polished moment can look like a trick. Hand them the controls after your two minutes, and show one known failure on purpose, announced as one.

**When the product is what broke.** The test still holds, but the honest answer to "where does it stop?" may be "I don't know yet." Then ask for time to find the cause before the room decides. Pushing the handover right after a real failure turns a recovery into a sales move.

**Power.** Whoever decides controls the clock, and a board can cut thirty minutes to ten without warning. If that happens, say the decision first, then show the moment and give the count.

**Culture.** In some rooms, leaving out a short apology sounds cold; in others, the apology sounds weak. Ask your host beforehand how this room handles a problem in a meeting. Claire told Lucía the board wanted facts first, so Lucía kept her apology for the note she sent that night.

**In a second language.** Under stress, you want a first sentence that is ready. Write it on the card word for word, with the names of the parts most likely to break, and practice those names slowly.
