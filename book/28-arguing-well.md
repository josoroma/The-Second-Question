# Arguing well

On the night of 6 October, a change written by a coding agent mislabeled doors at Veldhaven's first warehouse for four hours. Three more such changes are waiting. Mateo runs technology at Tolva, whose scheduler picks the doors; he wants an engineer to read each one first. Otávio, Veldhaven's head of information security, wants ten working days. Eight days later they are on a video call.

Mateo: "Somebody reads it before it runs. I read it on the seventh, and I saw the fault in ten minutes."

Otávio: "On the seventh you knew there was a fault to find."

Mateo: "Any of my engineers would have seen it."

Otávio: "None of them did."

Mateo: "None of them read it. That's the rule I'm proposing. And your ten days wouldn't have caught it. Your team checks access, and that change used only the access you gave it."

Otávio: "Then we'll check more. Every change a machine wrote comes to my team, for ten working days, before it goes near a door."

Mateo: "One after another, that's six weeks for the three we owe site two. Site two goes live on 9 November."

Otávio: "So now we are discussing your date."

The change had passed its tests. Otávio answers for whatever an outside company does inside Veldhaven. In August he had said "Clear" in a review and objected by email the next morning. This time he objected out loud, which was better for everyone and harder on Mateo. Each had been right at least twice, and after twenty minutes they were no closer to a rule.

## Which argument is this?

Count the questions in those lines. Would a reader have caught the fault? That one is about what is true. Should the rule protect the doors, whatever happens to the date? That one is about what to do. Whose hours get spent, and who can stop a change? That one is about something limited. Three questions were open, and both of them kept answering one with a reason that belonged to another.

**Sort first**, the tool from *Thinking on your feet*, works on disagreements too. A disagreement is about **what is true** (agree the test before anyone argues the answer) or **what to do** (agree the goal). Or it is about **who gets something limited** (agree a fair rule and name who decides).

Anyone can prepare a case. In an argument, the second question comes from someone with a case of their own. Yet two people who disagree about the answer can still agree on what would settle it. Find that first. Then you can press each other's reasons as hard as the work deserves, and give up a point without giving up your case. You can both leave with something you will keep.

> **Line to keep:** Agreeing on what would settle it is the part of an argument both of you can win.

If you can't tell what would settle it, ask, "What would you need to see?" and sort the answer. If it's already going badly, find the line below that sounds like yours and start there.

| What you hear | What is missing | Start with |
|---|---|---|
| The same sentence, a third time | A sign that it was heard | Their side, until they say yes |
| Two people sure, and nobody has looked | A test | The test before the answer |
| "So now we're discussing your date" | What each side stands to lose | The cost of being wrong |
| Agreed facts, opposite plans | A goal | The goal, then the plan |
| Two claims on the same hours or money | A rule | The rule, then the decider |
| A point you can't answer | Its size | Give the point, keep the rest |
| "That's not what you said on Wednesday" | What changed, and why | Change your mind in public |
| Nothing new for ten minutes | An ending | When nobody moves |

Take the fact first whenever somebody could check it this week. A plan argued on an unchecked fact gets argued twice.

## Their side, until they say yes

When a sentence comes back a third time, stop answering it. Say it back. Twenty minutes in, Mateo did:

"Let me say your side, and you correct it. The ten days aren't the point. After a bad night you're the one who gets asked. You need to say who looked at the change, and why you believed they'd find anything. Is that it?"

"Nearly," Otávio said. "Who looked, yes. I also need somebody who can say no before it runs, with time to say it."

"Who looked, why you'd trust them to find it, and somebody with the power and the time to say no."

"Yes."

Work for that yes before you object to anything. This is the **read-back** from *Listening people can feel*, used with someone you disagree with. Saying the other side first is very old advice; the skill is in how well you say it. Use their words, and if you can make their case better than they did, make it. Mateo's first try left out the power to say no, the part Otávio cared about most, and for twenty minutes he had argued against something else.

## The test before the answer

"Any of my engineers would have seen it." "None of them did." Both were sure, and neither had looked.

Choose the statement worth looking at. Take away each thing you said, one at a time, and ask whether your conclusion still stands. Mateo could lose the ten minutes and the date and keep his rule. Without "any of my engineers would have seen it", he had nothing.

