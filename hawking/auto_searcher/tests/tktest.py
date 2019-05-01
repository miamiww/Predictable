from tkinter import *
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import random
from interests import *
logo="""
   ___  __  ____________                
  / _ |/ / / /_  __/ __ \               
 / __ / /_/ / / / / /_/ /               
/_/_|_\____/_/_/ _\____/_____ _________ 
  / __/ __/ _ | / _ \/ ___/ // / __/ _ \ 
 _\ \/ _// __ |/ , _/ /__/ _  / _// , _/
/___/___/_/ |_/_/|_|\___/_//_/___/_/|_| 
brought to you by Future's Market
please provide credentials for optimum performance"""

name=""
password=""
## function for our run button
def run_callback():
    global name
    name = e1.get()
    global password
    password = e2.get()
    driver_start()
    music_driver.quit()
    driver.quit()
    window.quit()

def searchers():
    while True:
        time.sleep(3)
        driver.find_element_by_name("q").send_keys(random.choice(interests_list))
        time.sleep(1.5)
        driver.find_element_by_name("q").send_keys(Keys.RETURN)
        time.sleep(.5)
        driver.find_element_by_name("q").clear()

def driver_start():
    options = webdriver.ChromeOptions()
    # options.add_argument("--start-fullscreen")
    global music_driver
    music_driver = webdriver.Chrome(chrome_options=options)
    music_driver.get("https://www.youtube.com/watch?v=1ClCpfeIELw")
    global driver
    driver = webdriver.Chrome(chrome_options=options)
    if name =="":
        driver.get('https://google.com')
        searchers()

    else:
        driver.get('https://accounts.google.com')
        time.sleep(3)
        driver.find_element_by_name("identifier").send_keys(name)
        time.sleep(1)
        driver.find_element_by_name("identifier").send_keys(Keys.RETURN)

        time.sleep(2)
        driver.find_element_by_name("password").send_keys(password)
        time.sleep(1)
        driver.find_element_by_name("password").send_keys(Keys.RETURN)
        time.sleep(1)
        driver.execute_script("alert('you have 40 seconds to complete the captcha and complete login auto searcher will continue on after 40 seconds')")
        time.sleep(40)
        driver.get('https://google.com')
        searchers()
        # driver.quit()

###############
## GUI BEGIN ##
###############

window=Tk()
window.title("Auto Searcher")
# titles
l1=Label(window, text="Google Email")
l1.grid(row=1, column=0)
l1=Label(window, text="Google Password")
l1.grid(row=2, column=0)

# text entry boxes
username_text=StringVar()
e1=Entry(window, textvariable=username_text)
e1.grid(row=1, column=1)

password_text=StringVar()
e2=Entry(window, show="*", textvariable=password_text)
e2.grid(row=2, column=1)

#logo widget
T = Text(window, height=10, width=60)
T.grid(row=0, column=0, columnspan=6)
T.configure(background="yellow", foreground="cyan")
T.insert(END,logo)

#
# list1=Listbox(window, height=6, width=35)
# list1.grid(row=2, column=0, columnspan=2)

# sb1=Scrollbar(window)
# sb1.grid(row=2, column=3)

b1=Button(window,text="Run", width=12, command=run_callback)
b1.grid(row=2, column=4)
b2=Button(window,text="Quit", width=12, command=window.quit)
b2.grid(row=1, column=4)

window.mainloop()

###############
## GUI   END ##
###############


