
import pandas as pd
import csv

f = open("data/boeing_news", "r")
f = f.read()
f = f.lower()

from utils import get_word_embedding, get_sentence_embedding, cosine_similarity
from nltk.corpus import stopwords
from nltk import word_tokenize

stop_words = set(stopwords.words('english')) 
from nltk.stem.wordnet import WordNetLemmatizer
stop_words.add('&')

embedding_file = 'glove.6B.300d.txt'
embedding_path = 'data/embeddings/' + embedding_file

embeddings = pd.read_csv(embedding_path, sep=" ", index_col=0, header=None, quoting=csv.QUOTE_NONE)

Lem = WordNetLemmatizer()

f = [Lem.lemmatize(w) for w in word_tokenize(f) if (w not in stop_words) & (len(w) > 2) ]
news_vocabulary = set(f)

import pickle
import numpy as np
data = pickle.load(open('data/clean_data','rb'))

#boeing_descr = data[data['Name'] == 'the boeing company']['Description'].values

data['News'] = pd.Series(dtype=object)
filler = np.empty(1,dtype=np.object)
filler[0] = f
data.at[data.loc[data['Name'] == 'the boeing company'].index,'News'] = filler

news_embedding = {k:get_sentence_embedding(k, embeddings, stop_words) for k in news_vocabulary}
news_embedding = pd.DataFrame(news_embedding).T

pickle.dump(data,open('data/clean_data','wb'),pickle.HIGHEST_PROTOCOL)
pickle.dump(news_embedding,open('data/news_embedding_' + embedding_file[:-4], 'wb'),pickle.HIGHEST_PROTOCOL)