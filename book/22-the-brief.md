# The brief

Mateo: "Write the migration that adds site two's doors. Same as site one."

The agent, six minutes later: "Done. Site two's doors are in, with site one's settings: sign numbers, door types and the fifteen-minute rule for late trucks. I wrote 28 tests, and all of them pass."

Mateo read it twice. He is co-founder and chief technology officer of Tolva, whose software decides which truck goes to which warehouse door. On that last Thursday in August its largest client, Veldhaven, was a month from going live at site one, and site two would follow in November.

Fifteen minutes is site one's rule; in July, site two's manager had asked for thirty. Site one also has a problem of its own. The sign above a door there shows one number and Veldhaven's system uses another, so Tolva keeps a list that matches them. The agent had copied that list to a building where nobody at Tolva had checked a single sign. The 28 tests had passed because they came from the same guess.

Mateo typed, "What did you have to assume?" The answer ran to nine lines. He deleted the migration.

That morning he had handed a person a job in nearly the same words. "Set up the morning replay for site two," he wrote to a junior engineer. "Same as site one." The reply: "Before I start: I think site two asked for thirty minutes, and site one has fifteen. Which do you want? And which morning should I replay?"

## Four words, nine guesses

"Same as site one" felt exact to Mateo, because he carries all of site one in his head. The junior engineer had been at the stand-up in July when somebody said thirty, so he could see a gap and ask. The agent had never been at a stand-up. Unless told to ask, an agent usually guesses, and the guess comes back looking finished.

When work comes back wrong, read your instruction before you judge whoever followed it.

A brief hands over decisions. Whatever you leave out still gets decided, by a question, by a guess or by the experience of whoever you asked. Leaving something out is often right, because that is how you give an able colleague room. So decide what only you can decide, say what is theirs, and hear their plan while it is still easy to change. Then you can hand work to a person or a machine and get back what you meant, starting this afternoon.

> **Line to keep:** Every gap in a brief gets filled, so choose the ones you leave.

## Decide it on one page

The brief combines tools you have. Write a line or two for each of these, whoever receives it.

- **The point.** A point sentence from *Know what you think*: what you need, and the one reason. The reason lets them handle the case you forgot.
- **Done.** The observable version: what a recording would show or a number would state when the work is finished, and what must stay as it is.
- **Known and assumed.** The facts they need, each with its basis word: checked, told, reasoned or assumed.
- **The read-back.** Their plan, before the work starts: what they understood, what they will do, what they are unsure of.
- **The name.** The last question of the second-question test: who answers for it? One person, who reads the result before it goes further.

Tickets have long carried an aim and acceptance criteria, and careful teams list their assumptions. I'd add the basis words, the read-back and the name, all before anyone starts.

Mateo's second brief to the agent took him twenty minutes:

"Add site two's doors to the scheduler, because testing there starts in the first full week of October.

"Done when three things are true on the test copy. Every door on Veldhaven's list for site two appears once, under the number on its sign. A late truck there loses its door after thirty minutes. Every door at site one keeps its number, its sign and its fifteen minutes.

"Checked: our sign list covers site one only. Told, by site two's manager: thirty minutes. Assumed: at site two, the signs and the system use the same numbers. Diego walks the dock on Tuesday, so leave the signs until then.

"Before you start, send me your plan: what you understood, what you will do, what you are unsure of. If a fact is missing, ask. Don't fill it in.

"Who reads it before it merges: Lucía and I will agree."

Under *what I will do*, the plan said it would rebuild the sign list as one list for both sites. Mateo asked, "What else reads that list?" The agent answered: "Site one's dock screens." He wrote, "Then leave site one's rows alone, and put site two's beside them." The correction took one sentence, because there was nothing to undo.

Under *what I am unsure of*, it asked which rule covers a truck already on its way when the rule changes. Mateo didn't know. The plan had found a gap he hadn't seen, and the question went to site two's manager.

On Tuesday, Diego, the engineer Tolva has placed at Veldhaven, wrote: "Every sign matches except three and four, which were swapped when the dock was painted. The drivers know. No file does." The word *assumed* had told Mateo where to send him.

## A colleague or an agent

The same lines serve both. What goes into them changes.

| Where they differ | With a colleague | With an agent |
|---|---|---|
| What they already know | Often more than you; ask | Only what you give it or let it read |
| What happens at a gap | They may ask, or wait, or use experience | It usually guesses, unless told to ask |
| What a wrong try costs | Their day, and some of their patience | Minutes to make; longer to notice |
| What to leave open | How they do it | Only what you could accept either way |
| Who answers | They can, if they agree first | A person, named before it starts |

The junior engineer's second brief was half as long, because he knew about the thirty minutes. He lacked the reason: "so site two's manager can watch one of his own mornings before he trusts our plan." He lacked the morning, and what done looked like: "every truck in that Tuesday's gate log, from five to nine, appears once." How to build it was his.

Mateo made asking cheap, too. The engineer had written his two questions at nine and sent them at twenty to ten. "I thought I should know already," he said. So the new brief ended: "Questions by noon, please. I don't expect you to know this already."

> **Research says:** A review of teaching experiments found that help which serves beginners well can stop helping, or even hurt, people who already know the subject. A later pooled analysis of sixty studies agreed, and found that giving beginners help mattered more than holding it back from experts. Both were about learning; applying them to a brief, and adding detail when you are unsure, is our reasoning.

## When the work comes back

A plan is a promise about the work. Before the result goes out under your name, check three things.

