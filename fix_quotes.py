import re
with open("src/app/database/page.tsx", "r") as f:
    text = f.read()

# Fix the trailing double quotes from the first sed
text = text.replace('}/db/documents", {', '}/db/documents`, {')
with open("src/app/database/page.tsx", "w") as f:
    f.write(text)
