# The exact word

One word in Bianca's weekly report sent three people off to do three different things.

Bianca is product manager at Tolva, a fourteen-person company in Montevideo whose software assigns arriving trucks to warehouse doors. Her report on the integration with Veldhaven, Tolva's largest client, went to both companies on the last Friday in April. She built it the way she built most of them: she copied the team's board into a list and sent it on. The first line read: "Door map, site one: ready."

Mateo, Tolva's co-founder and chief technology officer, read it the way the board uses it. On the board, "ready" is the column where finished work waits for someone to test it, so he moved two engineers onto the arrival feed.

Claire, who runs operations at Veldhaven, read it as a go-ahead for her supervisors. She asked site one's manager to free twelve dock supervisors for two hours on Thursday morning to learn the new screen.

Lucía, Tolva's co-founder and chief executive, read it as a milestone. She typed "site one door map complete" into her monthly note to Renata, Tolva's first investor, to send on Monday evening.

Claire joined Tolva's weekly call on Monday to plan Thursday, and she opened with the report's line. "Bianca's report says the door map is ready, so I've booked twelve supervisors for Thursday morning. Two hours. Is that enough?"

Diego, the engineer Tolva placed with Veldhaven in Rotterdam, spoke before Mateo could answer. "Before we plan Thursday, can I ask what we mean by ready? Ready for us to test, or ready for a supervisor to use on a shift?"

The call went quiet, so he gave his own answer. "On Friday I ran last Tuesday's morning arrivals at site one through the test copy of your warehouse system. Thirty-eight trucks, and every one got a door. But the door list is a file we typed in. It doesn't come from your system yet, so if your team closes door four tomorrow, the map will still send trucks to door four. It's ready for us to test. It isn't ready for your supervisors."

Claire didn't hesitate. "Then Thursday is a demonstration. Four supervisors, one hour. I'd rather change it now than on Thursday morning."

Lucía had deleted a line from her note while Diego was still talking. Mateo said, "That is what ready means on our board. Connecting the door list was never on the card."

"Claire reads my report," Bianca said. "So the word was mine."

After the call, Mateo moved one engineer back to connect the door list to Veldhaven's warehouse system. Only one meaning of "ready" was true, and the report did not say which. The word nearly cost twelve supervisors a morning, a week in which nobody connected the door list, and Lucía a sentence she would have had to take back.

## Bianca's report, word by word

That afternoon Bianca went through her whole report the way Diego had gone through its first line:

- Door map, site one: ready.
- Arrival feed from the warehouse system: mostly done, a few edge cases left.
- Performance: good, no issues at expected volumes.
- Supervisor screen: in review, positive feedback so far.
- Veldhaven integration team: some friction, being resolved.
- Site two: starting soon.

Beside each label she wrote two things:

| In the report | What a reader could assume | What a recording or a number shows |
|---|---|---|
| ready | Waiting for a test (Mateo); usable on a shift (Claire); a milestone met (Lucía) | Thirty-eight morning trucks got doors on the test copy; the door list is typed in by hand |
| mostly done, a few edge cases left | A day of work, or a month | The feed handles six of the nine kinds of message the scheduler needs; cancellations, door changes and split loads are left |
| good, no issues at expected volumes | Someone has measured it | Nobody has measured it; the only basis is one pilot dock last year |
| in review, positive feedback | Approved | Two supervisors tried the screen for twenty minutes; one asked for larger door numbers |
| some friction, being resolved | Someone is being difficult | Veldhaven's integration lead wants the message format in writing before he connects the feed; sent Wednesday |
| starting soon | This month, or this year | Diego has asked to walk site two's doors on 12 May; not yet confirmed |

The line that looked safest was the worst. "No issues" did not hide a fact; it hid the absence of one. Nobody had run the scheduler at full load, and the label kept that gap out of sight for everyone, Bianca included. When you go through your own reports, read the reassuring words first.

"Some friction" was the unfairest line. It took a careful engineer's reasonable request and turned it into a complaint about him. The facts gave him his request back.

Bianca sent the third column, almost word for word, as the next Friday's report. It was twice as long. Claire replied with one question, about the date for site two.

## Conclusions with the facts taken out

"Ready", "done", "stable", "minor", "soon", "difficult": each is a judgment, handed over without the thing that was judged. Inside a team that watched the same work, a judgment travels well, because everyone fills it with the same facts. Across a boundary, between teams or between companies, each listener fills it with their own, and nobody notices until someone acts on it.

So swap the label for what someone would see, hear or count. The tool for that is the observable version: for any label, say what a recording would show or a number would state. Then test it: could two people who disagree about the label agree that this happened?

Diego's answer passes it. Mateo and Claire could have argued about "ready" all morning; neither could argue with thirty-eight trucks on the test copy, or with a door list typed in by hand.

> **Line to keep:** A word only you can check is a word nobody else can rely on.

## When you need a label, define it

Teams need short words for the state of their work. When you need one, define it by what someone could watch happen, and put the definition where the label is read.

Bianca replaced "ready" with three labels and put their definitions at the top of every Friday report:

- **Merged**: the change is in Tolva's main code, and Tolva's own tests pass.
- **On the test copy**: Diego has run a real morning's arrivals through it on the test copy of Veldhaven's warehouse system.
- **On a shift**: a dock supervisor has used it through a whole shift at the site.

The door map was merged and on the test copy. It would not be on a shift before September, and now the report said so. That split, one word into three questions, was Bianca's first step toward the framer's habit: deciding what the question is before anyone answers it.

