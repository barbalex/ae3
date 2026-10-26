---
context menu use in nav tree: is it really useful? Could we move to the form (headers)?
---

would moving from graphql to postgrest make sense in this project? 1. reduce bundle size 2. reduce attack surface. Other upsides? No one else is currently using the graphql api and this is a one-dev project - so graphql's advantages are not being used here, right?

---

MUI + Emotion as big bundles: would it make sense to remove them and try using a minimal css based approach?

---

dark and light mode

---

we are currently using react-contextmenu for context menus (I assume only in the nav tree). As we did in apf2, lets replace it with pure css
