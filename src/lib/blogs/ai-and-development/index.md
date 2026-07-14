---
title: 'The Impact AI Has on Development'
description: "AI isn't a replacement, but is changing the value of a developer."
date: '2026-06-24'
tags: ['ai']
image: './pr.png'
---

## Introduction

AI is everywhere, and nowhere feels this more than software engineering. It can feel like magic - one prompt to request a featue and it is there ready to be used. This is far from what brought value as an engineer though, which is becoming evermore apparent as I spend time in industry.

I have been learning development the old-fashioned way since I was 12 years old, youtube, stack overflow, documentation - getting the odd abusive message that you will never make it in life as you named a variable in snake case. AI only started becoming available at the end of university, with no prior knowledge of industry before AI - which I feel gives a unique perspective.

## Best Practices

Syntax, git, maintainability. These are all things as software engineers we had to learn, without it you will learn quickly why it is needed, and force yourself to learn it - teaching best practices on how/why good software is written. Now the order has flipped, you are making services without the groundwork in place to make it last. Now, this is describing a 'vibe coder' - and I don't want to use the term as an insult, anyone with an interest to make something should always be encouraged.

However, I don't think it should be undermined how important knowing best practices are for the longevity and team collaboration of a project.

## Architecture

Code is cheap, and it always has been - junior, mid, senior. What makes a senior developer different to a junior developer? Instinct would say it is experience, but what does that mean? Both a senior and junior developer can write a feature, both can test, both can understand the principles of an array, recursion, integer etc.

The difference shows up before a single line is written. A senior developer has seen the same problem go wrong three or four different ways, and that's what experience actually buys you - not faster typing, but a mental ability of foresight. They know which abstraction will bite in eighteen months, which "quick fix" becomes the thing nobody dares touch, and which seemingly clever shortcut quietly removes a team's ability to onboard new people. A junior can write the same function, but they can't yet see the shape of the system it's going to live in.

This is exactly where AI struggles, and where it will keep struggling for a while yet. It doesn't have to live with the codebase it just generated, doesn't get called at 9pm when the abstraction it suggested didn't account for the workload in production, and has no sense of the specific constraints your team, your infra, or your business actually operate under. It's brilliant at producing *a* solution. It has no real instinct for whether that solution belongs there.

So when AI is dropped into the hands of someone who hasn't yet built that instinct, it doesn't accelerate their growth into a senior engineer - it accelerates their ability to produce things that look finished. The two are not the same, and the gap between them is exactly where technical debt is born. I personally see this in open source, taking over a project with 1000 stars, I was able to reduce the code by 80,000 lines while preserving functionality, while increasing maintainability and fixing issues - 300 lint errors down to 0. AI generated PRs swarming the repo, with not enough hours in the day to review any of it, so auto-close goes on.

## Where AI Genuinely Helps

I don't want this to read as anti-AI, because it isn't. Used well, it's removed a huge amount of the friction that used to eat up a working day. Boilerplate, repetitive refactors, writing the fifth near-identical test case, translating a clear spec into a first draft of code - these are places where AI is a genuine multiplier, because the judgement required is low and the cost of being slightly wrong is small.

Explaining a problem to a model, even badly, often surfaces the answer before it replies. And for the unglamorous stuff - documentation, commit messages (though I will stand by handwriting these, the more curse words the better), scaffolding a new service in line with conventions you already understand - it removes hours of typing without removing any of the thinking.

The pattern I keep coming back to is this: AI is excellent at compressing the time between *knowing what you want* and *having a first draft of it*. It is not yet any good at telling you whether what you want is right.

## The Shift in Value

If code is cheap, and AI makes it cheaper still, then the part of the job that was always undervalued - knowing what to build, how it should be shaped, and why - becomes the entire job. Writing the function was never the hard part for a senior engineer. Knowing which function to write, and which ten to avoid, was.

What worries me is the junior progression, espcially as someone recently entering the professional environment. The way I learned as a teenager - hitting a wall, being forced to read documentation I didn't want to read, debugging something at 3am so that I never made the same mistake twice - is slower, but it's also how the instinct gets built in the first place. If AI removes the wall before anyone has to climb it, you get developers who can produce output far faster than they can evaluate it. That's a dangerous combination on a team, because confidence in the result doesn't track the quality of the result. It is also concerning that there are a shrinking amount of opportunities to make these mistakes while still learning, what happens when there is no one able to fulfil a mid/senior role as no one was able to enter the industry as a junior.

## Conclusion

AI hasn't replaced developers, and I don't think it's going to in the way the loudest takes suggest. What it has done is expose, quite starkly, what was always the actual job: judgement, taste, and the accumulated knowledge of having built things before. Code was always cheap. We just didn't notice because writing it used to take long enough to disguise that fact.

The engineers who do well from here I believe won't be the ones who can prompt the fastest. They'll be the ones who can look at what a model produces and immediately know whether it belongs in the system - and that's a skill no amount of AI can shortcut you into.
