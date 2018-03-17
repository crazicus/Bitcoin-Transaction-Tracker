# Bitcoin-Transaction-Tracker
Built during HackEmory's "Hacking on Blockchain" Event held on February 24th, 2018, in about ~2 hours.

A simple python web scraper that finds the most recent unconfirmed Bitcoin transactions from https://blockchain.info. 
BeautifulSoup is used to clean the data gathered from the website, then converting the relevant information into a string. 
Data is scraped every 5 seconds so as not to repeat transactions or miss large blocks of data.
Script terminates after 30 seconds.
