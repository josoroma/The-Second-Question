# On the page

Your page may reach its reader as two lines in a list on a phone.

On the evening of 30 September, Bianca's two were these:

"Subject: Incident summary, board demo, 30 September"

"Hi all, please find below an overview of the events before and after today's interruption."

Bianca is product manager at Tolva, whose scheduler sends trucks to doors at Veldhaven, a food wholesaler in Rotterdam. That day Tolva's demo to Veldhaven's board had frozen on a test connection. Lucía, Tolva's chief executive, had promised Veldhaven's chief executive the cause in writing that night, and had asked Bianca to write it up.

Under those two lines came a full page: every minute in order, from what Diego, Tolva's engineer in Rotterdam, had found in the logs that afternoon. The cause was in line nineteen. The page was going to three people: the engineer who would fix the fault, Claire, who runs operations at Veldhaven, and the chief executive.

Before she sent it, Bianca sent it to herself. In the list on her phone, between a calendar reminder and a parcel notice, it showed a date and "please find below".

She read it as each of the three. The engineer would find nothing to fix, Claire nothing about her docks, and the chief executive nothing about Friday. On Friday his board would decide whether to keep the November dates for sites two and three.

No single pair of lines could serve all three, so she wrote three.

## Written for someone who stops early

On a call, Claire would have interrupted to ask about her docks. A page can't be interrupted. Whoever opens it decides alone, from the top, whether to go on.

So write the first two lines for a reader who will stop there, and make sure that reader still does the right thing. Everything below them answers the second question, for the reader who wants to ask it. Two lines are a target this book sets: in a message, the subject and the first sentence; in a chat, the first two sentences. Line one is the front half of your point sentence, what this reader should do or believe. Line two is the day, the reason, or the news that you need nothing.

> **Line to keep:** Who reads your third line? The person your first two were written for.

Putting the news first is old newspaper practice. A newspaper has to choose the news for everyone; you can choose it for one person.

Get good at this and your work moves while you sleep. An engineer in another time zone starts the fix, a client answers her own team, a board decides, and nobody books a call to find out what you meant. If the two lines won't come, more page won't help. You haven't decided yet, and *Know what you think* is the way back.

| On the page | Line one | Line two |
|---|---|---|
| A message | What you want them to do or know | By when, or "nothing needed" |
| A document | The decision it asks for or records, as a sentence | Who decides, and by when |
| A spec | What someone will be able to do that they can't do today | What you will both see when it's done |
| A review comment | What you saw happen, and where | Must change, or optional |

## Three questions about one freeze

Bianca wrote one question beside each name. The engineer would ask, "What do I change, and how will I know it's fixed?" Claire would ask, "Does this touch my docks?" The chief executive would ask, "Does this change what I decide on Friday?"

Here are her three pages.

**To the engineer who looks after the replay program.**

"Subject: By Friday, please make the replay program renew its token"

"It froze today in front of Veldhaven's board because it never asks for a new one. Done when a replay that waits twenty minutes after connecting still runs to the end on the test copy."

"Why, from both logs: since August's security change, a token lasts ten minutes. Diego connected before the meeting, and the token ran out two minutes into the replay. The program kept asking with the old one and timed out. At yesterday's rehearsal we started right after connecting, so it never showed. The live scheduler already renews, so leave it alone. Not checked: two other test programs share that login. Could you look tomorrow?"

The history that buried the first version is exactly what this reader needs, so it stays, under an action and a done condition. "Done" is an observable version: two people can watch the same replay reach the end.

**To Claire.**

"Subject: Nothing changes on your docks after today's freeze"

"The fault was in our test program, site one's live scheduler kept assigning doors, and I need nothing from you."

"If a supervisor asks: the program's connection to your test system expired, and renewing it was our job. The live scheduler renews its own; Diego checked its log tonight. None of our dates moves. The stall on the 28th was a different fault, and that report stands. Lucía is writing to your chief executive tonight, and her page says the same."

No token, no logs. Line two tells her she may stop reading, and the rest hands her the sentence she will be asked for on a loading dock.

**To Veldhaven's chief executive, from Lucía.**

"Subject: The cause of today's freeze, which was ours"

"A test program let its connection to your warehouse system expire. Site one's live scheduler doesn't have that fault, and we have found nothing in it that touches 9 or 23 November."

"You asked about three in the morning. The live scheduler renews its connection by itself. Diego read its log back to the first night, and every renewal worked. That is two nights, so it says nothing yet about December. The stall on the 28th was a different fault; you have that report. One thing this did show: we changed those connections in August and never ran the test program long enough afterward. Two others share its login, and by Friday you'll hear from me what we found in them. I'm sorry it happened in front of your board. Lucía"

His own question comes right after the two lines, and the limits come before he has to ask for them.

Bianca's draft of that page had said "so this can't happen live." Lucía, whose name would go under it, called her. "What does 'can't' rest on?" It rested on Diego having read the program. In the basis words of *How sure are you? Say that*, that was *reasoned*, and the chief executive would have taken it as *checked*. So Diego opened the live log and read every renewal since the first night. "Can't" came out, and the two nights went in.

All three went out that night. The engineer started in the morning with nothing to ask. Claire didn't answer, which is the right reply to a page that needs nothing. The board had Lucía's page when it met on Friday, and kept both dates. Bianca's first version became the record, attached under all three.