Then agree what you will look at, and what each result would mean, before anyone sees a result. Decide it afterward and each side can read the result its own way. Mateo and Otávio wrote this down:

"Tyler picks six changes that agents have written since July. On copies of three, one of Otávio's reviewers hides a fault that would send a truck to the wrong door. An engineer at Tolva who has seen none of the six reads them all, and marks each one she would refuse to sign. If she stops all three, reading is enough. If she misses one, it isn't."

Tyler runs delivery at Tolva. Testers have long hidden faults to test their own checks. The last two sentences do the work here, agreed while nobody knew whom they would hurt.

### The cost of being wrong

They nearly didn't write it. Otávio's line about the date was fair: Mateo had a reason to want one answer, and it is hard to look honestly for an answer you can't afford. Otávio had a reason too, and hadn't said it. So say what you stand to lose, and ask for theirs, before you design anything.

"It's my date as well, yes," Mateo said. "If reading isn't enough, site two may slip, and your board has just kept that date on our word. What does it cost you if I'm right?"

"I have told Claire ten days," Otávio said. Claire runs operations at Veldhaven. "If reading is enough, I have to take that back."

"Then whichever way it goes, she hears it from both of us, on the same call."

Being wrong would now cost each of them one short sentence, said beside somebody who had risked the same. If you want an honest test, first make losing it something a decent person can live with.

## The goal, then the plan

Some arguments survive every fact. You agree on what happened and want opposite things done. Leave the plans alone and write the goal as something both of you could watch happen, the **observable version** of a purpose.

Mateo had argued for speed and Otávio for control, two labels nobody can check. The goal they could both sign was this: "No change sends a truck to a wrong door without a named person having checked it for exactly that. Site two is live before the December peak." Against that goal, both plans came up short. Ten days of access review did nothing for the first sentence. Reading did little for it while nobody was free to say no.

If you can't write one goal you both accept, that's the disagreement. Say it in one line and take it to whoever owns the goal.

## The rule, then the decider

When there isn't enough of something for both of you, no argument makes more of it. Otávio has two reviewers. In the weeks before the peak, every supplier who touches Veldhaven's systems wants them.

Agree how the choice gets made before you argue any one case. Make the rule about the work ("whatever can move a truck goes first"), because a rule about people ("Tolva waits") starts the argument again every week. Then name the person who decides the case your rule didn't foresee.

"And when my reviewer says no?" Otávio asked.

"Then it's no, with the reason in writing, until Claire has heard both of us. She decides the same day."

"She will like that less than we do," Otávio said. Claire agreed to it anyway.

## Give the reason, or keep them listening?

You may have been told to show your reasoning. At its best, a reason is something the other person can check, and without one you are asking to be trusted. You may also have been told that reasons make people defend harder. That has a best case too. A "because" that arrives after someone has taken a position in front of others can hand them something to fight.

My rule: give a reason when it invites checking, and hold back the "because" whose only job is to prove someone wrong. Look at Mateo's third line. "That change used only the access you gave it" was true, and it was said to win. The same fact can invite: "I believe that change stayed inside the access we agreed in August. Could your team confirm it from the log?"

Give one reason, your strongest, and stop; *The pitch* has the nearest finding. An argument adds its own cost: offer three reasons, and the other person can answer the weakest and leave you defending a sentence you never needed.

## Give the point, keep the rest

A good point against you stops somewhere. There are two ways to miss the place: give nothing, or give everything to make the discomfort end. Ask of their point what you would ask of your own, the third question of *the second-question test*: *Where does it stop?* Then concede exactly that far.

Otávio showed how, once he had looked at the log. "Ten days would not have caught it. Ten days is for access, and the access was right. So I take it back for changes that stay inside the access you have. A change that asks for more still gets all ten."

He gave the whole point and kept the ten days that still did something. The practice below fills in the pattern:

`You're right that [the exact point]. So [what I change]. It doesn't reach [what I keep], because [the reason].`

Concede only what you now believe. A point given as a move, to get one back, is a small lie.

### Practice: one point, at its size

**Situation.** A design review. You propose that the mobile app retries failed payments by itself. The client's architect says, "If the first attempt timed out, a retry can charge the customer twice."

