## import google api modules
from __future__ import print_function
from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
# scraping modules
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import random
import time
import subprocess
import operator
# image to text modules
import io
import requests
import pytesseract
from PIL import Image
# import the custom markov chain model and corpus
import custom_markov as cmarkov
total_daesien = open('text_corpuses/totaldeasiean.txt', encoding='utf8').read()
corpus = total_daesien.split()
# import reaction modules
from reactionrnn import reactionrnn
react = reactionrnn()

# import google slides login
import json

with open('creds.json', 'r') as infile:
    creds = json.load(infile)

# important variables
n_slides = 11
chain_length = 32

options = webdriver.ChromeOptions()
options.add_argument("--start-fullscreen")
# print(driver.get_window_size())
# driver.max_window_size()
# print(driver.get_window_size())
# driver.get('https://slideshare.net')
# driver.execute_script('''document.querySelector('#nav-search-query').value='AI';''')

music_driver = webdriver.Chrome()
driver = webdriver.Chrome(chrome_options=options)
music_driver.get('https://www.youtube.com/watch?v=xeEKETt9MTU')

## the two driver functions, slidepull and login
# slidepull downloads popular slides from slideshare
# login logs into google slides and opens up a blank slidedeck, returning the slidedeck ID


def slidepull(iteration):
    iter = str(iteration)
    driver.get('https://slideshare.net/explore')
    topics = driver.find_elements_by_css_selector(".title-link")
    random.choice(topics).click()
    time.sleep(.5)

    decks = driver.find_elements_by_css_selector(".link-bg-img")
    random.choice(decks).click()
    time.sleep(.5)
    try:
        driver.find_element_by_css_selector('.fa-caret-down').click()
    except:
        pass


    try:
        if iteration == 0:
            slide = driver.find_element_by_css_selector(".slide_image")
        else:
            clips = driver.execute_script('''return slideshare_object.slideshow.clip_counts ;''')
            clips.pop('1')
            top_clip = max(clips.items(), key=operator.itemgetter(1))[0]

            slides = driver.find_elements_by_css_selector(".slide_image")
            top_clip = int(top_clip)
            top_clip_position = top_clip - 1

            slide = slides[top_clip_position]
            try:
                for i in range(0, top_clip_position):
                    time.sleep(.1)
                    driver.find_element_by_css_selector(".j-next-btn").click()
            except Exception as e:
                # print(e)
                pass

        slide_url = slide.get_attribute('data-full')
        description = driver.find_element_by_css_selector('#slideshow-description-paragraph').text
        # subprocess.call(["wget",slide_url,"-O","slides/slide"+iter+".jpg"])
        slide_info = []
        slide_info.append(slide_url)
        slide_info.append(description)
        return(slide_info)
    except Exception as e:
        # print(e)
        pass



def login():
    driver.get('https://docs.google.com/presentation/')
    time.sleep(1.9)
    driver.find_element_by_name('identifier').send_keys(creds['email_username'])
    time.sleep(1)
    driver.find_element_by_css_selector('#identifierNext').click()
    time.sleep(1.2)
    driver.find_element_by_name('password').send_keys(creds['email_password'])
    time.sleep(1)
    driver.find_element_by_name('password').send_keys(Keys.RETURN)
    time.sleep(3)
    driver.find_element_by_css_selector('.docs-homescreen-templates-templateview-preview').click()
    project_id = driver.current_url.split('/')[5]
    return project_id


# little functions

def text_read(slide_location):
    response = requests.get(slide_location)
    img = Image.open(io.BytesIO(response.content))
    text = pytesseract.image_to_string(img)
    return(text)

# reaction_possibilities = ['love','angry','sad','haha']
love_reacts = ['lean forward in your seats and murmur approvingly','sit on the edge of your seat. nod. this is the best talk you have ever been to']
angry_reacts = ['that does not seem right. furrow your brows in consternation', 'the speaker has to be wrong about this. sit up and glower']
sad_reacts = ['uh oh, you would rather not be thinking about this right now. your phone gets heavy in your pocket. take it out and check it']
haha_reacts = ['wow that was funny. laugh','laugh, let out a few woops', 'chuckle approvingly']
wow_reacts = ['your mind has just been blown. clap enthusiastically', 'wow. incredible. raise your eyebrows','that cannot be right. that is amazing. shuffle in your seat']
# the_reactions = [love_reacts,angry_reacts,sad_reacts,haha_reacts]

