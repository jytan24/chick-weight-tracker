# JY Chick

A small system that lets a broiler farmer record how heavy her chickens are and see how far they are from the breed's standard weight for their age.

## Language

**Breed**: The type of broiler chicken. One of three: Ross, Cobb, AA Plus.
_Avoid_: Type, kind, strain

**Age**: How many whole days since the chicken hatched. Day 0 is hatch day. The standard table covers day 0 to day 44.
_Avoid_: Days old, DOB

**Standard Weight**: The weight (in kg) a healthy chicken of a given Breed is expected to have at a given Age, taken from the breed's standard bodyweight table.
_Avoid_: Target weight, ideal weight, benchmark

**Actual Weight**: The weight (in kg) of one chick, as measured on the scale. For a Batch it is the Average Weight.
_Avoid_: Real weight, current weight

**Weight Gap**: Actual Weight minus Standard Weight, shown both in kg and as a percentage of the Standard Weight. Negative means the chicken is lighter than standard.
_Avoid_: Difference, variance, deviation

**Standard Table**: The published list of Standard Weights for each Breed from day 0 to day 44.
_Avoid_: Growth chart, reference sheet

**Weighing**: One saved record of a Breed, an Age, a Batch (one or more chicks) with its total weight, the date it was weighed and an optional note. Weighings are not grouped into flocks.
_Avoid_: Entry, record, log, sample

**Status**: A label describing a Weighing's Weight Gap percentage (rounded to 1 decimal): **Ahead** (+5.0% or more), **On track** (−5.0% to under +5.0%), **Slightly behind** (−10.0% to under −5.0%), **Behind** (below −10.0%).
_Avoid_: Grade, health, condition

**Growth Age**: The Age at which the Standard Table gives exactly the Actual Weight. If a Ross chick weighs 0.789 kg, its Growth Age is 18, whatever its real Age. Weights that fall between two days are placed part-way between them (for example 31.06).
_Avoid_: Equivalent age, weight age, biological age

**Days Slow / Days Fast**: Age minus Growth Age, shown to up to 2 decimals without needless zeros (2, 1.85). Positive means the chicken is **slow** (lighter than standard, behind the table by that many days). Negative means **fast**. About zero is **On schedule**. When the Actual Weight is outside the whole Standard Table, only a minimum can be known, so it is shown as "at least" and marked **off the table**.
_Avoid_: Days behind, delay, lag

**Batch**: The chicks weighed together in one Weighing, from 1 to 1000. One chick on its own is a Batch of 1.
_Avoid_: Flock, group, sample, lot

**Average Weight**: The total weight of a Batch divided by the number of chicks, rounded to the nearest whole gram (an exact half rounds up). It is the only number compared with the Standard Weight, so Weight Gap, Status and Days Slow / Days Fast all use it.
_Avoid_: Mean, typical weight
