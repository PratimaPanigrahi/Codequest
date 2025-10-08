// backend/ai/offlineQuiz.js

// Level 1 question bank
export const level1Questions = [
  { question: "What is Python primarily known for?", options: ["Complex syntax", "Speed of execution", "Simple syntax and readability", "Being a low-level language"], answer: "Simple syntax and readability", type: "mcq" },
  { question: "True or False: Python is a compiled language, meaning you must compile your code into a binary file before running it.", options: ["True", "False"], answer: "False", type: "tf" },
  { question: "Who created the Python programming language?", options: ["Bill Gates", "Guido van Rossum", "Dennis Ritchie", "James Gosling"], answer: "Guido van Rossum", type: "mcq" },
  { question: "Python was named after:", options: ["A species of snake", "The British comedy group Monty Python", "The Python programming book", "Its creator's pet"], answer: "The British comedy group Monty Python", type: "mcq" },
  { question: "True or False: Python code uses curly braces {} to define code blocks like functions and conditionals.", options: ["True", "False"], answer: "False", type: "tf" },
  { question: "Which of the following is NOT a major feature of Python?", options: ["Dynamically typed", "Open source", "Requires variable type declaration", "Interpreted"], answer: "Requires variable type declaration", type: "mcq" },
  { question: "True or False: Python supports multiple programming paradigms, including procedural, object-oriented, and functional programming.", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "In which year was Python first released to the public?", options: ["1989", "1991", "2000", "2008"], answer: "1991", type: "mcq" },
  { question: "Which of the following is a key advantage of Python?", options: ["Programs typically require more lines of code than other languages", "It has a small standard library", "Rapid development with fewer lines of code", "It is not portable across different operating systems"], answer: "Rapid development with fewer lines of code", type: "mcq" },
  { question: "True or False: Python is considered a 'high-level' programming language.", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "What is the main purpose of comments in Python code?", options: ["To make the code run faster", "To explain the code and make it more readable", "To hide code from the interpreter", "To declare variables"], answer: "To explain the code and make it more readable", type: "mcq" },
  { question: "Which symbol is used for single-line comments in Python?", options: ["//", "/*", "#", "--"], answer: "#", type: "mcq" },
  { question: `What is the output of this code?\n\nprint(23 + 7)`, options: ["23 + 7", "30", "237", "Nothing, it will cause an error"], answer: "30", type: "code" },
  { question: "True or False: The print() function can only output text strings to the console.", options: ["True", "False"], answer: "False", type: "tf" },
  { question: `Which of the following is a correct use of the print() function?`, options: ['print "Hello World"', 'print(Hello World)', 'print("Hello World")', 'print{"Hello World"}'], answer: 'print("Hello World")', type: "mcq" },
  { question: "In Python, what is used to define code blocks (like the body of an if statement or function)?", options: ["Semicolons", "Curly braces {}", "Parentheses ()", "Indentation"], answer: "Indentation", type: "mcq" },
  { question: "True or False: Python is not suitable for web development.", options: ["True", "False"], answer: "False", type: "tf" },
  { question: "Which of these is a common application of Python?", options: ["Only game development", "Only mobile app development", "Data science, AI, web development, and more", "Only operating system development"], answer: "Data science, AI, web development, and more", type: "mcq" },
  { question: "What does the term 'dynamically typed' mean in the context of Python?", options: ["You must declare the variable type before using it", "The variable type is determined at runtime and you don't need to declare it", "Variables cannot change their type after assignment", "Python has only one data type"], answer: "The variable type is determined at runtime and you don't need to declare it", type: "mcq" },
  { question: "True or False: Python code written on Windows can easily run on macOS or Linux.", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "What does the 'Batteries Included' philosophy refer to in Python?", options: ["Python requires many external batteries to function", "Python comes with a rich standard library for various tasks", "Python is used primarily for electrical engineering", "Python programs have short battery life"], answer: "Python comes with a rich standard library for various tasks", type: "mcq" },
  { question: "Which of the following is a principle from 'The Zen of Python'?", options: ['"Write code as complex as possible"', '"Readability counts"', '"Execution speed is everything"', '"Syntax doesn\'t matter"'], answer: '"Readability counts"', type: "mcq" },
  { question: "True or False: Guido van Rossum was given the title 'Benevolent Dictator For Life' for his role in Python's development.", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "Which of these is a key characteristic of Python syntax?", options: ["It uses cryptic abbreviations", "It is similar to English language", "It requires extensive memory", "It is only for scientific use"], answer: "It is similar to English language", type: "mcq" },
  { question: "What is the primary benefit of Python's simple and readable syntax?", options: ["It makes the code run faster", "It is easier for beginners to learn and for teams to maintain", "It requires less memory", "It makes programs shorter in file size"], answer: "It is easier for beginners to learn and for teams to maintain", type: "mcq" },
  { question: "True or False: Python is an open-source language, meaning it is free to use and modify.", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "Which of these is NOT a common use case for Python?", options: ["Web Development (with Django/Flask)", "Data Science (with Pandas/NumPy)", "AI & Machine Learning (with TensorFlow/PyTorch)", "Writing operating system kernels exclusively"], answer: "Writing operating system kernels exclusively", type: "mcq" },
  { question: `What will this code output?\nname = "Alice"\nprint("Hello, " + name)`, options: ["Hello, + name", '"Hello, Alice"', "Hello, Alice", "It will cause an error"], answer: "Hello, Alice", type: "code" },
  { question: "True or False: In Python, you can use either single quotes (') or double quotes (\") to define a string.", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "The print() function automatically _________ between multiple arguments.", options: ["adds a space", "adds a comma", "adds a newline", "adds a plus sign"], answer: "adds a space", type: "mcq" },
  { question: "Which of the following is a valid Python variable name?", options: ["1st_name", "first-name", "first_name", "for"], answer: "first_name", type: "mcq" },
  { question: "True or False: Python is only used by small companies and startups.", options: ["True", "False"], answer: "False", type: "tf" },
  { question: "What is the main purpose of the print() function?", options: ["To read input from the user", "To perform mathematical calculations", "To display output to the console", "To create graphical interfaces"], answer: "To display output to the console", type: "mcq" },
  { question: "Which version of Python was a major, backward-incompatible release?", options: ["Python 1.0", "Python 2.0", "Python 3.0", "Python 4.0"], answer: "Python 3.0", type: "mcq" },
  { question: "True or False: Multi-line comments in Python are created using triple quotes (''' or \"\"\").", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "Which of these best describes an 'interpreted' language?", options: ["Code is converted directly to machine code before execution", "Code is executed line by line by an interpreter", "Code can only be run on one specific operating system", "Code is always slower than compiled languages"], answer: "Code is executed line by line by an interpreter", type: "mcq" },
  { question: `What does the following code do?\n# print("This is a test")`, options: ["Prints 'This is a test' to the console", "Causes a syntax error", "Does nothing because the line is a comment", "Creates a new file"], answer: "Does nothing because the line is a comment", type: "code" },
  { question: "True or False: Python can be easily extended with modules written in C or C++.", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "Which of these is a reason for Python's popularity in data science?", options: ["Lack of available libraries", "Strong support for mathematical and data analysis libraries", "Inability to handle large datasets", "Poor visualization capabilities"], answer: "Strong support for mathematical and data analysis libraries", type: "mcq" },
  { question: `What is the correct way to print a string that includes a variable's value using an f-string?\nname = "Alice"`, options: ['print("Hello, $name")', 'print("Hello, {name}")', 'print(f"Hello, {name}")', 'print("Hello, " + f{name})'], answer: 'print(f"Hello, {name}")', type: "code" },
  { question: "True or False: Python requires a paid license for commercial use.", options: ["True", "False"], answer: "False", type: "tf" },
  { question: "Which of the following is a Python web framework?", options: ["React", "Django", "Angular", "Vue"], answer: "Django", type: "mcq" },
  { question: "What is the key difference between Python and languages like Java or C++ in terms of syntax?", options: ["Python uses more complex syntax", "Python uses indentation instead of curly braces for code blocks", "Python requires semicolons at the end of each statement", "Python code is always longer"], answer: "Python uses indentation instead of curly braces for code blocks", type: "mcq" },
  { question: "True or False: Python is considered a good language for beginners due to its readable syntax.", options: ["True", "False"], answer: "True", type: "tf" },
  { question: "Which of these companies is known to use Python?", options: ["Google", "NASA", "Instagram", "All of the above"], answer: "All of the above", type: "mcq" },
  { question: `What will be the output of this code?\nprint("Python", "is", "awesome")`, options: ["Pythonisawesome", "Python is awesome", "Python, is, awesome", "It will cause an error"], answer: "Python is awesome", type: "code" },
  { question: "True or False: Python can only be used for scripting and small programs, not large applications.", options: ["True", "False"], answer: "False", type: "tf" },
  { question: "The fact that Python code runs on Windows, macOS, and Linux without modification makes it:", options: ["Interpreted", "Open source", "Cross-platform", "Dynamically typed"], answer: "Cross-platform", type: "mcq" },
  { question: "Which of these is a benefit of Python's large community?", options: ["Fewer job opportunities", "Limited library selection", "Abundant learning resources and support", "More bugs in the language"], answer: "Abundant learning resources and support", type: "mcq" },
  { question: "True or False: Learning Python can be valuable for careers in data analysis, artificial intelligence, and web development.", options: ["True", "False"], answer: "True", type: "tf" },
];