reaction_possibilities = {
    'love':love_reacts,
    'angry':angry_reacts,
    'sad':sad_reacts,
    'haha':haha_reacts,
    'wow':wow_reacts
}

def get_reaction(statement):
    reaction = react.predict(statement)
    likely_reaction = max(reaction.items(), key=operator.itemgetter(1))[0]
    the_reaction = random.choice(reaction_possibilities[likely_reaction])
    # for i in len(reaction_possibilities):
    #     if likely_reaction == reaction_possibilities[i]:
    #         the_reaction = random.choice(the_reactions[i])
    #     else:
    #         pass
    return(the_reaction)
## driver behavior

#scraping
slide_urls = []
slides_content = []

# for i in range(0,16):
#     the_slide = slidepull(i)
#     print(the_slide)
#     if the_slide == None:
#         pass
#     else:
#         the_slide_url = the_slide[0]
#         the_slide_description = the_slide[1]
#         slide_urls.append(the_slide_url)
#         slides_content.append(the_slide_description)
#         corpus.extend(the_slide_description.split())
#         # slide_text = text_read(the_slide)
#         # print(slide_text)
#         # slides_content.append(slide_text)
#         # corpus.extend(slide_text.split())


the_iterator = 0
while len(slide_urls) < n_slides:
    the_slide = slidepull(the_iterator)
    print(the_slide)
    if the_slide == None:
        pass
    else:
        the_iterator = the_iterator + 1
        the_slide_url = the_slide[0]
        the_slide_description = the_slide[1]
        slide_urls.append(the_slide_url)
        slides_content.append(the_slide_description)
        corpus.extend(the_slide_description.split())
        # slide_text = text_read(the_slide)
        # print(slide_text)
        # slides_content.append(slide_text)
        # corpus.extend(slide_text.split())

speaker_notes = []
for i in range(len(slides_content)):
    slide_notes = cmarkov.one_word_markov_slide_seed(corpus,chain_length," ".join(slides_content[i].split()[:7]))
    print(slide_notes)
    slide_notes = slide_notes + '\n\n' + get_reaction(slide_notes)
    print(slide_notes)
    speaker_notes.append(slide_notes)

login()

project_id = driver.current_url.split('/')[5]
first_slide_id = driver.current_url.split('/')[6].split('.')[1]

## Setup the Slides API
SCOPES = 'https://www.googleapis.com/auth/presentations'
store = file.Storage('credentials.json')
creds = store.get()
if not creds or creds.invalid:
    flow = client.flow_from_clientsecrets('client_secret.json', SCOPES)
    creds = tools.run_flow(flow, store)
service = build('slides', 'v1', http=creds.authorize(Http()))

# login to google slides and call the Slides API
PRESENTATION_ID = project_id


#functions for calling on the api
def deck_populate(slide_ID, iteration):
    requests = [
        {
            'createSlide': {
                'objectId': slide_ID,
                'insertionIndex': '1'
            }
        }
    ]

    body = {
        'requests': requests
    }

    response = service.presentations().batchUpdate(presentationId=PRESENTATION_ID,
                                                          body=body).execute()
    create_slide_response = response.get('replies')[0].get('createSlide')
    print('Created slide with ID: {0}'.format(create_slide_response.get('objectId')))

    requests = [
        {
            "updatePageProperties": {
                "objectId": slide_ID,
                "pageProperties": {
                    "pageBackgroundFill": {
                        "stretchedPictureFill": {
                        "contentUrl": slide_urls[len(slide_urls)-1-iteration]
                        }
                    }
                },
                "fields": "pageBackgroundFill"
            }
        }
    ]

    body = {
        'requests': requests
    }


    response = service.presentations().batchUpdate(presentationId=PRESENTATION_ID,
                                                          body=body).execute()

