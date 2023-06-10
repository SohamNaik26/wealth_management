# String Slicing
fruit = "mango"
len1 = len(fruit)
print(len1)

nm = "Soham"

print(nm[-4:-2])

# String Methods
a = "*******Soham*******"
print(a)
print(a.upper())
print(a.lower())
print(a.rstrip("*"))
print(a.replace("Soham", "Naik"))


str1 = "Welcome to the Console !!!"
print(str1.endswith("to", 4, 10))
print(str1.find("to"))
print(str1.isprintable())

str2 = "        "  #Using Space
str3 = "        "  #Using Tab

print(str2.isspace())
print(str3.isspace())

str4 = "World Health Organisation"
print(str4.istitle())

str5 = "Python is future"
print(str5.startswith("Python"))

str1 = "nobody can defeat me"
print(str1.swapcase())