If your team keeps a definition of done or acceptance criteria, this is the same move. What matters is where the definition lives: one kept in a document the client never opens defines nothing for the client.

An instruction to an agent needs the same care. Assume, as this book does, that an agent usually guesses what your word means unless you tell it to ask. "Get the door map ready" invites a guess, and one guess is that it already is. Name what is still missing: "Done when, on the test copy, site one's door list comes from Veldhaven's warehouse system, and a door closed there gets no trucks. Last Tuesday's thirty-eight arrivals must still each get a door."

## Practice: your three most expensive words

**If you do only one, do this one.** Take ten minutes to do for your team what Bianca did for hers:

1. List the status words your team uses with people outside it: board columns, ticket states, report headings. Circle the three that would cost most if misread.
2. For each, write what someone could watch happen when it is true.
3. Check each definition: could two people who disagree about the label agree that this happened?
4. Put the definitions where the outside reader will see them.

Two mistakes to catch:

| Mistake | Fix |
|---|---|
| One label swapped for another: "ready" becomes "works" | Say what a recording would show: "all thirty-eight trucks got doors" |
| A count without its whole: "six kinds handled" | Give the whole: "six of the nine" |

**Done means** a stranger who reads only a definition can tell whether an item meets it.

## Plain words for the listener

There is a cost in long words too: reading time, for nothing more. "The door-assignment functionality has been validated in the pre-production environment" takes longer to read than "Thirty-eight trucks got doors on the test copy", and says less.

> **Research says:** In one set of experiments, readers judged an author less intelligent when the same text was made more complex, and the drop tracked how hard it was to read. A later study found the reverse on that one judgment, so complex wording does not reliably make a writer seem intelligent. Both studies used written texts; the step to what you say aloud is the book's reasoning.

Use plain words for the listener and keep the precision for the claim. If the plain word would make the sentence false, keep the precise one and add an example from the listener's world.

### Practice: one sentence for someone outside your field

**Situation.** On a call the next week, Claire asks what is left on the arrival feed. Bianca answers with the words Mateo's engineers used that morning.

**First draft (what a careful product manager says).**
"The adapter is feature-complete and idempotent. We're hardening it now for the edge cases."

**What's wrong.** None of it reaches Claire, who runs docks, not message queues. "Feature-complete" and "hardening" are labels the engineers agreed among themselves, and "idempotent" is a word she would have to look up in the middle of a call.

**Better.**
"If your warehouse system sends the same truck twice, the scheduler now books it once. Diego checked that against last week's arrivals at site one. Three kinds of message are left. The one your supervisors would notice first is cancellations: today a canceled truck can keep its door for up to ten minutes."

**Why it works.** Each engineering label became something a dock supervisor would see: a truck booked once, a door held after a cancellation.

**Your turn (3 minutes).** Take one sentence from your last update that uses a word from your own field. Say it again as what the listener would notice in their own work. **Done means** someone from another team, hearing it once, can say what will be different on the day the work is finished.

## In a second language, describe what happened

On Monday's call, everyone who spoke was working in a second language, and nobody misheard a word. Three readers filled the same written "ready" in different ways. Before you blame your English for a misunderstanding, check the label.

Labels ask a lot of a second language, because none of them says where it stops. "Ready", "nearly done", "basically done" and "in good shape" may stop somewhere else for the next speaker, or in the next language. A count, a name, a door number and a time leave no such doubt. Thirty-eight trucks are thirty-eight trucks in every language on the call. So when you are reaching under pressure for the perfect English adjective, stop reaching and describe what happened.

> **From practice:** For the word that won't come, language classes drill one move: describe what the thing does or what it looks like. At work, the same move produces the observable version, and the result is often clearer than the word you were looking for.

"What do you mean by ready?" may feel, in a second language, like admitting you missed something. On that call it was the most useful sentence anyone said, and it came from someone who works in his second language every day.

## Words to use

To ask about a label:

- "When you say ready, what will [person] be able to do on [day]?"
- "Ready for us to test, or ready for your team to use?"
- "Is there a number behind 'most'?"

To give your own:

- "By [word], I mean [what someone can see or do]. Is that what you mean too?"
- "Here is what I saw. Whether that counts as ready is your decision."
- "Nobody has measured that yet. [Name] measures it on [day]."
- "I don't have the exact English word. Here is what happened."

### Phrases you will hear

- "Good to go": ready to start. Ask what starts, and who starts it.
- "In good shape": going well, with no fact attached. Ask for one.
- "Done done": finished in every sense, not only in the code. Ask which senses count.

## When it backfires

Used on every word, the observable version turns a two-line update into a witness statement. Keep the labels your team has already defined, and spend the observable version on the words that cross a boundary or carry a decision. A busy executive may want the label with one fact behind it: "Not ready for supervisors: the door list is still typed in by hand."

Upward, "What do you mean by production-ready?" can sound like a challenge, or like preparation you skipped. Offer a senior client your own observable version to correct: "I'm taking production-ready to mean it runs a full day's arrivals with nobody stepping in. Is that what you need?"

In some teams the label is the polite form, and reading out the count on a group call can feel like exposing a colleague. Put the count in writing, or give it to the person first.

A description of what someone did is checkable, and it can still hurt. "You interrupted her twice in Tuesday's review" is exact, and said in front of others it is still an accusation. *The hard conversation* covers how to say it.

An exact fact can also mislead. Thirty-eight trucks on one Tuesday morning say nothing yet about the busiest morning in December. Say which day a number comes from, as Diego did, so nobody treats it as a promise about December.
