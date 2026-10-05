import re

with open("src/app/database/page.tsx", "r") as f:
    content = f.read()

# Fix the broken syntax from previous sed
content = content.replace('fetch(${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:8000\'}/db/', 'fetch(`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:8000\'}/db/')
content = content.replace('fetch(${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:8000\'}', 'fetch(`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:8000\'}`')

with open("src/app/database/page.tsx", "w") as f:
    f.write(content)
