# Data scientists

Sarnik, a food distributor near Lyon, must decide: open its dock early every morning in December, or only when the trucks need it? Naomi, a data consultant in Seattle, has a forecast. On Tuesday 10 November she presents it by video to Hugo, who runs Sarnik's operations, and the finance director.

Naomi: "You plan to open the dock at four every morning in December. By eight the evening before, the forecast can say which mornings need it: more than eighteen trucks between five and seven. Of twelve such mornings this autumn, it named ten."

Sarnik's finance director: "Did you calculate that yourself?"

Naomi: "No. A coding agent our contract allows built it and ran it over forty-four mornings. Before it started, I picked eight of them and worked those out by hand, using only what's known at eight in the evening. On two of the eight, it knew something I couldn't find."

Hugo: "What?"

Naomi: "The changes your carriers make overnight. It had read the bookings as they stood the next day. With those, it named all twelve. Without them, ten."

Finance director: "So the better number was the wrong one."

Naomi: "Yes."

Finance director: "How would I know if ten is wrong too?"

Naomi: "None of the forty-four was in December. If it misses two busy mornings in one week, stop using it and open at four every day, as you planned."

Hugo: "And at five in the morning, who answers for it?"

Naomi: "I do. It's eight at night in Seattle."

Finance director: "Then give me one page for the board."

Hugo: "And one for the wall at the dock."

## A number she hadn't computed

Naomi's forecast of truck arrivals has run at one Sarnik warehouse since July. In October she raised her rate with both her customers and kept both. The calibrator's habit, from *Who does well now*, had become hers.

Her strongest word on that call was "No." Everything after it could be checked. Sarnik needed someone who had redone a piece of the arithmetic and knew what would make her drop the result. A machine can compute the result. Speaking for it is yours, and you can train it.

It takes three answers: what is claimed, what it rests on, and how you'd know if it were wrong. They come from the second-question test of *Start here*. Asked of a number:

- *What is the point?* What this person would do differently on Monday if they believed it.
- *What does it rest on?* What the machine ran is *told* (*How sure are you? Say that*). What you redid is *checked*.
- *Where does it stop?* What it has never seen, and what would make you take it back.
- *What do you want from me?* One decision, with its day.
- *Who answers for it?* You, by name.

The redone piece does the most work. Pick it before you see the result, where a mistake would cost most, and use only what was known at the time. Spot checks are old practice. Choosing first keeps the machine's answer out of yours.

> **Line to keep:** To stand behind a number, say what would make you take it back.

### Practice: a number you already passed on

**If you do only one, do this one.**

**Your turn (15 minutes).** Find a result a machine computed and you passed on this month. Redo one piece by hand, picked before you look at its answer. Then tell a colleague about the result in five sentences, one per question. **Done means** they can say which piece you redid and what would make you take the number back.

## What is shifting

The visible part of the job is getting cheap to draft (reported). What doesn't get cheap is knowing which question was answered, and noticing a wrong answer (our bet).

*Reported* is testimony, often from people selling the tools, *checked*, in these tables only, has a published finding behind it, and *our bet* is this book's reasoning. *Durable* held through earlier shifts and rests on more than testimony, *reasonable bet* is good reasoning on thin evidence, and *open* says what to watch.

| What is shifting | Basis | Grade | The step worth taking either way |
|---|---|---|---|
| Agents draft the query, the feature, the chart and the paragraph under it | Reported | Reasonable bet | Write down first what the result must prove |
| People overseeing automation can miss what it missed, as *Engineers and architects* reports | Checked | Durable | Redo a piece, picked before you see the result |
| Managers put their data questions to an assistant and skip the analyst | Reported | Open: watch who gets called when two answers differ | Define in writing the few numbers your company repeats |
| Trust in a number moves to whoever says what would retire it | Our bet | Reasonable bet | Send any forecast people act on with its stopping rule |

Five conversations are changing with it.

## The board's page and the dock's wall