const level2Questions = [
  {
    type: "True/False",
    question: "Strings in Python are mutable",
    options: ["True", "False"],
    answer: 1
  },
  {
    type: "MCQ",
    question: "Which data type is used to store whole numbers in Python?",
    options: ["int", "float", "str", "bool"],
    answer: 0
  },
  {
    type: "True/False",
    question: "Lists in Python can contain elements of different data types",
    options: ["True", "False"],
    answer: 0
  },
  {
    type: "MCQ",
    question: "What is the output of type(3.14) in Python?",
    options: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'bool'>"],
    answer: 0
  },
  {
    type: "True/False",
    question: "Tuples are mutable in Python",
    options: ["True", "False"],
    answer: 1
  },
  {
    type: "MCQ",
    question: "Which data type uses key-value pairs?",
    options: ["dictionary", "list", "tuple", "set"],
    answer: 0
  },
  {
    type: "Fill in the Blank",
    question: "Python was created in ______",
    options: ["1989", "1995", "2000", "1991"],
    answer: 0
  },
  {
    type: "True/False",
    question: "Python is a compiled language",
    options: ["True", "False"],
    answer: 1
  },
  {
    type: "MCQ",
    question: "Which method adds an element to the end of a list?",
    options: ["append()", "add()", "insert()", "push()"],
    answer: 0
  },
  {
    type: "True/False",
    question: "Sets in Python can contain duplicate elements",
    options: ["True", "False"],
    answer: 1
  },
  {
    type: "MCQ",
    question: "What does the 'batteries included' philosophy mean in Python?",
    options: [
      "Rich set of built-in modules",
      "Comes with physical batteries",
      "Only works with battery-powered devices",
      "Requires external libraries for everything"
    ],
    answer: 0
  },
  {
    type: "True/False",
    question: "Python uses static typing",
    options: ["True", "False"],
    answer: 1
  },
  {
    type: "MCQ",
    question: "Which data type would you use for storing unique elements?",
    options: ["set", "list", "tuple", "dictionary"],
    answer: 0
  },
  {
    type: "Fill in the Blank",
    question: "The creator of Python is ______",
    options: ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup", "Brendan Eich"],
    answer: 0
  },
  {
    type: "True/False",
    question: "Dictionary keys must be hashable",
    options: ["True", "False"],
    answer: 0
  },
  {
    type: "MCQ",
    question: "Which operation would you use to combine two strings?",
    options: ["concatenation", "addition", "merging", "joining"],
    answer: 0
  },
  {
    type: "True/False",
    question: "Python automatically determines data types when you assign values",
    options: ["True", "False"],
    answer: 0
  },
  {
    type: "MCQ",
    question: "What is the result of 7 // 2 in Python?",
    options: ["3", "3.5", "4", "3.0"],
    answer: 0
  },
  {
    type: "Fill in the Blank",
    question: "Python was named after ______",
    options: ["Monty Python comedy group", "A snake species", "A mathematical concept", "A Greek philosopher"],
    answer: 0
  },
  {
    type: "MCQ",
    question: "Which data type is immutable and ordered?",
    options: ["tuple", "list", "dictionary", "set"],
    answer: 0
  }
];