def change_title():
    requests = [
        {
            "insertText": {
                "objectId": title_id,
                "text": "WELCOME TO",
                "insertionIndex": 0
            }
        }
     ]

    body = {
            'requests': requests
    }

    response = service.presentations().batchUpdate(presentationId=PRESENTATION_ID,
                                                          body=body).execute()

    time.sleep(4)
    requests = [
        {
            "insertText": {
                "objectId": subtitle_id,
                "text": "GOOD CONFERENCE TALK",
                "insertionIndex": 0
            }
        }
     ]

    body = {
            'requests': requests
    }

    response = service.presentations().batchUpdate(presentationId=PRESENTATION_ID,
                                                          body=body).execute()

def notes_update(the_slides, iteration):
    notes_id = the_slides[iteration].get('slideProperties')['notesPage']['notesProperties']['speakerNotesObjectId']
    print(notes_id)
    requests = [
        {
            "insertText": {
                "objectId": notes_id,
                "text": speaker_notes[iteration-1]}
        }
     ]

    body = {
            'requests': requests
    }
    response = service.presentations().batchUpdate(presentationId=PRESENTATION_ID,
                                                          body=body).execute()

def last_slide(slide_ID):
    requests = [
        {
            'createSlide': {
                'objectId': slide_ID,
                'insertionIndex': '12',
                "slideLayoutReference": {
                    "predefinedLayout": "SECTION_TITLE_AND_DESCRIPTION"
        }
            }
        }
    ]

    body = {
        'requests': requests
    }

    response = service.presentations().batchUpdate(presentationId=PRESENTATION_ID,
                                                          body=body).execute()
    create_slide_response = response.get('replies')[0].get('createSlide')
    print('Created slide with ID: {0}'.format(create_slide_response.get('objectId')))



def change_final_slide():
    presentation = service.presentations().get(presentationId=PRESENTATION_ID).execute()
    slides = presentation.get('slides')
    last_title_id = slides[n_slides+1].get('pageElements')[0]['objectId']
    last_subtitle_id = slides[n_slides+1].get('pageElements')[1]['objectId']
    last_details_id = slides[n_slides+1].get('pageElements')[2]['objectId']
    requests = [
        {
            "insertText": {
                "objectId": last_title_id,
                "text": "THANK YOU",
                "insertionIndex": 0
            }
        }
     ]

    body = {
            'requests': requests
    }

    response = service.presentations().batchUpdate(presentationId=PRESENTATION_ID,
                                                          body=body).execute()
    requests = [
        {
            "insertText": {
                "objectId": last_details_id,
                "text": "Twitter: @miamiworldwide\nGithub: miamiww\nwww.alden.website",
                "insertionIndex": 0
            }
        }
     ]
    body = {
            'requests': requests
    }

    response = service.presentations().batchUpdate(presentationId=PRESENTATION_ID,
                                                          body=body).execute()



# call the api functions to create the slidedeck
for i in range(0, len(slide_urls)):
    unique_id = random.randint(1000,10000000000000000000000)
    unique_id = str(unique_id)
    deck_populate(unique_id,i)

presentation = service.presentations().get(presentationId=PRESENTATION_ID).execute()
slides = presentation.get('slides')
print(len(slides))
title_id = slides[0].get('pageElements')[0]['objectId']
subtitle_id = slides[0].get('pageElements')[1]['objectId']

for i in range(len(slides)):
    if i == 0:
        pass
    else:
        notes_update(slides, i)

unique_id = random.randint(1000,10000000000000000000000)
unique_id = str(unique_id)
last_slide(unique_id)
change_final_slide()

change_title()
time.sleep(1)


driver.find_element_by_css_selector("#punch-start-presentation-left").click()
# music_driver.execute_script('''document.getElementsByTagName('video')[0].volume=0.1 ;''')

volume_down = """
return (function(v) {
document.getElementsByTagName('video')[0].volume=v;
})(arguments[0]);
"""

for i in range(0,10):
    vol = 1-i/10
    time.sleep(.6)
    music_driver.execute_script(volume_down,vol)

time.sleep(3)
music_driver.quit()


# driver.quit()



    # clips = driver.find_elements_by_css_selector(".clipping-indicator")
    # if len(clips)>0:
    #     random.choice(clips).click()
    #     time.sleep(4)
    #     slide = driver.find_elements_by_css_selector(".slide_image")[1]