**First draft (what a capable engineer says).**
"Well, the provider is supposed to catch duplicates, so in practice that would be pretty rare. But sure, if it's a concern, we can take retries out."

**What's wrong.** "Supposed to" and "pretty rare" rest on nothing anyone has looked at. Then the whole design goes, including the part her point never touched.

**Better.**
"You're right: after a timeout we don't know whether the first attempt went through. So we won't retry timeouts. It doesn't reach refused connections, because nothing got as far as the provider. Those were seven in ten of last month's failures, by our log. I'd keep retries for those."

"So the design was wrong."

"For timeouts, yes. I hadn't separated the two. For refused connections I still think it's right, and one refused connection that charged someone would change my mind."

**Why it works.** Her point is said and granted in full, and the line where it stops has a reason she can check. The second answer grants it again and names what would end the rest.

**Your turn (10 minutes).** Write down the best point anyone has made against a piece of your work. Fill in the pattern, say it aloud, and answer "So you were wrong?" in two sentences. **Done means** a colleague who hears both can tell you what you gave up, what you kept, and what would make you give up the rest.

## Change your mind in public

On Friday the engineer read all six. She stopped two of the three with hidden faults and passed the third. Its own tests had passed too: the agent had written them, and none looked at the doors the fault moved. Before anyone told her the score, she closed the changes, wrote her own tests from each brief, and ran them. They caught the third fault at once, and she hadn't known there was one left to find.

On Monday Claire joined the call, and Mateo went first:

"On Wednesday I said any of my engineers would catch it by reading. She caught two of three, so I was wrong about reading on its own. What stopped the third was a test she wrote from the brief. So I'm proposing both. A named engineer reads and signs every change an agent writes, and checks it against tests a person wrote. One reader and three faults is a small trial. If you've told anyone that reading is enough because I said so, tell me who, and I'll correct it."

Say what you claimed and when, what moved you, and what you think now, at its size. Then go after the old version, because people may still be acting on it. That step is easy to skip, and it is why people can believe your next claim: they watched you take the last one back.

"And I told you ten days for everything," Otávio said to Claire. "Ten are for new access. For the rest, their signature reaches us one working day ahead, and we can stop it. I'd put my name to that." Both could now say what each control catches and where it stops. They ran the rule as a trial until site two's go-live, and the three changes were in by the end of the month.

## When nobody moves

They didn't settle everything. Otávio wanted no agent-written change to run after ten at night. Mateo wanted the quiet hours, when the fewest trucks wait. Neither could name a test that would fit before November, and after two rounds nothing new was being said.

Stop there, and stop in writing. "We disagree about one thing: whether these changes may run at night. Until it's decided, they run by day. Claire decides on 30 October." With a name and a day, an unfinished argument costs you a line on a page. Without them, it can come back in every meeting under a new subject.

> **From practice:** Before a review starts, write its question on the shared page in words both sides accept. When someone makes a fine point about something else, anyone can point at the sentence without sounding rude.

## On the page

In a thread nobody hears a yes, so it is easy to keep adding reasons. Once the same point has gone back and forth twice, write one message with their side, your concession and the test in it, or pick up the phone.

Ask an assistant for a case on your side, then for the other side. If it writes both, its agreement settles nothing, but it may show you an objection you haven't met. Which fact would change your mind, and what you will say when it turns up, are yours to answer for.

### Practice: the trial that costs too much

**Situation.** You run a small software company. Your head of sales wants the free trial cut from thirty days to fourteen. The thread is nine messages long, and it's your turn.

**First draft (what a careful founder writes).**
"I do hear you, but thirty days is standard for tools like ours. Everyone I talk to says a month is the minimum, the last three customers signed in week four, and a short trial makes us look desperate. Changing the emails would also take a week. I just don't think it's right for our kind of customer."

**What's wrong.** Five reasons at one volume, and the weakest is the easiest to answer. Nothing says where the head of sales is right, or what would end the thread.

**Better.**
"Your side, as I understand it: people decide in the first week or not at all, so days fifteen to thirty cost us support time and teach us nothing. Correct me if that's not it.

You're right about support. I checked the tickets: eleven hours a week go to trials past day fourteen, and I'd left that out.

