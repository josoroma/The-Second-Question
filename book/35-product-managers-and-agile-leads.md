# Product managers and agile leads

Bianca, product manager at Tolva, asks in the team channel for quick first versions. She gets more than she can use.

Bianca, Friday 13 November: "Site three goes live in ten days. What would help its dock in the first week? If it's quick, show me."

An engineer, Friday night: "The trucks the night shift moved, on one screen. Runs on the test copy."

Another, Saturday: "Same, with colors."

Lucía, Sunday: "I made one too. A morning summary, by site."

Nine more arrived.

Tyler, Monday: "That's twelve, and all of them work. Which one do we read first?"

Bianca opened every one before she answered. Tolva's software sends trucks to warehouse doors, and site three is the last and coldest of Veldhaven's three warehouses. Four of the twelve showed what the night shift had moved. Three texted drivers, two colored the door map, and two summed up the morning for managers. The twelfth, from the support engineer, wasn't software. It was the list of moves the dock screen already prints, with an empty column headed "Why".

She couldn't say which was best, because she had never said best at what. So she phoned the one person missing from the thread, site three's morning shift lead. "When you walk in, what do you need before you touch anything?"

"Which trucks the night shift moved, and why. If I don't know why, I move them back."

Nothing in the scheduler knew why. Eleven prototypes had been built from what the software already held, and the answer was in a night supervisor's head.

## What is shifting

*Reported* is testimony, often from people selling the tools; *our bet* is this book's reasoning; the grades run from *durable* to *open* (full key: *Engineers and architects*). No row here is *checked*.

| What is shifting | Basis | Grade | The step worth taking either way |
|---|---|---|---|
| A first version takes an afternoon, so more people bring one | Reported | Reasonable bet | Post the question, and who chooses, before anyone builds |
| A version that runs says less about the thinking behind it | Our bet | Reasonable bet | Ask what it rests on and what it skipped |
| Speed up the building, and the work waits somewhere else | Our bet | Durable | Plan by the step where it waits, often the reading |
| Agents report their own progress on the board | Reported | Open: watch whether doubts still get said aloud | Keep the stand-up for what the board can't know |
| More of what goes wrong was written by nobody in the room | Reported | Reasonable bet | Name who briefed it, who read it and who chose its tests |

The two roles meet at the two ends of a draft. A product manager decides which question a first version has to answer, before anyone falls in love with one. An agile lead (a Scrum master, a delivery lead, an engineering manager who runs the week) makes sure somebody reads, doubts and answers for what goes live. Do both, and a weekend of prototypes becomes the fastest lesson your team has had (our bet).

> **Line to keep:** When everything works, your question has to do the choosing.

## Which question do they answer?

Bianca's reply to Tyler took until noon:

"None of them yet. My question was too wide, and that's mine. I should have asked this: when the morning starts at site three, how does the shift lead know which trucks the night shift moved, and why? We'll know on Thursday, at the rehearsal: three moved trucks, and the shift lead says where and why without phoning anyone. I choose that day."

Writing the problem before the solution is old advice. What's new is that answers now come first, already running, and you dig the question out from under them. Post how you'll judge before you pick; a standard written afterward can end up describing your favorite.

Bianca sorted the twelve. Four answered half of her question, one answered all of it with a pen, and seven answered something else. On Thursday the shift lead took the page, explained all three trucks and asked for one more column: who moved it.

### Practice: the question above the pile

