# Engineers and architects

At seven in the morning on 17 November, an agent's pull request was waiting for Diego's signature. Its first line named him as its reader. It had arrived overnight: 214 lines, every test green, a description clearer than most people write, and no list of assumptions.

Diego is the forward-deployed engineer that Tolva, a Montevideo company whose software sends trucks to warehouse doors, has placed with Veldhaven in Rotterdam. Site three, Veldhaven's cold store, was six days from going live. Its manager had asked for one more thing: when a door breaks, move the trucks waiting for it. On Monday a junior engineer in Montevideo had briefed a coding agent and written twelve tests himself. Nothing an agent writes reaches Veldhaven until a named engineer at Tolva has read it, checked it against tests a person wrote, and signed.

"Looks good," Diego said to an empty office. Then he asked himself what those two words rested on.

They rested on the tests, and every test came from one brief. Mateo, the co-founder who runs Tolva's technology, might know what the brief had missed, but in Montevideo it was three in the morning. So Diego read it again the slow way, saying before each branch what a truck would do next. At line 90 he couldn't. *When a door closes*, the code began. The week before, he had watched door six close after a load of frozen peas, stay shut for twelve minutes while the room got cold again, and open. Nothing was broken.

What closes a door? The brief hadn't said.

## What is shifting

Agents draft code, tests, first designs and the description on top (reported). That makes a first version cheap. What it doesn't make cheap (our bet) is knowing what a change will do in a place the machine was never told about.

*Reported*: people in the work say it, many of them selling the tools, so read it as testimony. *Checked*, in these tables only: a published finding stands behind it. *Our bet*: this book's reasoning. *Durable*: it held through earlier shifts and rests on more than testimony. *Reasonable bet*: good reasoning, thin evidence. *Open*: nobody knows yet; the cell says what to watch.

| What is shifting | Basis | Grade | The step worth taking either way |
|---|---|---|---|
| Agents draft more of the code; people brief, read and sign | Reported | Reasonable bet | Note what your reading finds that the tests didn't |
| People overseeing automation can miss what it missed; training alone didn't remove that | Checked | Durable | Check each change against something its author never saw |
| First versions of code and designs are cheap; finishing and choosing aren't | Our bet | Reasonable bet | Estimate the finish separately |
| Newcomers write less of the code they learn from | Reported | Open | Have them predict, then run. Watch what they catch |
| Depth in one craft, or range across several | Reported, both ways | Open | Keep one craft deep. Watch what your reviews catch |

Our bet, then: an engineer's work moves toward saying, before a change runs, what it will do and where that knowledge stops. An architect's moves toward choosing a design in words that others can check. Both are said to people who can push back, and both can be trained.

> **Line to keep:** You can answer for the change you can predict.

Diego's change met five such conversations that Tuesday.

## What you checked, and where it stops

By half past eight Diego had replayed Monday's day shift from site three's log, and the pull request needed a comment. Otávio, who heads information security at Veldhaven, has two reviewers who read whatever a signer writes.

### Practice: the sign-off

**First draft (what a careful engineer writes).** "Looks good overall, nice clean change. All tests pass. Might be worth a second look at the door logic at some point."

**What's wrong.** A verdict with no basis, then a hedge where the finding should be.

**Better.** "Not signed. I read all 214 lines, and they do what the brief says. Our twelve tests pass here too. It stops at site three's doors: they also close after a frozen load, so the room can get cold again. I replayed one day shift, Monday's: 21 of 23 closings were that, and at 14 of them the rule sent a truck away from a healthy door. I'll sign a version that moves trucks only for faults. Who can tell the two apart? Diego"

**Why it works.** The second-question test on one screen: the point, what it rests on, where it stops, the ask, the name.

**Your turn (15 minutes).** **If you do only one, do this one.** Open a change you're about to sign and didn't write. Pick an input from the place where it will run, one that no test uses. Before you run it, write one prediction that could be wrong: `If [input], then [what happens].` Run it. Then write the sign-off: what you read, what you predicted, what happened, what you didn't check. **Done means** a colleague who hasn't opened the change can say what you didn't check.