1. **Hold it against the done line, using something its maker didn't make.** Tests an agent wrote from its own guess show only that the code agrees with the guess.
2. **Ask, "What did you have to assume?"** People and agents can both answer; take an agent's list as *told*. Anything that wasn't in your brief is a gap somebody filled.
3. **Look for yourself at the part that would hurt someone first if it were wrong.** For Mateo's migration, that was site one's doors.

For the replay, Mateo counted the trucks in the gate log himself: fifty-eight. The replay had fifty-seven. The missing truck had checked in at 4:58 and was still waiting at five. Nobody had been careless; the brief said "from five." They added it, and the next brief said "everyone at the gate by five."

Then comes the name. You answer for what goes out under yours, however it was made, so settle who reads it while nobody is in a hurry.

> **Research says:** In one study, people made accountable for their results or their accuracy were less likely to miss what an automated aid missed, or to follow it against better information. When professional pilots were assigned accountability in another, it made no significant difference. So one name on the brief is our reasoning, and it doesn't replace the check.

The migration came back two days after Diego's message, with its tests passing, in the week Mateo was answering the second round of Veldhaven's security review. It wouldn't run until October, so it waited, unread. The last line of his brief still said "Lucía and I will agree," and he and Lucía, his co-founder and Tolva's chief executive, had set no day for it. It was the one gap still open, and he hadn't chosen it. In October, somebody would fill it by merging.

### Practice: the brief for Thursday

**Situation.** You run a small software company. On Thursday a customer decides how many seats to renew, and you ask a colleague who joined in May to prepare the numbers.

**First draft (what a careful founder writes).**
"Hi! So, we signed them last November, and the rollout was slow because of their login system. In June a whole team left and usage dropped. The renewal call is Thursday. Could you pull the usage numbers together and make them nice and clear? Whatever you think is useful. Thanks!"

**What's wrong.** The history comes in the order it happened, and the decision the numbers are for never comes at all. "Usage" and "clear" are labels. "Whatever you think is useful" leaves open the one choice only you can make.

**Better.**

- "Please make one page on how many people at the customer used the product each week since April, because on Thursday they choose between 40 seats and 20."
- "It's done when there is one line per week, up to last Friday, and beside each drop, what happened, or that we don't know."
- "Checked: they pay for 40 seats. Told, by their manager: a team of ten left in June. Assumed: signing in counts as using it."
- "Before you start, send me your plan and whatever you're unsure of, by noon tomorrow. The layout is yours."
- "I'll read it on Wednesday at four. I present it, so I answer for it."

**The read-back.** "I'd count people who ran a report, because sign-in happens by itself every morning. All right?" "Yes. Say so on the page."

**Why it works.** The reason lets your colleague judge every later choice. Done can be seen. The weakest fact is labeled, so she knew which one to question, and her answer cost one message.

**Your turn (10 minutes).** Take the next job you'll hand over, to a person or an agent, and fill this in: `I need [what], because [the one reason]. Done when [what anyone could see], and [what must stay as it is]. Checked: [facts]. Assumed: [facts]. Send me your plan before you start. [One name] reads it before [the next step].` Then mark each gap you left: *theirs* or *forgotten*. Fill the forgotten ones. **Done means** someone outside the work can read it once and say what they'd look at to know the job is finished, and who answers for it.

### Practice: hear the plan first

**If you do only one, do this one.**

**With a person.** Hand over one real job this week, and ask for the plan before the work starts. Look for a step you didn't expect and a question you can't answer. Each shows you a gap. If the plan only repeats your words, ask, "What would you do first, and what could stop you?" Watch whether their next question is about the reason or a detail, and put more of that in your next brief. **Done means** you have the plan in their words, and you've corrected one step or answered one question before any work exists.

With an agent, do the same, and have it stop after the plan.

*Safe practice: before you paste anything into an assistant, change names and figures and leave out anything confidential, or use a tool your employer has approved; treat its feedback as one agreeable opinion, not a grade.*

## Words to use

- **To hand it over.** "I need [what], because [the one reason]." "It's done when [what anyone could see]." "How you do it is yours."
- **To mark what you know.** "I checked this. I'm only assuming that."
- **To make asking cheap.** "Questions by [time], please. I don't expect you to know this already."
- **To an agent.** "If a fact is missing, ask. Don't fill it in." "Send the plan and stop there."
- **When it comes back.** "What did you have to assume?" "Which part are you least sure of?"
- **When the brief you get is vague.** "Here is what I think done looks like: [it]. What would you change?"

### Phrases you will hear

- "Take a stab at it": make a first try. Ask how finished it should be.
- "Run with it": decide the details yourself. Ask which ones are really yours.

## When it backfires

**When the job is small.** A name changed in one file needs a sentence. Write the page when a wrong result would be hard to undo or would reach a customer.

**When the receiver knows more than you.** Steps sent to an expert can sound like doubt. Give the point, done and the facts only you have, then ask how they'd do it.

**When the vague brief comes from above.** You can't make a client or a chief executive write the page. Write it yourself in four lines and ask them to correct it, in private.

**When the goal isn't decided.** Nobody can brief a result they haven't chosen. Brief the question instead: "Three rough options by Friday, none finished."

**When a question feels like weakness.** In some teams every plan comes back certain. Say first what you're unsure of in your own brief, and ask for one thing from them.

**In a second language.** Use one name for each thing and keep it to the end; a second word for variety can read as a second thing. Invite the plan in writing, so nobody has to find the English while you wait.
