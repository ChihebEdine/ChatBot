
#This bit is used to process and pickle the raw excel file
"""
import pandas as pd
df = pd.read_excel('data/extended_company_data.xls')
df = df.drop(columns=['Ticker CIQ','Ticker BBG','GICS'])
df['Geography'] = df['Geography'].replace('3.CommonWealth',None)
df['Geography'] = df['Geography'].replace('A.Europe','europe')
df['Geography'] = df['Geography'].replace('B.United States','north america')
df['Geography'] = df['Geography'].replace('H.Mainland China','asia')
df['Geography'] = df['Geography'].replace('E.Asia','asia')
df['Geography'] = df['Geography'].replace('D.Japan','asia')
df['Geography'] = df['Geography'].replace('C.CommonWealth',None)
df['Geography'] = df['Geography'].replace('J.Emerging Markets',None)
df['Geography'] = df['Geography'].replace('K.Frontier Markets',None)
df['Geography'] = df['Geography'].replace('G.India','asia')
df['Geography'] = df['Geography'].replace('I.South America','south america')
df['Geography'] = df['Geography'].replace('F.Eastern Europe','europe')
df = df.rename(columns={'Geography':'Region'})

import pickle
pickle.dump(df,open('data/raw_data','wb'),pickle.HIGHEST_PROTOCOL)
"""
#Now process data

import pandas as pd
import pickle
import csv
from utils import get_word_embedding, get_sentence_embedding, cosine_similarity
from nltk.stem.wordnet import WordNetLemmatizer

embedding_file = 'glove.6B.300d.txt'
embedding_path = 'data/embeddings/' + embedding_file

embeddings = pd.read_csv(embedding_path, sep=" ", index_col=0, header=None, quoting=csv.QUOTE_NONE)

from nltk.corpus import stopwords
from nltk import word_tokenize

stop_words = set(stopwords.words('english')) 
stop_words.add('&')

data = pd.read_pickle("data/raw_data")
# Format data in lowercase
for c in data.columns:
    if data[c].dtype != float:
        data[c] = data[c].str.lower()

# First sort out small annoyances relating to country names
data['Country'] = data['Country'].replace('united states', 'usa')
data['Country'] = data['Country'].replace('united kingdom', 'uk')

#Tokenize and Lemmatize
Lem = WordNetLemmatizer()
data.Description = data.Description.apply(
lambda x: [Lem.lemmatize(w.lower()) for w in word_tokenize(x) if (
    w.lower() not in stop_words) & (len(w.lower()) > 1) ]
)
description_vocabulary = set(data.Description.sum())

#Find average embeddings corresponding to "big" and "small" categories, to be used in feature embeddings
embed_big = embeddings.loc[['big', 'large', 'huge', 'tall']].mean()
embed_small = embeddings.loc[['small', 'tiny', 'little']].mean()
embed_sizes = pd.DataFrame([embed_big,embed_small])
embed_sizes.rename(index={0:'big'},inplace=True)
embed_sizes.rename(index={1:'small'},inplace=True)

#Produce all embeddings for features and descriptions
feature_embedding = {}
feature_embedding['Market Cap'] = embed_sizes
feature_embedding['Region'] = {k:get_sentence_embedding(k, embeddings, stop_words) for k in data.Region.values}
feature_embedding['Region'] = pd.DataFrame(feature_embedding['Region']).T
feature_embedding['Region'] = feature_embedding['Region'].dropna()
feature_embedding['Country'] = {k:get_sentence_embedding(k, embeddings, stop_words) for k in data.Country.values}
feature_embedding['Country'] = pd.DataFrame(feature_embedding['Country']).T
feature_embedding['Industry Group'] = {k: get_sentence_embedding(k, embeddings, stop_words) for k in data['Industry Group'].values }
feature_embedding['Industry Group'] = pd.DataFrame(feature_embedding['Industry Group']).T
feature_embedding['Cluster'] = {k: get_sentence_embedding(k, embeddings, stop_words) for k in data['Cluster'].values }
feature_embedding['Cluster'] = pd.DataFrame(feature_embedding['Cluster']).T
feature_embedding['Cluster'] = feature_embedding['Cluster'].dropna()
description_embedding = {k:get_sentence_embedding(k, embeddings, stop_words) for k in description_vocabulary}
description_embedding = pd.DataFrame(description_embedding).T

pickle.dump(data,open('data/clean_data','wb'),pickle.HIGHEST_PROTOCOL)
pickle.dump(feature_embedding,open('data/feature_embedding_' + embedding_file[:-4], 'wb'),pickle.HIGHEST_PROTOCOL)
pickle.dump(description_embedding,open('data/description_embedding_' + embedding_file[:-4], 'wb'),pickle.HIGHEST_PROTOCOL)