// Level 3 Questions (your conditional statements quiz)
const level3Questions = [
  {
    question: "What is the primary purpose of conditional statements in Python?",
    options: ["To repeat code multiple times", "To make decisions and execute different code blocks based on conditions", "To define functions", "To import modules"],
    answer: "To make decisions and execute different code blocks based on conditions",
  },
  {
    question: "True or False: In Python, code blocks within if/else statements are defined using curly braces {}.",
    options: ["True", "False"],
    answer: "False",
  },
  {
    question: "Which keyword is used to handle multiple conditions after an initial if statement?",
    options: ["else", "elseif", "elif", "case"],
    answer: "elif",
  },
  {
    question: `What will be the output of this code?\n\npython\nx = 15\nif x > 10:\n    print("A")\nelif x > 5:\n    print("B")\nelse:\n    print("C")`,
    options: ["A", "B", "C", "A and B"],
    answer: "A",
  },
  {
    question: "True or False: The else clause in an if/else statement requires a condition to be specified.",
    options: ["True", "False"],
    answer: "False",
  },
  {
    question: "Which comparison operator checks if two values are equal?",
    options: ["=", "==", "!=", "==="],
    answer: "==",
  },
  {
    question: "What does the logical operator 'and' do?",
    options: ["Returns True if at least one condition is True", "Returns True only if both conditions are True", "Reverses the boolean value", "Compares two numbers"],
    answer: "Returns True only if both conditions are True",
  },
  {
    question: "True or False: In an if/elif/else chain, once a True condition is found, the remaining conditions are not checked.",
    options: ["True", "False"],
    answer: "True",
  },
  {
    question: "Which of these conditions would evaluate to True?",
    options: ["5 != 5", "10 < 5", "7 >= 7", "3 == 4"],
    answer: "7 >= 7",
  },
  {
    question: "What is the result of this expression: not (5 > 3)?",
    options: ["True", "False", "5", "3"],
    answer: "False",
  },
  {
    question: "True or False: You can have multiple elif statements between an if and an else.",
    options: ["True", "False"],
    answer: "True",
  },
  {
    question: "Which operator has the highest precedence in logical expressions?",
    options: ["and", "or", "not", "They all have equal precedence"],
    answer: "not",
  },
  {
    question: `What will this code print?\n\npython\nage = 17\nhas_license = True\nif age >= 18 and has_license:\n    print("Can drive")\nelse:\n    print("Cannot drive")`,
    options: ["Can drive", "Cannot drive", "True", "False"],
    answer: "Cannot drive",
  },
  {
    question: "True or False: The condition if variable: will be True if the variable contains any value other than None, 0, or empty strings/lists.",
    options: ["True", "False"],
    answer: "True",
  },
  {
    question: "Which of these is the correct syntax for a simple if statement?",
    options: ["if condition then:", "if (condition) {}", "if condition:", "if: condition"],
    answer: "if condition:",
  },
  {
    question: "What does the % operator do in the expression number % 2 == 0?",
    options: ["Division", "Percentage calculation", "Modulus (remainder)", "Multiplication"],
    answer: "Modulus (remainder)",
  },
  {
    question: "True or False: In Python, you should use 2 spaces for indentation in conditional blocks.",
    options: ["True", "False"],
    answer: "False",
  },
  {
    question: "Which logical operator would you use to check if at least one of two conditions is True?",
    options: ["and", "or", "not", "xor"],
    answer: "or",
  },
  {
    question: "What is a recommended best practice for writing complex conditions?",
    options: ["Put everything on one line", "Use deep nesting", "Break them into smaller, named variables", "Avoid using parentheses"],
    answer: "Break them into smaller, named variables",
  },
  {
    question: "True or False: Python's ternary operator syntax is value1 if condition else value2.",
    options: ["True", "False"],
    answer: "True",
  },
];
// Level 4 questions (loops)
const level4Questions = [
  { type: "True/False", question: "The break statement exits the entire loop immediately", options: ["True", "False"], answer: 0 },
  { type: "MCQ", question: "Which loop is used when you know how many times you want to repeat?", options: ["for loop", "while loop", "both for and while", "none of the above"], answer: 0 },
  { type: "True/False", question: "The range(5) function generates numbers from 1 to 5", options: ["True", "False"], answer: 1 },
  { type: "MCQ", question: "What does the continue statement do in a loop?", options: ["Skips to the next iteration", "Exits the loop", "Restarts the loop", "Pauses the loop"], answer: 0 },
  { type: "True/False", question: "List comprehensions are generally faster than equivalent for loops", options: ["True", "False"], answer: 0 },
  { type: "MCQ", question: "Which range() call generates numbers 2, 4, 6, 8?", options: ["range(2, 10, 2)", "range(2, 8, 2)", "range(2, 9, 2)", "range(1, 10, 2)"], answer: 0 },
  { type: "Fill in the Blank", question: "The ______ loop repeats as long as a condition is true", options: ["while", "for", "do-while", "repeat"], answer: 0 },
  { type: "True/False", question: "The else clause in a loop executes only if the loop completes normally (no break)", options: ["True", "False"], answer: 0 },
  { type: "MCQ", question: "What is the output of range(3)?", options: ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "0, 1, 2"], answer: 3 },
  { type: "True/False", question: "Nested loops can significantly increase the number of iterations", options: ["True", "False"], answer: 0 },
  { type: "MCQ", question: "Which pattern builds up a value through iteration?", options: ["Accumulator pattern", "Search pattern", "Counting pattern", "Filter pattern"], answer: 0 },
  { type: "True/False", question: "The pass statement does nothing and is used as a placeholder", options: ["True", "False"], answer: 0 },
  { type: "MCQ", question: "What does this list comprehension create: [x*2 for x in range(1,4)]?", options: ["[2, 4, 6]", "[1, 2, 3]", "[2, 4, 6, 8]", "[1, 4, 9]"], answer: 0 },
  { type: "Fill in the Blank", question: "A loop inside another loop is called a ______ loop", options: ["nested", "inner", "child", "sub"], answer: 0 },
  { type: "True/False", question: "while loops are generally used when you don't know how many iterations you need", options: ["True", "False"], answer: 0 },
  { type: "MCQ", question: "Which statement immediately exits a loop?", options: ["break", "continue", "pass", "exit"], answer: 0 },
  { type: "True/False", question: "List comprehensions can include conditional statements", options: ["True", "False"], answer: 0 },
  { type: "MCQ", question: "What is the main advantage of using loops?", options: ["Reduces code duplication", "Makes code slower", "Increases file size", "Requires more memory"], answer: 0 },
  { type: "Fill in the Blank", question: "The range() function is ______ efficient for large ranges", options: ["memory", "time", "CPU", "storage"], answer: 0 },
  { type: "MCQ", question: "Which loop control statement skips the current iteration?", options: ["continue", "break", "pass", "skip"], answer: 0 },
];

// Add level 4 to questionsByLevel
export const questionsByLevel = {
  1: level1Questions,
  2: level2Questions,
  3: level3Questions,
  4: level4Questions,
};

// Random question picker (max 15 questions)
export const getRandomQuestions = (level) => {
  const pool = questionsByLevel[level] || [];
  const n = Math.min(pool.length, 10 + Math.floor(Math.random() * 6)); // 10-15 questions
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};