**If you do only one, do this one.** Bianca's noon message fills in this pattern: `[person], at [moment], needs to know [what]. We'll know it helps if [what anyone could watch]. [name] chooses on [day].`

**Your turn (10 minutes, then a message).** Take one pile your team must choose from. Ask someone who'll live with the result what they need before they touch anything. Fill in the pattern from their answer and post it above the pile. **Done means** a teammate sorts the pile into *answers it* and *answers something else*, and you'd have sorted it the same way.

## No to something that works

Anything live by the 23rd had to be signed by Wednesday. On Monday afternoon the engineer with the best of the four screens called Bianca. "Mine works. The page is paper."

### Practice: a no they can check

**First draft (what a kind product manager says).** "It's great, and everyone loved it. Timing's tight with the go-live, there's the security side, and it's a bit out of scope. Maybe we look again after the peak?"

**What's wrong.** Praise, three reasons he can't check, and a maybe. He'll spend the week improving it for a date that doesn't exist.

**Better.** "It works, and I'm not putting it into site three. The shift lead needs the reason a truck moved, and the page gets it with a pen. Reading yours takes about two hours, which site three's own changes need. Your grouping by door is better than the page's. Can I use it?"

He pushed. "It took me an afternoon." "It did. Somebody also signs it, and answers for it on a night in December."

**Your turn (5 minutes).** Write your no to the last thing that worked and shouldn't go in. **Done means** its maker can repeat your reason and what you kept.

### Ship it, or check it?

So why could the page skip the check that stopped the screen? *Ship it and learn*, at its best: one morning in real hands can teach you more than a month of opinions. *Never skip the check*, at its best: nobody on a dock at night can tell a prototype from a product.

Decide on four facts: can it be undone, how far does a mistake reach, who pays for it, how often will it recur? The page can be thrown away, reaches one shift and costs a minute, so Bianca decides and reports. A wrong line on a live screen misleads every shift until someone notices, and a customer pays. There the check stays, built into the tools where it can be, and whoever holds it says what it catches. Write it down as a list where high-stakes work repeats, and use judgment for the rest.

## "I built it on Sunday"

On Monday evening site three's manager sent Bianca a link. In October Bianca had refused texts to drivers for this go-live, with a yes or no for spring by 15 January. "I built it on Sunday, with an assistant. It works."

She phoned. "Show me the part you needed most."

It texted each driver a time. "They don't need a door," the manager said. "They need to know if they can sleep."

Bianca had planned a door. The build corrected her question in a minute, which months of tickets hadn't done. Then she put it through the second-question test. It rested on times the manager typed by hand. It stopped at six drivers who had agreed. Nobody had decided who answered for it, or for their numbers.

"Thank you. I had the wrong question, and now I have yours. It's still no for the 23rd: times from the live scheduler need new access, and that takes ten working days of review. You'll have your yes or no by 15 January. Before the next text, please show Otávio, your head of security. Those numbers are his to clear."

The manager sent Otávio the link that night. Anyone who brings you a build has shown you what they mean. Take the question first, and judge the build second.

### Practice: before you judge the build

| Instead of | Say | Why |
|---|---|---|
| "We can't support that." | "Show me the part you needed most." | You get the problem before the argument |
| "It won't survive real use." | "Which parts are real, and which did you type?" | They find the limit themselves |
| "We'll add it to the roadmap." | "It's still no for [date]. You changed my question to [it]." | The no holds, and the credit is exact |

**Your turn (5 minutes).** Before you answer the next build somebody brings, send one sentence on what it taught you about the problem. **Done means** they confirm that sentence or correct it.

## What the board can't say

Tyler leads delivery at Tolva, where a named engineer reads and signs every change an agent writes. On Tuesday the agents had posted nine lines overnight, all green, and the stand-up was reading them aloud. At the sixth, he stopped it. "That's on the board, and it's right. What are you about to sign, and which part don't you trust yet?"

"The confirm button on site three's dock screen," said an engineer. "The tests pass, mine included. But I've only pressed it with bare hands. They wear freezer gloves."

"I'll press it in gloves this afternoon, before you sign," said Diego, Tolva's engineer in Rotterdam.

An agent reports what ran and, told to, what it left out; whoever signs still has to say what they doubt. Then Bianca asked whether all four changes in the queue could go in before the 23rd. Tyler had a number.

"Four hours of reading left before Wednesday's signatures. The last ten changes took about two hours each, opening to signature, and none of them touched the dock screen. So two go in, maybe one. Which is first?"

That's a sized claim about capacity. The tempting fix is to hurry the readers, whose reading is the point of the rule. Both ideas are old: speed up one step and the wait moves; hold work back from the step that is full. Our bet is that the full step is now the reading.

### Practice: what only you can say

`I'm about to sign [what]. I don't trust [part] yet, because [what nobody has tried]. I need [what] from [name] by [time].`

**Timed drill (30 seconds).** Say yours aloud for work you'll put your name to this week, with nothing the board already says. **Written form.** Post the three sentences before the meeting. **Done means** a colleague who missed it can say what is waiting, and for whom.

## Nobody wrote it

In the retrospective after site two's go-live, one line in the notes blamed the agent whose change to the driver texts had gone back three times. Everyone agreed, and nothing followed. In August, Tyler would have let it pass.

"Nobody here wrote it," Tyler said. "Somebody briefed it, somebody read it and somebody chose its tests. What did each of us know?"

"I briefed it," said Bianca. "I wrote 'one text with the door'. I never said what happens when a supervisor moves the truck."

"I read it," an engineer said. "No test moved a truck, so I found it by hand, in the third version."

Asking what people knew at the time is common practice after incidents. With agents, the blame can land on something that isn't in the room, which is comfortable and teaches nothing. Look for the decisions. People made all of them.

### Practice: the line without a person

**First draft (what a careful team writes).** "The agent kept getting the driver texts wrong. Brief it better next time."

**What's wrong.** The one it names can't change anything, and nobody can check "better".

**Better.** "The brief said one text with the door and left out trucks that move. No test moved one. From Monday, a brief that sends messages says what happens when the plan changes. Bianca writes the first by Friday."

**Your turn (10 minutes).** Find a line in your last notes whose subject is a tool. Rewrite it as decisions, and show it first to whoever it now names. **Done means** every sentence has someone who can say "yes, I decided that", or a fact the record shows.

## Three moves, starting this month

1. **Put a question above every pile.** First step: before your next day of prototypes, talk to one person who'll live with the result, then post the question.
2. **Plan by reading.** First step: time the next ten changes from opening to signature. Write the hours left where you now count drafts.
3. **Give one meeting back to people.** First step: for two weeks, leave out whatever the board says, and tally the requests and decisions it produces. If the tally stays at zero, cancel the meeting.

## The sentence that is yours

A product manager can say, "This is the question we chose, and these are the ones we left." An agile lead can say, "This is how much we can answer for by Friday."

Check the bets twice a year, against your own record: where finished work waits longest, and how many first versions reached the person they were for. If the waiting has moved away from reading, move your plan with it.

## For everyone else

Ask a product manager: "Which question is this answering?" "What did we leave out to do it?" "What would make us drop it?" Ask an agile lead: "Where is work waiting?" "What does the team doubt?" "How much can you read this week?"

Stop asking only how long it takes to build. Stop asking whether the agents can just do it; they can, and then somebody has to read it. When you bring your own build, bring three lines with it: who it's for, which parts are real and what you skipped.

## Words to use

- "It works, and I'm not choosing it. Here's why."
- "Building it took [time]. Reading it takes [time], and we have [time]."
- "That's on the board. What don't you trust yet?"
- "Somebody briefed it, read it and chose its tests. What did each of us know?"

### Phrases you will hear

- "It's only a prototype": nobody has decided yet who answers for it. Ask who will.
- "a quick win": a small result you can have soon. Ask what happens to it afterward.

## When it backfires

**Nobody knows the question yet.** Then ask wide, and say so: "This week we're looking. Nothing gets chosen."

**The build is your boss's.** Lucía runs the company, and one of the twelve was hers. Bianca told her first, alone, which question it answered. With less standing, ask privately what it's meant to help decide, and let the person who'd use it do the judging.

**The number becomes a wall.** "We have no hours" ends every conversation if nobody can check it. Show the count, and say what would raise it.

**Doubt gets punished.** Ask for doubts where they've cost somebody before, and you'll hear "none". Go first with one of your own, and thank the next person by acting on it.

**In a second language.** "It works, and no" can sound like a contradiction. Say the no first.