Naomi wrote both that afternoon. On the call she had also counted the false alarms: three mornings in forty-four. "Four people, one hour, three times," Hugo said. "I can pay for that."

### Practice: one result, two pages

**First draft (what a careful analyst sends to both).** "The classifier reached a recall of 0.83 and a precision of 0.77 on 44 held-out mornings."

**What's wrong.** Neither reader can find a morning in these figures.

**Better, for the board.** "Please decide by Friday: open the dock at four every morning in December, or only on mornings the forecast names. I recommend the named ones. Over forty-four mornings, that would have meant thirteen early starts, ten of them needed. On two busy mornings the dock would have opened too late. A coding agent ran it. I redid eight mornings by hand, found one fault and fixed it; now all eight agree. None was in December. If it misses two busy ones in a week, Hugo goes back to four every day. I answer for it."

**Better, for the wall.** "From tonight, by eight, the dock screen says *four* or *five*. Until 1 December it's a trial: open as you do now. After that, *four* means more than eighteen trucks before seven, and the early team starts at four. This autumn, you'd have come early for nothing on three mornings. On two it would have said *five* and the yard would have filled. If that happens, call your shift lead: what you see outranks the screen. Please write the date below. I read this sheet every day. It counts trucks and nothing else."

**Why it works.** Two listener sketches. On a quiet morning the board stands to lose an hour's pay, and the dock team an hour's sleep. Each page says what its reader does when the forecast is wrong.

**Your turn (10 minutes).** Take a result with two readers: whoever pays, and whoever's morning changes. Send each three sentences. **Done means** each can tell you what they'd do on a day it's wrong.

## The brief that forgot the clock

The overnight changes got in through Naomi's first brief, in late October. It never said what time it was, so the agent read the list that carriers edit all night. The field calls this *leakage*: the model sees something it won't have on the day.

### Practice: a brief with a clock in it

**First draft.** "Which mornings at Sarnik will be busy? Use whatever helps."

**What's wrong.** Unless told otherwise, an agent usually reads whatever it can reach.

**Better.** "Count tomorrow's trucks between five and seven. It's eight in the evening: use the bookings I saved at eight, never the live list. Before you build, list every field you'll read and the hour it gets filled in. Then wait for me. Don't read these eight mornings."

Nine fields came back. One gets filled in at the gate, at six. She crossed it out.

**Your turn (10 minutes).** Ask for that list about the last feature an agent built for you. **Done means** a colleague can mark each field *before* or *after* the forecast without asking you.

*Safe practice: before you paste anything into an assistant, change names and figures and leave out anything confidential, or use a tool your employer has approved; treat its feedback as one agreeable opinion, not a grade.*

## Nine charts

In October an assistant built Naomi a page of nine charts for Claire, who runs operations at Veldhaven, her other customer. By month's end it had been opened six times, four by Naomi. "Did you get a chance to look?" would have earned a polite yes, so she phoned and asked something else.

"What did you last do differently because of that page?"

"Nothing. I forward the first line of your weekly note."

"Then which number, at what value, should make me phone you?"

"Site one, under seven in ten, two weeks running."

The nine charts became one line and one phone call.

### Practice: two questions for a page

**Your turn (5 minutes).** Say these aloud, then ask one reader: "What did you last do differently because of this page?" "Which number, at what value, should make me call you?" **Done means** one chart has a value and a name beside it, or is gone.

## The number the sponsor wants

At a chain of bakeries, a data scientist has finished an eight-week pilot: a forecast of how much to bake. The head of stores wants "waste down by a fifth" in writing. She has told her chief executive already. The figure came from the data scientist, in week two.

### Practice: the number you can sign

**First draft.** "It depends how you cut it. The first two weeks do show a fifth, so technically we could say 'up to'."

**What's wrong.** It helps her repeat what the other six weeks don't support.

**Better.** "I can't sign a fifth. Over all eight weeks, of every hundred loaves we used to throw out, we saved about ten, between five and fourteen. I gave you two weeks without their limit, so the correction is mine. Shall I draft it, so your chief executive hears it from you today?"

