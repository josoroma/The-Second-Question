# Story for people who think in systems

"What would you tell site two's manager about the texts?" Bianca, Tolva's product manager, wrote to Mateo at lunch on the first Monday in July.

Mateo, Tolva's co-founder and chief technology officer, wrote back: "That his drivers hate the walk. Texts are after the peak, though." Tyler, the delivery lead, remembered "something about the window".

That morning, on Tolva's weekly call, Bianca had shown them a number on a slide, in large type. It read: "Site two, June mornings: a truck waits 19 minutes between the gate and its door. 8 of them are the driver's walk to the window and back." She said it once, clearly, with its source. The call moved on without a question, and by lunch the eight minutes were gone.

Tolva was putting its dock scheduler into Veldhaven's three warehouses, one site at a time from September. Diego, the engineer Tolva placed there, had pulled the number from site two's gate log, which also times each driver at the window. In June, site two's manager had asked for one thing: a text telling each driver which door to use, so nobody walks to the window to ask. Bianca had promised him a yes or no by the end of July on whether texts at his gate alone could be ready before November.

## What the room kept

The number failed for two reasons, and neither was the way Bianca said it.

Nobody on the call had stood at site two's window, so eight minutes of walking counted something none of them could see. They kept the part they could picture: drivers who dislike walking.

It also counted the wrong thing. Mateo decides what Tolva's engineers build and when, and a driver's eight minutes doesn't tell him whether texts are worth an engineer before November. Bianca had started from the request she was passing on, so her number measured the request.

To carry a number into someone's decision, let them see one case of what it counts. Then show that the case was ordinary, in the units they decide in. If you think in systems, you have good reason to distrust a story: one truck proves nothing, and a vivid one can push a decision further than the data allow. Keep the distrust, and build it into the story. Done well, your number becomes what they repeat to the next person who decides.

> **Line to keep:** It is the count that turns an anecdote into a reason.

## The working story

The tool is **the working story**: under ninety seconds, a limit this book sets, built backward from what the listener must decide.

- **The decision**, written first, never told first.
- **One moment**: a time, a place, a person, one thing said or seen.
- **The count**: the number that shows the moment stands for a pattern, or the honest statement that it is one case.
- **The handover**: the decision you ask for, in one sentence.

Never in place of the answer to a direct question.

Write the decision first, because it chooses the moment and the count. Put it at the top of a card as the listener's choice: "Mateo: one engineer for texts in October, yes or no?" Mateo decides about engineers and doors, so his story needs a door.

Then keep it to yourself until the end. Almost everywhere else in this book the point comes first; here it waits, because nobody asked, and the moment can make the listener want the answer. Said first, the decision can turn the moment into your argument, and a careful listener may start looking for what you left out.

Give the moment one detail the listener could check, and cut the rest. It can come from someone who was there, or from one row of your data, told at the speed it happened. Either way, it must have happened.

> **From practice:** Before you build a story on one row of a log, find where that row sits in the whole set: near the middle, at the edge, or alone. Then say which. A worst case later found posing as a typical one gives the listener a reason to doubt the rest of your table.

Put the count in the units your listener decides in. If you have only one case, say "one": that is a count too, and it keeps the moment honest.

The handover asks for the decision as a question they can answer, and then you stop. If the story runs long, cut words from the moment. Never cut the count.

## One truck, three decisions

Bianca wrote Mateo's decision on a card and asked Diego for a moment. On Thursday he stood by site two's window from five to seven and sent her one message: "6:04, a truck through the gate, door eleven free. The driver walked past door eleven to the window, waited behind four others and came back with 'eleven'. Nine minutes on foot to carry one number."

The gate log could have given her a row. Diego gave her the detail no log holds: the driver walked past the free door on the way to ask for it.

On Monday Bianca asked Mateo for three minutes and told it:

"Last Thursday at 6:04, a truck came through site two's gate. Door eleven was free. The driver walked past it to the window, waited behind four others, was told 'door eleven' and walked back. The truck reached the door at 6:15. For nine minutes, a free door and a waiting truck were a hundred meters apart, and the only link between them was a driver carrying a number on foot. That was an ordinary truck: in June's log, the walk takes eight minutes. At about sixty trucks a morning, it's as if two of site two's doors were shut from five to nine. Texts would put the number in the cab at the gate. Can one engineer have the first two weeks of October to build them?"

Mateo asked one question, and it was about the count: "Eight minutes across all of June?"

"Every morning in Diego's log."

"Then it's two doors, every morning, and in December we'll need every door we have. If Claire wants texts at go-live, you can have the engineer."

Claire, who runs operations at Veldhaven, decides something else: whether site two takes one more new thing on its go-live day, 9 November, a few weeks before her December peak. Her version kept the truck to one sentence and answered the risk she would raise:

"Last Thursday at 6:04, a driver at site two walked past door eleven, which was free, to your window, and came back nine minutes later with the number eleven. June's log says that was an ordinary truck: every morning the walk leaves about two doors' worth of time unused, and those are doors you'll want in December. Mateo can have texts ready for site two's go-live, and if they fail, the window still works. Do you want them from 9 November, or after the peak, as planned?"

"From the ninth," Claire said, "for carriers who send you their drivers' numbers. The window for everyone else."

