"""
This is a setup.py script generated by py2applet

Usage:
    python setup.py py2app
"""

from setuptools import setup

APP = ['AutoSearcher.py']
DATA_FILES = []
OPTIONS = {
    'argv_emulation': True,
    'iconfile':'icon.icns',
    'includes': ['selenium'],
    'plist': {
        'PyRuntimeLocations': [
        '/Users/aljones/anaconda3/lib/libpython3.7m.dylib'
        ],
        'iconfile': '/Users/aljones/ITP/Year2/2Semester/Thesis/hawking/auto_searcher/icon.icns'
}}

setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
)
