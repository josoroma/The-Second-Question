# The explanation

Mateo drew for forty minutes.

It was a Tuesday in the first week of August, and he had flown from Montevideo to Rotterdam for this meeting. Mateo is co-founder and chief technology officer of Tolva, whose scheduler tells each truck which warehouse door to use. Veldhaven, a food wholesaler and Tolva's largest client, was opening its security review of Tolva's access scopes: what the scheduler's login may read and change. When he capped the pen, the whiteboard held eleven boxes, nine arrows and the lifetime of a login token. In red, at the bottom left, was why a scheduler has to change bookings at all. Nothing on it was wrong, and nothing on it was bigger than anything else.

Two people had to decide from it. Claire, who runs operations at Veldhaven, had a date to plan for. Site one, the first of her three warehouses, would go live on 14 September if the review passed in one round, and on the 28th if it took two. Otávio, Veldhaven's head of information security, had to put his name under the access. If anyone ever came in through it, the breach would be his to explain.

"Does that make sense?" Mateo asked.

"Clear," Otávio said. "Very thorough. Thank you."

Claire took a photo of the board.

Otávio's email came at 7:52 the next morning, copied to Claire. "Under our vendor security policy, an outside company may not change live bookings without a documented need. I cannot approve the access as presented."

The need was on the board, in red. "As I explained yesterday," Mateo typed, and stopped. He deleted it and sent a question: "When someone asks why you approved our access, what do you have to be able to answer?"

Otávio took four minutes. "What it can change. At which sites. How fast I can cut it off."

Mateo went to find Claire. She held up her photo. "Which part of this is my date?"

## What a decision needs

Otávio hadn't changed his mind overnight. He had gone back to his desk with one thing to decide and nothing he could check, so he opened the policy. "I can't tell yet what this login could change" would have helped more, said in the room. But a founder had just drawn for forty minutes, and "Does that make sense?" asks for a polite yes.

Mateo had explained how the connection works to two people who will never build one. Someone who must decide needs to know what each choice does to the thing they answer for, how sure you are, and what would change your advice. Give them that, and people with twice your rank and none of your background can choose well on your word. Keep the rest ready for the second question.

> **Line to keep:** Until they can say what they gave up, all you have is a nod.

One test sorts your material. Take each part and ask: if this worked some other way, would they choose differently? If not, it stays in your notes. Most of Mateo's boxes belonged there. An assistant will draw all eleven on request. Which ones matter depends on what Otávio and Claire answer for, and you learn that by asking them.

> **Research says:** One laboratory study looked for what predicts how far people overrate their understanding of a device. The best predictor: the more of its parts showed, the more they overrated. The study used everyday devices, not diagrams, so treating a nod at a full whiteboard as a weak sign is this book's reasoning.

## One choice, two people

Mateo made a listener sketch of each (*Who is listening*): what they know, have to decide and stand to lose. Otávio knows access controls better than Mateo does. He has to decide whether to sign, and he stands to lose the trust that lets him sign anything. Claire knows what it costs to move a go-live. She has to choose a date, and she stands to lose her word to a board, with the peak coming in December.

Seen from there, the design held one real choice. The login Mateo had drawn could change any booking at all three sites. It existed, and it did far more than the scheduler needs. A smaller login, a separate one for each site, could change one thing: the door. It would take four days to build, in the middle of the round, and Otávio's team would have to read the change.

A choice like that fits a pattern with four slots:

`I recommend [choice], because [its effect on what you answer for]. You give up [cost]. I'd change my mind if [one fact].`

Filled in: "I recommend the small login, because nobody who steals it can cancel a booking. You give up four working days, and perhaps the 14th. I'd change my mind if a login can't be limited to one field."

Say the cost right after the benefit. It is tempting to skip, because it can lose you the argument, and it is what makes the decision theirs.

## Thursday, two rows

On Thursday the whiteboard held two rows, the big login and the small one, with the same truck in both. Mateo said his four slots, then pointed at the truck.

"A truck of canned tomatoes checks in at site one," he said. "Our scheduler picks door two, and the login writes 'door two' on the booking. Either login can do that. Now someone steals the login. With the small one, they can write 'door ten'. A supervisor sees tomatoes at the wrong door and moves them. With the big one, they can cancel bookings at all three sites, and the first person to know is a driver at the gate of your cold store."

That is an architecture explained: one case walked through twice, first working, then with the part in question failing. Engineers already test designs with scenarios; this one is for the person who decides. Mateo's last line says who would feel the failure first: the habit of the system reader, the thinker type Mateo is growing toward.

There he stopped. In next-question order, you stop when the next question is theirs to ask.

"Why only perhaps the 14th?" Claire asked.

"The four days fall inside Otávio's round. If his team can read the change in what's left of it, the 14th holds. If not, the 28th."

"How sure are you?" That was Otávio, in the room.

"What the big one can change, I checked on the test copy yesterday. That a login can be limited to one field, your warehouse-system team told me. The four days I reasoned from the work we did in the spring. How fast you can cut either one off, nobody has tested. We'll test it on Monday, and it's the likeliest reason for a second round."

Each part is a sized claim with its basis word, and the unknown comes with a day and a cost. A decider can plan around that.

"And if I insist on the 14th?"

"Then it's the big login, and we narrow it in October."

"I wouldn't sign that one," Otávio said.

Claire looked at the two rows. "The small one. If it needs a second round, it needs one. I'd rather move a date in September than lose a morning in December."

"Let me check how I explained it," Mateo said. "Otávio, what would you tell your chief executive we chose, and what we gave up?"