Careful engineers have always debugged this way. Do it before anything breaks.

## What the machine wrote, told to the client

At ten, on site three's dock, the manager asked, "Is my door rule in? I hear your machine wrote it."

### Practice: three facts and a question

**First draft (what a careful engineer says).** "We do use AI-assisted development, but everything goes through the same rigorous process, so there's really nothing to worry about."

**What's wrong.** The manager asked about one rule and got a policy, and nobody had mentioned worry.

**Better.** "An agent wrote it last night, from a brief by one of our engineers. I read it this morning and it isn't going in, because it takes every closed door for a broken one. Nothing runs here until one of us has read it. What closes a door on your dock when nothing is wrong?"

"Frozen loads," the manager said. "And cleaning. Every door, once a night."

Diego had replayed a day shift. If you're placed with a client, you are the one they ask, and you stand close enough to learn what no brief contains. Carrying it back is the translator's habit.

**Your turn (5 minutes).** Say it aloud about something you're delivering: what the machine wrote, what you checked, where that stops. Then ask the client for one thing only they know. **Done means** you have written down a fact that is in no ticket.

**Spar with an AI.**

```text
Play the operations lead at a client. I'll describe a change that an agent wrote and I'm about to sign. Ask what I checked. Interrupt once. Then ask the two hardest questions about what could reach your staff. At the end, quote any sentence of mine that claimed more than I had checked.
```

*Safe practice: before you paste anything into an assistant, change names and figures and leave out anything confidential, or use a tool your employer has approved; treat its feedback as one agreeable opinion, not a grade.*

## A signature nobody can explain

At nine in Montevideo, Mateo asked the junior engineer about an earlier change for site three. An agent had written it, and he had signed it. What does it do when the same closing arrives twice?

"It handles it."

"How?"

"I'd have to ask the agent."

### Practice: close the agent first

**First draft (what a careful lead says).** "You signed something you don't understand?"

**What's wrong.** It teaches him to say less next time.

**Better.** "Thank you for telling me. You stay on site three. Until you can explain this one, your signature comes off and it waits. Close the agent, write down what you think happens when a closing arrives twice, then run it. Show me both at noon, even if you were wrong."

At noon he came back with a prediction that had failed. He had expected the second closing to be ignored; the code opened the door again. He had the fix too, four lines written by hand, and he could say what each one did.

**Your turn (10 minutes).** With a newer colleague, go first. Take a merged change of yours, close the agent, and predict what it does with an input that arrives twice or empty. Then ask for one of theirs. **Done means** you each have a written prediction and its result.

## One night, then weeks

At three in Rotterdam, Claire, who runs operations at Veldhaven, asked a fair question. "The machine wrote it in a night. Why isn't it in on Monday?"

### Practice: two dates and what decides

**First draft (what a careful engineer says).** "It's basically ninety percent done. There are just some edge cases, so hopefully end of the month."

**What's wrong.** The share has no basis, and the edge cases are the work. A night measures only the part somebody could already put into words.

**Better.** "Not by Monday, and I'd keep it out of December. Writing the rule took a night. Learning what closes your doors takes a month of your logs. The second week of January, if they let us tell a fault from the rest. If not, February. I'll know by 18 December. Until then, a supervisor moves the truck on the screen."

"January," Claire said. "And count how often they have to."

**Your turn (5 minutes).** Fill in, for something an agent started: `Writing it took [time]. What's left is [what nobody has told us yet]. [date], if [one thing]. If not, [other date]. I'll know by [when].` **Done means** your listener can repeat both dates and what decides between them.

## The architect's no

At the foot of the pull request the agent had offered a second design: connect to the door controllers, which know why a door closed. It came with a diagram, and Diego liked it. In a company of fourteen, Mateo is also the architect.

### Practice: a no they can refuse

**First draft (what a careful architect writes).** "No. The scheduler shouldn't talk to hardware. It's the wrong layer, and it sets a bad precedent."

**What's wrong.** Three labels. Diego can't check any of them, so he can only obey or work around it.