Where I still disagree is one fact. I think the larger companies decide late. I've read six of last quarter's forty trials, so that's all it rests on.

Could we count all forty on Thursday, by size and by the day they decided? If three or fewer of the twelve larger ones decided after day fourteen, I'll cut it to fourteen. How many would change your mind?"

**Why it works.** Their side comes first, one point is granted with its number, and five reasons become one fact to count. The writer says what result would change their mind, and asks for the same.

**Your turn (15 minutes).** Take a real thread. Write: their side, the point you give, the one thing still in dispute, what would settle it, and what you'll do if it goes against you. **Done means** a stranger who reads only your message can say what would settle it, and the reply starts with a yes or a correction.

## Practice: what would change your mind

**If you do only one, do this one.**

**With a person.** Choose a disagreement that's still open this week, with someone you can talk to.

1. On a card, write your claim in one sentence. Under it, write the one thing that would make you give it up. If you can't, you are not ready to argue yet.
2. Write your guess at theirs.
3. Say their side until they say yes. Then ask, "What would you need to see?", and tell them yours.
4. Together, write one sentence that begins "This is settled when".

Watch what they name. If it can be checked, you have a test. If it's something they want, sort again. If neither of you can name anything, stop and ask who decides. Looking for the fact that would move you both is a known exercise; the sorting keeps it useful when no fact would.

**Done means** the sentence is in writing, you have both said yes to it, and someone who wasn't there could tell whether it has happened. If you would rather think before you answer, do all of it in messages.

**Spar with an AI.** Rehearse the argument you most want to win.

```text
You disagree with me about [the question]. Your position is [their side, in two sentences].
Argue it honestly. Do not agree with me to be polite.
Do not answer my objections until I have said your side well enough that you would sign it. If I get it wrong, correct me once.
Change your mind only about what I have actually shown, and say exactly which part.
After six exchanges, stop. Tell me my weakest reason, the point of yours I avoided, and whether I gave up more or less than you had earned.
```

*Safe practice: before you paste anything into an assistant, change names and figures and leave out anything confidential, or use a tool your employer has approved; treat its feedback as one agreeable opinion, not a grade.*

## Words to use

- **Their side.** "Let me say your side, and you correct it."
- **To sort it.** "Are we disagreeing about what happened, or about what to do next?" "What would settle this for you?"
- **Before a test.** "Before we look: which result would change your mind, and which would change mine?"
- **Your stake.** "You should know what I stand to lose here: [it]."
- **A changed mind.** "On [day] I said [claim]. Since then [what happened]. I now think [new claim]."
- **An ending.** "We disagree about one thing: [it]. Until [name] decides on [day], we'll [what happens meanwhile]."

### Phrases you will hear

- "Let's agree to disagree" (let's stop here): ask who decides, and what happens until then.
- "I'm just playing devil's advocate" (I'm arguing a side that may not be mine): ask, "Is it a worry of yours?"

## When it backfires

**They can end it.** Someone with more power doesn't have to argue with you. Give your claim, its one reason and what would change your mind, once, in private or in writing. Ask, "What would you need to see?" If the answer is nothing, it is decided, and that is worth knowing. Never propose a test of your boss's claim in front of the people who report to them.

**You're the one who can end it.** When you hold the power, people may say yes to your version of their side because it's yours. Ask for the correction: "Which part would you say differently?" And name your stake first, because it is hard for them to ask.

**It isn't an argument.** How a person is being treated, or whether they are safe, is nothing to test or trade. *Difficult people* says where to take it.

**The test costs more than the mistake.** Two engineers disagree about a variable's name. Whoever owns the file decides.

**Their side, said to beat it.** Restate them in a weaker form and you've turned a courtesy into a trap. Treat a read-back that gets no yes as your fault until you've tried twice.

**A question that sounds like an accusation.** In some teams "What would change your mind?" means "You're being stubborn." Ask it of both of you: "What would we need to see?" Where disagreeing in front of others costs someone their standing, have the argument before the meeting.

**In a second language.** Saying their side takes words you may not have ready. Ask for time, write it, and read it out: "I've written your side in two sentences. Tell me what's wrong." Written down, nobody can mistake a word you searched for as a point you gave up.