"One login per site. It reads that site's bookings and changes one thing, the door. We gave up four days, and maybe two weeks." He was writing as he spoke. His file had its documented need.

On Monday they switched a login off at nine, and at ten it was still working. The reason was the token's lifetime, written on Tuesday's whiteboard in the same ink as the rest. The written result asked for a second round, to see that hour gone. On 20 August Lucía, Tolva's chief executive, told Veldhaven: the 28th. Neither Claire nor Otávio needed to ask why.

## Plain or precise?

"Use plain words" is good advice: a term your listener doesn't know can hide the one thing they would object to. "Stay precise" is good advice too: a simplified claim can be false, and whoever decides on it will hold you to it.

The rule from *The exact word* decides it: plain words for the listener, precision for the claim. If simplifying makes it false, keep the precision and add an example.

Mateo nearly told Otávio that the small login "only touches doors". That is plain, and false: the login also reads bookings. So he kept the claim exact and put the tomatoes in it: "It reads that site's bookings and changes one thing, the door. Someone who stole it could see that tomatoes are due at six. They couldn't cancel them."

| Instead of | Say | Why |
|---|---|---|
| "It runs with admin rights." | "It can change any booking at all three sites." | Reach is what they sign for |
| "It's eventually consistent." | "The stock count can be ten minutes old." | Says how wrong it can be |
| "It scales." | "We tested three sites, never four." | Says where the claim stops |

## Practice: what the model means for Monday

**Situation.** You built a model that ranks customers by how likely they are to cancel. The head of customer care, who has four people on the phones, writes: "Is it good enough to use?"

**First draft (the model builder's answer).**
"It performs well: the area under the curve is 0.87 on the holdout set. At a threshold of 0.5, precision is 0.60 and recall is 0.75, but it's tunable, so it depends on your appetite for false positives. Happy to go through the methodology."

**What's wrong.** It uses a vocabulary her job has never needed, and it answers "How good is the classifier?" She has to decide whom four people call on Monday, and "tunable" hands that back with the choices taken out.

**Better.**
"Yes, for choosing whom to call. I recommend calling the 50 customers it ranks highest each morning, which is what your team can reach by noon. I ran it on the last three months and checked it against the records. On an average day, 30 of those 50 went on to cancel, so 20 calls would go to people who were staying. You would also miss 10 who canceled from lower in the list. Calling 100 reaches 7 of those 10 and takes the whole day. I don't know whether a call changes anyone's mind, because nobody has measured it. If your team leaves 10 of the 50 uncalled, picked at random, two weeks will give us a first answer. If calls change nothing, I'd stop. Fifty or a hundred, from Monday?"

**Why it works.** Her question is answered first, in calls and customers. The cost sits beside the benefit, and the unknown that could reverse the choice comes with a test.

**Your turn (10 minutes, in writing).** Take a choice on your desk that someone else must make. Write it in the four slots, add how you know, then cut every sentence that would leave their choice the same. **Done means** a colleague outside your field reads it once and can say what you recommend, what it costs and what nobody knows yet.

## Practice: ask for the cost back

**With a person.** **If you do only one, do this one.** This week, explain one real choice to the person who decides it, starting with what each option does to what they answer for. Then, in place of "Does that make sense?", ask for a read-back, as Mateo did: what would you tell your boss we chose and gave up?

Watch for the cost in their reply. If only the benefit comes back, walk one case through the failure and ask again. **Done means** they have said the cost in their own words and you had nothing to correct. **Written form.** Send the four slots and ask for the one line they would forward.

**Spar with an AI.** Rehearse the second question before you meet it.

```text
Play the person who must decide this: [role, what they answer for]. You have no
technical background. I will explain a choice in under two minutes. Stop me once,
at the first word only my team would use. When I finish, ask the two questions you
would need answered before signing. Then, as that person, write the sentence you
would forward to your boss: what we chose and what we gave up. Last, list anything
I said that would not have changed your choice.
```

*Safe practice: before you paste anything into an assistant, change names and figures and leave out anything confidential, or use a tool your employer has approved; treat its feedback as one agreeable opinion, not a grade.*

## Words to use

- **Before you prepare.** "When someone asks why you approved this, what do you have to be able to answer?"
- **To open.** "There are two ways to do this. Here is what each one does to [what they answer for]."
- **The unknown.** "Nobody has tested [what]. If it goes badly, [what it costs you]. We'll know on [day]."
- **When the detail doesn't change the choice.** "I can show you how that works. It doesn't change what you're choosing."
- **When agreement comes too fast.** "Before you agree, what would you still need to see?"

### Phrases you will hear

- "under the hood": how it works inside
- "at a high level": the main points only
- "What's the catch?": what do we give up?

## When it backfires

**When the decider knows more than you.** Plain words can sound like a lecture to an expert. Otávio needed exact reach, sites and minutes, and no tour. Ask first: "Which part do you want in detail?"

**When they outrank you and want one answer.** "Just tell me which." Give the recommendation and its cost in one sentence, then in writing the same day. If they choose the other way, note the cost of that once, without arguing.

**Where a recommendation comes last.** In some companies people weigh the options before they hear yours. Ask beforehand, and put it where they expect it.

**When one option is there to lose.** A weak option placed beside yours so that yours wins is steering. If there is an option you would rather they didn't see, put it on the board.

**When the last question sounds like an exam.** Make it about your explaining, as Mateo did, or ask in private.

**In a second language.** Pick one word for each thing and repeat it. A "login" that becomes an "account" and then a "credential" sounds like three things. Write the options on the board before you speak so nobody has to remember them.
