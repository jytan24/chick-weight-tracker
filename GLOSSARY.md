# JY Chick

A small system that lets a broiler farmer record how heavy her chickens are and see how far they are from the breed's standard weight for their age.

## Language

**Breed**: The type of broiler chicken. One of three: Ross, Cobb, AA Plus.
_Avoid_: Type, kind, strain

**Age**: How many whole days since the chicken hatched. Day 0 is hatch day. The standard table covers day 0 to day 44.
_Avoid_: Days old, DOB

**Standard Weight**: The weight (in kg) a healthy chicken of a given Breed is expected to have at a given Age, taken from the breed's standard bodyweight table.
_Avoid_: Target weight, ideal weight, benchmark

**Actual Weight**: The weight (in kg) the farmer measured on the scale.
_Avoid_: Real weight, current weight

**Weight Gap**: Actual Weight minus Standard Weight, shown both in kg and as a percentage of the Standard Weight. Negative means the chicken is lighter than standard.
_Avoid_: Difference, variance, deviation

**Standard Table**: The published list of Standard Weights for each Breed from day 0 to day 44.
_Avoid_: Growth chart, reference sheet

**Weighing**: One saved record of a Breed, an Age, an Actual Weight, the date it was weighed and an optional note. Weighings are not grouped into flocks.
_Avoid_: Entry, record, log, sample

**Status**: A label describing a Weighing's Weight Gap percentage (rounded to 1 decimal): **Ahead** (+5.0% or more), **On track** (−5.0% to under +5.0%), **Slightly behind** (−10.0% to under −5.0%), **Behind** (below −10.0%).
_Avoid_: Grade, health, condition