**Your turn (5 minutes).** For a pilot that hasn't reported yet, send the sponsor one line: "We'll report [number] over [weeks], whatever it says." Agreeing it first is old practice. **Done means** their reply is dated before the first result.

## The morning it missed

Wednesday 11 November was a public holiday. At eight that evening few carriers had booked, and the screen said *five*. On Thursday the yard filled. After a miss in October, Naomi had gone quiet on Claire for three days (*Difficult people*). This time she wrote to Sarnik at ten past seven, before anyone had asked.

### Practice: the miss, before they ask

**First draft.** "As I said on Tuesday, no forecast catches everything. A holiday is a known limitation, so I wouldn't read too much into one morning."

**What's wrong.** It never says how many trucks came, and nobody had told Sarnik about the limitation.

**Better.** "It said five, and twenty-six trucks came before seven. It missed. I hadn't told it about holidays; that may be the cause, and I haven't checked. Trial or not, I'm counting it as the first of two. Please don't use it the day after a holiday, and add that to the board's page today. You'll have my check by noon."

Hugo answered: "My shift lead knew on Monday, and brought the team in at four." She asked the shift lead for other mornings like that, and got three. A new line went up on the wall: "What do you know about tomorrow that isn't in the bookings?" On Friday the board chose the named mornings, plus the day after any holiday.

> **Research says:** In forecasting experiments, the same mistake cost an algorithm people's confidence faster than it cost a human forecaster. It's no general rule: in other experiments people followed advice more when told it came from an algorithm, and a finance experiment found no faster loss after an algorithm erred. So don't guess how a miss will be taken; reporting it first is our advice.

**Your turn (10 minutes).** Rewrite your last report of a miss in that order. **Done means** someone who wasn't there can say what to stop using today, and what you don't know yet.

## Three next moves

1. **Ask what the tables can't see.** This month, put one question beside a number people act on: "What do you know about tomorrow that isn't in the data?"
2. **Keep cases no agent sees.** This month, work a few by hand, store them where no agent can read them, and test the next result on them.
3. **Give each number a page.** This month, take the one your company repeats most. Write what it counts, what it leaves out and who last redid a piece.

Together they protect the sentence only you can stand behind: "This is what it counts, what it can't see, and what would make me take it back."

To check whether this still holds, look in six months at three results you spoke for. If redoing a piece never changed what you said, do less of it. If a wrong result reached someone, do more.

## For everyone else

Change four questions, and your data scientist's answers get better.

| Stop asking | Ask |
|---|---|
| "Can you just pull the number?" | "I have to decide [this] by [day]. What would help?" |
| "How accurate is it?" | "On how many days would it have been wrong, and what would that have cost us?" |
| "Did the AI do this?" | "Which piece did you redo yourself?" |
| "Can we show the better figure?" | "Which would you sign, and what would make you take it back?" |

When an assistant gives you a figure, pass it on as something you were told, and ask which definition it used. When you know something the data can't, like a closed road or a customer about to leave, say so early.

## Words to use

- "No, I didn't calculate it. I redid [piece], and it matched."
- "At [hour], we wouldn't have known that."
- "It would have been wrong on [number] of [number]. Each one costs you [cost]."
- "If [this] happens, stop using it and call me."
- "It missed. Here's what I know, and when I'll know more."

### Phrases you will hear

- "Directionally right": the trend may hold. Ask what the size rests on.
- "Massage the numbers": change what's counted until the result looks better.

## When it backfires

**They outrank you and want the other figure.** Say once, in writing, what you can sign and why. If they publish theirs, it goes out under their name. If it could harm or mislead people, use a formal route.

**"An agent did it" sounds like an excuse.** After a fault, it is one. Say it beforehand, with what you checked. If your contract doesn't allow the agent, don't use it.

**Eight matched, and it was still wrong.** A redone piece covers that piece. Say "eight", and keep the stopping rule.

**In a second language.** Counts are easier to follow than ratios: "ten of twelve mornings" needs no term. Say both slowly, then put them in the chat.