Site two's manager got no story at all. In June he had asked for a commitment, and the answer was due. Bianca's message on the last Thursday in July began: "Yes. Texts start at your gate on 9 November, when the scheduler goes live there, for every carrier that sends us drivers' numbers by 15 October. Drivers without one still use the window. What moved it was your doors: the walk keeps about two of them idle every morning."

Each telling began from a different decision, so each kept a different count: doors for Mateo, the peak for Claire, the manager's own doors, after the answer. Bianca had started the month passing on site two's request with a number attached. She ended it saying which problem the request solved and for whom.

## When a story is the wrong answer

"Lead with a story" suits a room that hasn't asked you anything and needs something to see before it will weigh a number: that was Bianca's Monday call. "Answer first" suits a person who asked a question and needs the answer before anything else: that was site two's manager, who had lived a hundred of those mornings and was owed a yes or no.

The rule: a question gets its answer first. Tell the story when nobody has asked, there is time and you want to be remembered.

## The company's story

A company's story is a working story too, with the listener's decision at the top: whether to join, to buy, or to look closer. The founding moment is tempting. The moment that serves their decision is usually a customer's: one morning when your product changed something a person could see.

Then give the count you can stand behind, however small. Tolva's is still one: at a single pilot dock the year before, the average truck waited about twenty minutes less over six weeks, by Veldhaven's own gate log. Until a whole site is live, "one dock, six weeks" is the honest count, and saying so lets a careful listener believe the rest.

## Practice: the build that failed on Thursday

**Situation.** You are an engineer on a small product team. On Friday your head of product decides whether next sprint goes to fixing flaky tests in the build or to a feature the sales team wants. Nobody has asked you yet; you have two minutes at the start of planning.

**First draft (in the engineer's own numbers).** "Our pipeline fails about one run in six on flaky integration tests. Each failure takes around forty minutes to get back to green, so last month that was roughly sixty engineer-hours of reruns. I'd like us to prioritize test stabilization."

**What's wrong.** All the numbers are in the team's own units: runs, green, engineer-hours. Your head of product can't see any of them, and none measures what she decides about: what reaches customers, and when. "Prioritize test stabilization" is a topic, not a decision she can say yes to.

**Better.** "Last Thursday at five, the fix for the checkout error was ready. The build failed twice on a test that has nothing to do with checkout, and the fix reached customers at seven, after the evening orders it was meant for. Thursday was ordinary: one build in six fails like that, and last month the reruns took about a week and a half of one engineer. Can next sprint go to the tests, and the sales feature to the sprint after?"

**Why it works.** She can see a finished fix waiting while orders came in. The count, in her units, shows that Thursday was an ordinary day. The handover is a choice she can answer in one word.

**Your turn (10 minutes).** Take a number you want someone to act on this month. Write their decision at the top of a card. Under it, write one moment the number counts, then the count in the units they decide in, then the handover as a question. Say it aloud once, decision last, in under ninety seconds. **Done means** a colleague who hears it once can tell you the moment, the number and what you asked for.

## Practice: tell it this week

**With a person.** **If you do only one, do this one.** Pick a decision someone must make this week who hasn't asked you about it, and put your working story for it on a card. Tell it once, in the meeting or the message, then watch the first reply. A question about the count ("Is that every week?") means they are weighing it. A question about the moment ("Was that a bad day?") means the count came too late or too weakly, so next time put it right after the moment. "So what do you need?" means the handover didn't land: say it again as a question. **Done means** your listener, asked that evening what they would tell the next person who has to decide, names the moment and the number.

## Words to use

- **To open with the moment.** "Last [day] at [time], at [place], [one thing someone did or saw]."
- **To give the count.** "That was close to an ordinary [day]: [the number, in their units]." "This is one case. I haven't counted the others yet."
- **To hand over.** "If that's worth [the cost] to you, I'd like your decision by [day]."
- **When they ask a direct question halfway through.** "[The answer]. The morning behind it takes a minute, if you want it."
- **When someone tells you a story.** "Was that a typical [day]?" "What are you asking me to decide?"

### Phrases you will hear

- "That's anecdotal." It's one case, and they want the count.
- "Put a face on it." Show me one person or case it affects.
- "Don't cherry-pick." Don't choose only the cases that help you.
- "What's the takeaway?" What should I remember, or decide?

## When it backfires

**When the moment outweighs the count.** A vivid case can carry a decision further than its count can. If your count is weak, or only "one", say it before the moment, or leave the moment out.

**When they hold the power.** Someone senior and short of time may hear a story as a delay. Give the handover first, in one sentence, and offer the moment after it. With a client, tell their own mornings, and never tell one client's morning to another without asking.

**When the room distrusts stories.** In some teams a story in a decision meeting sounds unserious. Lead with the count and keep the moment to one sentence.

**When every update becomes a story.** Listeners may learn to wait for the ending. A weekly status gives the answer first; keep the working story for decisions people have to care about before they choose.

**When the moment gets improved.** If you build a typical morning from the log, say that you built it. A composite told as one real morning works only if nobody checks, which is what makes it manipulation.

**In a second language.** A moment needs only a few kinds of sentence: what happened, where, and what someone saw. If telling it feels harder than giving numbers, write the moment as three short sentences and say them as written.
