# The presentation

One colleague typing question marks can show you the slide where your talk loses the room.

"Type a question mark in the chat whenever you don't know why I'm telling you something," Naomi asked Diego on a Monday late in August. She is a data consultant who works alone from Seattle, and Veldhaven buys her forecast of when trucks will reach its warehouses. On Wednesday she would present it by video to Veldhaven's operations review: fifteen minutes, nineteen slides. Diego is the engineer Tolva has placed at Veldhaven, and Tolva's dock scheduler will plan doors on her forecast. He gave her half an hour to rehearse.

The first mark came on slide five, while she explained how she cleans the gate logs. Eight more had come by slide thirteen. Then they stopped. On slide eighteen she reached her ask: that seven of the carriers serving site three, the cold warehouse, report when each truck leaves its last stop.

"It got better after thirteen," she said.

"No," Diego said. "On thirteen I started answering email. I came back when I heard you ask for something, and by then I didn't know what it was for."

## A quiet room

Diego told her because she had asked him to. The review might never have told her. A bored room doesn't object, and its silence is easy to take for a yes.

Slides five to seventeen, the middle of the talk, showed the forecast in the order Naomi had built it. They answered a question only another data scientist would ask: how is it made? The people on Wednesday's call run warehouses. Once they heard her ask, they would want to know whether they could plan a shift on her forecast.

Build the middle out of the room's questions, one to a section. Decide your ask first. Give people a reason to care about it in the first minute, then answer the questions it will raise, in the order this room will raise them. An assistant can turn your notes into nineteen tidy slides. It can only guess what site three's manager will ask on Wednesday, and you can find out. Get those questions right, and a talk you used to survive becomes a conversation you have prepared for.

> **Line to keep:** A room keeps listening for the answer it is still waiting for.

## The first minute

Naomi's old first slide was an agenda. Her new opening is a working story (*Story for people who think in systems*): one moment, its count and the decision handed over. It runs under ninety seconds, a limit this book sets.

"Two weeks ago, at half past three in the afternoon, your shift lead at site three had two people in freezer jackets beside an empty door. A truck was booked for that time, and my trial forecast agreed. It was still being loaded, at a supplier an hour away, and its carrier knew. Since July, two of your nine carriers have sent the time each truck leaves its last stop. Before I used those times, I missed half their trucks by more than thirty minutes, and two in three of those had left late. Should the other seven send theirs? That's what I'll ask you to decide."

The moment gives the room someone to picture. The handover tells people what they will be asked for while there is still time to think about it. It also starts a question in their heads, and an opening that starts one has done its work.

## The middle, one question at a time

From there, the middle runs on next-question order (*Give it a shape*), with a whole section in place of each sentence. Start from the ask. After each section, answer what this room would ask next.

You can guess some of the questions. Ask someone for the rest. Naomi wrote to Claire, who runs operations at Veldhaven and would chair the review: "When I ask you to go to the carriers, what will site three's manager ask first?" Claire answered in one line: "What it costs them, and what we do if they won't." Two guesses and one reply gave Naomi her middle:

1. Could we plan a shift on it?
2. Are two carriers enough to believe that?
3. What does it cost the other seven?
4. What do we do if they won't?

Nineteen slides became six: the moment, the four questions and the ask. Everything about how the forecast is made went behind the ask, where a question can call it up. Each slide that stayed holds only what the room must look at to check the answer. Words she was going to say came off it.

The last two answers were short. It costs one message a trip, and only site three can say how the carriers will take it. If they refuse, the forecast stays out of site three's plan and go-live doesn't move.

> **From practice:** Ask the next question while the old slide is still up. When a slide changes, people start reading, and a question asked into their reading is easy to miss. Say it, give it a breath, then show the slide that answers it.

The tool also tells you when to stop: when the next question is theirs to ask. Naomi cut a fifth section, on the December peak. If December mattered to them, they would ask.

### Practice: one section, with a question in it

**Situation.** The operations review. Naomi reaches the figures for site three, and its manager comes in with a question. The first draft is from the nineteen slides.

**First draft (what a careful data scientist says).**
"This chart is absolute error by site, in minutes, median and spread. Site three has the longer tail. We added departure timestamps as a feature for the two carriers that have them, and you can see the tail come in."

"So can I plan a shift on it?"

"I'm coming to that on slide fourteen."

**What's wrong.** The words belong to her field, so the manager has to turn "tail" into trucks while Naomi keeps talking. Then the manager asks the very question the section exists to answer and is told to wait for a number on a slide.

**Better.**
"Could you plan a shift on it? At site three, not yet. With the leaving time, the forecast is within thirty minutes for about seven arrivals in ten. Without it, the same trucks: about five. That's the two carriers who send it, over seven weeks."

"Two carriers. I have nine. Why would the others be the same?"

"I don't know that they would. Those two bring about a quarter of your trucks, and I checked every one against your gate log. None of the seven weeks was a peak week. Six weeks of the others' times would tell us."

**Why it works.** The section opens on the room's question and answers it before explaining anything. The manager then asks the next question on Naomi's list, and a room that asks your next question before you do is following you. Her second answer stops where two carriers and seven weeks stop: the calibrator's habit.

