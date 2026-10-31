# Design direction

JY Chick is used by a farmer on her phone, one-handed, in a poultry house: bright light, dim sheds, maybe dirty hands. The screen has two jobs. Enter breed, age and weight in seconds. Read whether the flock is on track at a glance.

## The one memorable thing: the gap gauge

Every weighing shows a ruler from −15% to +10% of the standard weight.

- A tick marks the standard weight (0%).
- A marker shows where this weighing is.
- The zone the marker sits in lights up. The other zones fade.
- Four zones: **Behind** (below −10%), **Slightly behind** (−10% to −5%), **On track** (−5% to +5%), **Ahead** (+5% or more).

Colour is never the only signal. Every status also has an icon and a word.

## Days slow or fast

Each row has one more line under the status: how many days slow or fast the chicken is ("2 days slow", "3.94 days slow", "On schedule"). It is plain ink with a calendar-clock icon, not a status colour, because it measures something different from the percent gap. Numbers show at most 2 decimals and no needless zeros. When the weight is outside the table it says so ("At least 4 days fast (off the table)", "Ahead of the table").

## Batches

A weighing can be a batch: a big "Number of chicks" box (starts at 1) sits above the weight. With more than one chick the weight label becomes "Total weight of all the chicks", and the panel under the inputs shows "Average per chick" above the standard weight, so a mistake such as typing an average as the total is easy to see. In the list, a batch row has one extra line in ink: "Average of 104 chicks · total 98.700 kg". The big number on the row is always the average, because that is what is compared with the standard. The edit form shows the total she typed.

## Colours

| Name | Light | Dark | Used for |
| :--- | :--- | :--- | :--- |
| Sage paper | `#EEF2EC` | `#0E1512` | Page background |
| Barn ink | `#17261F` | `#E8EFE9` | Text, main buttons |
| Ahead blue | `#1D63B8` | `#6AA6F0` | Status: Ahead |
| On-track green | `#1C7A45` | `#4CC585` | Status: On track |
| Slightly-behind amber | `#B86E00` | `#F0B04A` | Status: Slightly behind |
| Behind red | `#B42318` | `#F07A6E` | Status: Behind |

## Type

- **Big Shoulders Display** (bold, condensed, like stencils on a feed sack): numbers, titles and the app name.
- **Atkinson Hyperlegible**: all other text. It was designed so similar letters and digits are easy to tell apart.
- Base text is 17px. Inputs are at least 16px so phones don't zoom in.

## Layout rules

- Phone first. One column, up to 560px wide, even on a computer.
- Weighings are ruled ledger rows, not cards.
- The main action sits in a fixed bar at the bottom, in thumb reach.
- Every tap target is at least 44px tall.
- Breed is chosen with three big buttons, not a dropdown.
- The weight and age inputs use big numerals, and the form shows the standard weight for that breed and day as you type.
- Delete lives away from Save, at the bottom of the edit page, and asks for confirmation.

## Words

- Sentence case. Buttons say what happens: "Add weighing", "Save changes", "Delete weighing".
- Errors say what to fix, e.g. "No standard weight for this age".
- Empty states say what to do next.

## Page sketch (phone)

```
┌────────────────────────────┐   ┌────────────────────────────┐
│ JY Chick            ☾  Out │   │ ← Add weighing             │
├────────────────────────────┤   │ Breed                      │
│ Weighings                  │   │ [ Ross ][ Cobb ][ AA Plus ]│
│ (All)(Ross)(Cobb)(AA Plus) │   │ Age (days)         [ 21 ]  │
│ ══════════════════════════ │   │ Weight            [0.950 kg]│
│ Day 21              31 Oct │   │ Standard for Ross, day 21: │
│ Ross                       │   │ 1.012 kg                   │
│ 0.950 kg   standard 1.012  │   │ Date          [31/10/2026] │
│ ▓▓▓▓▓▓▒▒▒▒▒▒░░░░░░▒▒▒▒▒    │   │ Note              [House 2]│
│        ▲        │standard │   ├────────────────────────────┤
│ −6.1%  ⚠ Slightly behind   │   │ [        Save           ]  │
│                      Edit  │   └────────────────────────────┘
├────────────────────────────┤
│ [    + Add weighing      ] │
└────────────────────────────┘
```