## Below the second line

Below the two lines, use next-question order from *Give it a shape*: each part answers what this reader would ask next. On a page you can print those questions as headings. "Background" and "Considerations" tell a reader where you put your material. "What if the text doesn't arrive?" tells them whether to read on.

That Friday, with both dates kept, Bianca opened the spec for texting site two's drivers like this:

"From 9 November, a driver at site two gets the door by text instead of walking to the window. Done when a driver whose carrier sent a number by 15 October gets one text with the door, and a driver without a number can still ask at the window."

Her headings were what the engineer would ask next: *What if the door changes? What if the text doesn't arrive? What stays as it is?* Under the second she wrote, "Open. I decide by Monday." A question you haven't settled belongs on the page, with a name and a day.

A title can be line one. "Caching options" waits for a reader with time. "Cache prices for an hour; the checkout team decides on the 8th" has asked its question before anyone opens it. When one document serves several readers, give each a line at the top, by name: "Support: the old export stops on the 12th. Finance: nothing changes."

## A comment on someone's work

The reader of a review comment made the thing you are commenting on, and reads it alone. Line one is the observable version: people who disagree about "fragile" can still agree that this input gave that result. Line two is the weight. Leave it out, and the author has to guess which comment stops the release and which is taste.

> **Research says:** Across five experiments, people writing e-mail believed their tone, sarcasm or humor included, came across better than it did. Later studies by other groups, one of them on text messages, point the same way. The five were about tone and say little about facts; our step is to put a comment's fault and weight in plain words and keep the joke for a call.

### Practice: the comment on line 41

**Situation.** You're a data scientist reviewing a teammate's pull request, a query that counts active customers for Monday's report.

**First draft (what a careful reviewer writes).**
"Nice work! The join looks a bit fragile to me. Are you sure about the counts? The naming could be clearer too, and maybe we should think about caching at some point."

**What's wrong.** "Fragile" and "clearer" are verdicts with nothing to run. "Are you sure?" asks the author to defend everything. "A bit" and "maybe" protect the reviewer, and three points arrive at one weight.

**Better.**
"Please change before merging: line 41 counts a customer twice when they have two addresses. On last week's data, 1,131 customer numbers come out as 1,204 rows. Counting distinct numbers would fix it, if no two customers share one. I haven't checked that."

"Optional: `tmp2` would read better as `active`. Merge without it if you like."

The author answers: "Some do. Since June, families can share a number." You write back: "Then my fix is wrong for them, and the double count is still there. How do you tell two people on one number apart? I'm free at three if talking is faster."

**Why it works.** The author can run it, and the first words say what blocks the merge. Because the comment gave its limit, the author could correct the fix and leave the finding standing.

**Your turn (10 minutes).** Take your last review comment, on code, a design, a document or a slide. Write line one as what you saw and where, and line two as *must change* or *optional*. Delete any question whose answer you already know. **Done means** someone who hasn't seen the work can say what the author must change, and what would show it's fixed.

## Practice: two lines on a phone

**If you do only one, do this one.** Ten minutes, with something you must send this week that needs a person to act.

1. Write one reader's name, and the question they will have when it arrives.
2. Write two lines that reader could stop after.
3. Send it to yourself, and open the list it lands in.

**With a person.** Show a colleague the list with everything else covered, and ask, "What will [name] do, and by when?" If the list cuts your lines short, shorten them. Then send the page, and watch the first reply. The decision, or the step already taken, means the lines did their job. "Thanks for the update" from someone who had to decide means the ask never reached the top. **Done means** your colleague named the action and the day, and the first reply didn't ask what you needed.

## Words to use

- **To open.** "Please [do this] by [day]: [the reason]." "Nothing needed from you. [What changed], and [what it means for you]."
- **To ask for a decision.** "I need a yes or no on [one thing] by [day]. I recommend [choice]; the reasons are below."
- **In a review.** "Please change before merging: [what I saw, and where]." "Optional: [suggestion]." "I don't know this part. What happens when [case]?" (Only if you don't know.)
- **When nobody answers.** "Did this reach you? If I don't hear by [day], I'll [a step we can undo]."
- **To leave a long thread.** "We've each said this twice in writing. Can we talk today? I'll write down what we decide."

### Phrases you will hear

- "nit": a small, optional point in a review.
- "for visibility": so that you know. Ask, "Is there anything you need from me?"
- "as per my last message": I already told you. The writer may be annoyed, so answer the point.

## When it backfires

**When it shouldn't start on a page.** Criticism of a person, an apology for real harm, news that will hurt: say it first, and write it afterward. *The hard conversation* shows how.

**When the reader has power over you.** "Please decide by Friday" can read as an order going up. Give the day its reason, and leave the choice with them: "The test window closes on Friday. The next one is the 14th, if you'd rather wait."

**When this team opens differently.** A page with no greeting can look cold. Keep the greeting to one line, put your two lines right after it, and ask how people there like to be written to. *Across borders* goes further.

**When everything is marked urgent.** If each subject says "decision needed", readers stop believing it. Write "nothing needed" as readily as "please".

**In a second language.** *Must*, *should* and *could* can arrive stronger or weaker than you meant. "Before merging", "optional" and a date are harder to misread. Decide the two lines in whichever language is faster, then write them in short sentences.