**Your turn (10 minutes).** Take a talk you have to give. Write its ask at the top of a page, and under it the four questions your ask will raise, in the room's words. Message one person who will be there: "When I ask for this, what will they ask first?" Then answer your second question aloud, question first, in about fifty words, a target this book sets. **Done means** a colleague who hears the answer once can say which question it answered and where the answer stops.

## A room you can't see

On Wednesday the review would reach Naomi as six small figures at the far end of one camera. She couldn't read their faces from Seattle, so she arranged for words.

- Diego sat at the table in Rotterdam, and she said why: "I can't see all of you, so Diego will tell me when someone wants to speak."
- The ask and the four questions went to everyone on one page the evening before. If her line dropped, the room would lose the charts and keep the decision.
- She said the slide's number each time it changed, because a shared screen can run behind the voice.
- She stopped sharing her screen before the ask, so the room saw a person asking.

## Rehearse what must be right

"Know it by heart": the first minute comes when nerves are loudest, and a wrong number is hard to take back. "Don't rehearse too much, be natural": a memorized text has no place for a question, and one forgotten word can take the paragraph with it.

They are right about different parts of the talk. Rehearse the parts that must be right: the first minute, the point sentence, the numbers and the two hardest questions. Improvise the surface, which is every sentence in between. In the middle, that means you know your questions by heart, in order, and find the words of each answer on the day. Forget a sentence, and the question is still there to answer.

Naomi rehearsed her point sentence until she could say it anywhere in the talk. "Claire should ask the other seven carriers for leaving times, because without them I can't test my site-three forecast before November."

### Practice: a question mark in the chat

**If you do only one, do this one.**

**With a person.** This week, ask a colleague for fifteen minutes on a call and present the middle of your next talk. They type one question mark whenever they can't say which question you are answering. Don't stop and don't explain.

Afterward, go to the slide where the first mark came and ask, "What did you want to know there?" The reply is often the question your section is missing. Put it first, cut what doesn't answer it, and give that section once more. Watch for marks that stop halfway, and ask whether your colleague stopped too. Writers ask early readers to mark where they got lost; this is the same mark, live.

**Done means** a second run with no question mark between your first minute and your ask.

**Untimed form.** Send the slides with your notes, and your colleague marks them in their own time. In a room, they mark paper.

## When the questions come

Naomi gave the ask, with its date: the leaving times from 7 September, six weeks of trucks, and her yes or no on site three by 23 October. Then she stopped. Site three's manager asked which hours were worst. That was a fact, so she gave it first, "Two to five in the afternoon," and then the slide behind it. Diego wrote to her that the manager wasn't finished.

"Every autumn somebody asks my carriers for one more thing," the manager said. "In December I'm the one asking them for favors."

Naomi **sorted first** (*Thinking on your feet*): a fact, a judgment, a commitment or a challenge? No slide would settle this. It was a challenge, and it was right.

"Those are your favors. Which of the seven would you spend one on?"

"Three of them. They bring half my trucks."

"Then three," Claire said. "I'll phone them before Friday."

Naomi had asked for seven and got three, with a name and a day. The test would be smaller, and the plan was one site three would stand behind. The manager's reason came out because a question met it instead of a defense.

Keep one sentence back for after the questions, because otherwise the last question becomes your ending. Hers was the decision as it now stood. "So, three carriers from 7 September. You'll have my yes or no on site three by 23 October, with a smaller test behind it."

## Words to use

- **To promise the ask early.** "By the end I'll ask you to decide one thing: [the decision]."
- **Between sections.** "That leaves the next question: [the question]."
- **When someone asks early.** "I'll answer that now." Then: "Back to [the question we were on]."
- **When the room has gone quiet.** "I'll stop on this one. What would you want to know before you decided?"
- **When your time is cut.** "I'll skip to the decision and the one risk in it."
- **When you present remotely.** "I can't see the whole room. [Name] will tell me when someone wants to speak."
- **To close after the questions.** "So the decision is [what it is now], and I'll [your part] by [day]."

### Phrases you will hear

- "Walk us through it": explain it step by step. Give your first question, then the answer.
- "I'm conscious of time": please finish soon. Go to the ask.

## When it backfires

**The room breaks your order.** A chief executive says, "Go to the number." Go there. Your order was a guess about their questions, and they have corrected it. The more power they hold, the faster you leave your slides; offer the rest on the page you sent. Defending the sequence costs you more than losing it.

**You save the answer for later.** Once someone has asked, making them wait serves you, not them. A question you raise and answer helps them; an answer you hold back is a trick, and people may notice.

**You do it on every slide.** A question before each chart sounds like a school quiz. Ask between sections only.

**Nobody has to decide anything.** A safety briefing or an audit has to cover every item, whether or not the room is curious. Give the full list, in its own order, and hand it out. If your whole talk answers one question, send a page and use the meeting for what it raises.

**Two rooms in one.** An engineer and a finance lead can want different next questions. Follow the person who decides, and tell the other where theirs will come.

**The quiet means something else.** In some rooms questions go through the most senior person, or wait until afterward. Ask your host beforehand how this room asks, and don't read silence as boredom, or as a yes. Diego could be frank because he was asked; a junior colleague may type no marks at all for someone who signs their review.

**A second language.** Learn the questions between your sections as whole sentences; they carry the talk if an answer comes out roughly. Invite questions in the chat as well as aloud, and take your time with one: "Let me read that once more."