**Better (to Diego, Claire and Otávio).** "No to the door controllers. Veldhaven's systems team tells me they have one login, and it reads a door and moves it. With it, a mistake of ours could reach past a number on a screen, to a door with someone under it. The cost: we learn the difference from logs, and that takes until January. A login that can only read would change my answer. Otávio answers for the access and Claire for the doors, so either can refuse this. So can Diego, with one closing the logs can't explain."

Claire answered within the hour: "My systems team sees the reason for each closing. Could they add it to the message you already read?"

"Yes," Mateo wrote. "And I was wrong that only the logs could tell us."

Neither he nor the agent had drawn that design. Claire could, because she saw what his no protected.

An agent can draw several designs that work. Three judgments stay the architect's (our bet): what the system may touch, which mistakes can reach a person, and what will be hard to undo. The pattern is the recommendation from *The explanation*, turned into a no. Many teams already record a decision, its context and its consequences; add what would reopen it, and who may.

**Your turn (10 minutes).** Rewrite a no you gave this month: `No to [what], because [what it could reach]. The cost is [what we give up]. [One fact] would change my answer. [Names] can refuse this.` Send it to one of the names. **Done means** they can say what would change your answer, or have refused it with a reason.

## Go deep, or go wide?

*Go deep*, says one piece of advice. Anyone can now get plausible code in a language they've never used, so what counts is seeing that it's wrong. *Go wide*, says the other. The change that hurts you crosses three systems, and an agent makes the second and third easy to enter. Nobody knows the right mix (open). Meanwhile, go deep where you sign and wide where you ask. Keep one craft in which you can tell good from plausible, because that judgment doesn't come with the tool. And keep extending: Diego signs integrations, and knows enough about docks to ask what closes a door.

## Three next moves

1. **Predict before you run.** First step this month: the sign-off practice, on one change a week.
2. **Go where your code lands.** First step: one hour beside someone who uses it, or on their shared screen if you work elsewhere. Bring back one thing no spec says.
3. **Write one no that can be refused.** First step: send it to the person who argued hardest.

The sentence only an engineer can stand behind: "I predicted it, I ran it, and here is what I didn't run." An architect's: "We won't let it touch that, and here is what would change my answer."

To check whether this still holds, count every three months, an interval this book sets, what readers found that tests hadn't. After two zeros, with nothing failing in use, reading earns less on your team than I've claimed. Change the rule, with the people it protects.

## For everyone who works with them

You don't need to read code to ask a good second question.

| Instead of | Say | Why |
|---|---|---|
| "Did an agent write this?" | "Who read it, and what did they check?" | Either answer to the first tells you little |
| "Is it done?" | "What hasn't anybody tried yet?" | Done has several meanings; untried has one |
| "It took an afternoon. Why wait?" | "What's left, and what does it depend on?" | The afternoon covered what was already known |
| "Why is it always no?" | "What would change your answer?" | A good no has an answer ready |

When an engineer says where their knowledge stops, thank them and plan on it.

## Words to use

- "I read [what]. I ran [what]. I didn't check [what]."
- "An agent drafted it, I read it, and my name is on it."
- "What happens here that nobody would think to write down?"
- "No, because of what it could reach. [One fact] would change my answer."
- "You can refuse this. I'd need to hear [what]."

### Phrases you will hear

- "LGTM" ("looks good to me"): ask what they looked at.
- "It works on my machine": ask what is different on the other one.

## When it backfires

**When changes arrive faster than you can read.** A signature on everything soon means nothing. Ask for smaller changes, and read first whatever can reach a customer.

**When they have the power.** If you're told to sign today, offer in writing the sentence you can sign: "I read it. I haven't tested it at site three." *Pressure and how to resist it* has the rest.

**When it becomes an exam.** "Explain line 90" in front of the team teaches hiding. Go first, in private.

**When the contract decides.** What you may tell a client about your tools may already be agreed. Read that first.

**In a second language.** Write the sign-off before the call and read it out. *Read*, *ran*, *not checked*: three short lines carry the whole claim.
