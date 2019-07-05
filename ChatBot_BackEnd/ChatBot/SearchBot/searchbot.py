#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ted on Thu Jan  3 2019

@author: maxime
"""
import random
import time
import pickle

import pandas as pd
import numpy as np
import csv

from utils import get_word_embedding, get_sentence_embedding, cosine_similarity
import fileinput

from nltk.corpus import stopwords
from nltk import word_tokenize

stop_words = set(stopwords.words('english')) 

class Searchbot:

    def __init__(self, embedding_file='glove.6B.300d.txt'):

        self.stop_words = set(stopwords.words('english')) 

        self.embeddings = pd.read_csv('data/embeddings/'+ embedding_file, sep=" ", index_col=0, header=None, quoting=csv.QUOTE_NONE)
        self.data = pickle.load(open('data/clean_data','rb'))
        self.feature_embedding = pickle.load(open('data/feature_embedding_' + embedding_file[:-4],'rb'))
        self.description_embedding = pickle.load(open('data/description_embedding_' + embedding_file[:-4],'rb'))
        self.news_embedding = pickle.load(open('data/news_embedding_' + embedding_file[:-4],'rb'))

        self.market_cap_mean = self.data['Market Cap'].mean()

        self.responses = {'Market Cap': [], 'Region': [], 'Country': [], 'Industry Group':[], 'Cluster':[], 'Description':[]}
        self.inferred_responses = {'Market Cap': [], 'Region': [], 'Country': [], 'Industry Group':[], 'Cluster':[], 'Description':[]}
        self.name_state = ['Market Cap', 'Region', 'Country', 'Industry Group', 'Cluster', 'Description']

        self.done = False
        self.relevant_companies = self.data.copy()
        self.relevant_companies['Relevance'] = 0

        self.best_keywords = []

    def start(self):

        self.reset()

        print("Welcome to Unchartech Searchbot! What type of company are you looking for?")

        action = 0
        while not self.done:
            user_input = input()
            action, self.done = self.act(action,user_input)

    def act(self, action, user_input):

        if action == 0:

            self.encode_response(user_input)

            inferred_embeddings = pd.Series(self.inferred_responses['Description']).apply(lambda x: get_sentence_embedding(x, self.embeddings, self.stop_words))
            inferred_embeddings = pd.DataFrame(np.matrix(inferred_embeddings.tolist()))
            score = pd.Series(np.zeros(len(inferred_embeddings)))
            for w in self.responses['Description']:
                word_embedding = get_sentence_embedding(w, self.embeddings, self.stop_words)
                if np.array_equal(word_embedding,np.zeros(self.embeddings.shape[1])):
                    self.best_keywords += [w]
                else:
                    score += cosine_similarity(inferred_embeddings, word_embedding)

            best = score.values.argsort()[-10:]
            if self.inferred_responses['Description']:
                self.best_keywords += list(pd.Series(self.inferred_responses['Description']).loc[best].drop_duplicates().values)

            print('Press 1 to reset and 0 to see the most relevant companies I have found. I have found companies related to '\
                 + str(self.best_keywords) + '. Which keywords would you like to restrict your search to?')    

            return 1, False

        elif action == 1:

            if user_input == '1':   

                print("Resetting...")
                return 0, True

            elif user_input == '0': 

                print(self.relevant_companies[['Name','Relevance']].head(20))
                print('I have found companies related to ' + str(self.best_keywords.values) + '? Which keywords would you like to restrict your search to?')

                return 1, False

            else:

                words = user_input.lower().split(',')

                self.relevant_companies['Relevance'] += 5*self.relevant_companies['Description'].apply(lambda x: self.is_in_description(x, words))
                self.relevant_companies['Relevance'] += 5*self.relevant_companies['News'].apply(lambda x: self.is_in_news(x, words))
                self.relevant_companies = self.relevant_companies.sort_values('Relevance', ascending=False)

                most_relevant = self.relevant_companies[self.relevant_companies['Relevance'] > 0]
                most_relevant = most_relevant[most_relevant['Relevance'] > most_relevant['Relevance'].quantile(0.9)]
                best_sectors = most_relevant['Cluster'].value_counts()[:10]

                print("Great! I have found companies that work in the following sectors " + str(best_sectors.keys().values) \
                    + ". Which sectors would you like to restrict your search to? Alternatively, you can press 1 to reset or 0 to see the most relevant companies.")

                return 2, False

        elif action == 2:

            if user_input == '1':   

                print("Resetting...")
                return 0, True

            elif user_input == '0': 

                print(self.relevant_companies[['Name','Relevance']].head(20))

                most_relevant = self.relevant_companies[self.relevant_companies['Relevance'] > 0]
                most_relevant = most_relevant[most_relevant['Relevance'] > most_relevant['Relevance'].quantile(0.9)]
                best_sectors = most_relevant['Cluster'].value_counts()[:10]

                print("Great! The most relevant companies work in the following sectors" + str(best_sectors.keys().values) \
                    + ". Which sectors would you like to restrict your search to? Alternatively, you can press 1 to reset or 0 to see the most relevant companies.")

                return 2, False

            else:

                words = user_input.lower().split(',')
                for w in words:
                    word_embedding = get_sentence_embedding(w, self.embeddings, self.stop_words)
                    score_category = cosine_similarity(self.feature_embedding['Cluster'], word_embedding)
                    target_cluster = score_category.sort_values(ascending=False).keys()[0]
                    self.relevant_companies['Relevance'] += np.where(self.relevant_companies['Cluster'] == target_cluster, 10, 0)
                
                self.relevant_companies = self.relevant_companies.sort_values('Relevance', ascending=False)

                if not self.inferred_responses['Country'] and not self.inferred_responses['Region']:

                    print('Could you tell me more about the country or region the company is listed in, and/or give me more keywords?' \
                        + ' Alternatively, you can press 1 to reset or 0 to see the most relevant companies.')
                        
                else:

                    print("Would you like to give me some more keywords relating to the sectors you chose? Alternatively, you can press 1 to reset or 0 to see the most relevant companies.")

            return 3, False

        elif action == 3:

            if user_input == '1':   

                print("Resetting...")
                return 0, True

            elif user_input == '0': 

                print(self.relevant_companies[['Name','Relevance']].head(20))

                if not self.inferred_responses['Country']:

                    print('Could you tell me more about the country or region the company is listed in, and/or give me more keywords?' \
                        + 'Alternatively, you can press 1 to reset or 0 to see the most relevant companies.')
                        
                else:

                    print("Would you like to give me some more keywords relating to the sectors you chose? Alternatively, you can press 1 to reset or 0 to see the most relevant companies.")

                return 3, False

            else:

                if user_input is not '':
                    self.encode_response(user_input)

                print('The most relevant companies are: ' + str(self.relevant_companies[['Name','Relevance']].head(20)))

                return 0, True


    def encode_response(self, user_input, thresholds=[0.8,0.8,0.8,0.5,0.5], relative_thresholds=[0.99,0.99,0.9,0.6,0.6], gain=1):
        """
        Converts user's response to a list of relevant 
        fields and keywords, and use them to calculate a relevance score
        """
            
        words = user_input.lower().split(',')
        keyword_list = []

        for w in words:

            word_embedding = get_sentence_embedding(w, self.embeddings, self.stop_words)
            scores=[]
            features=[]
            for k,v in self.feature_embedding.items():
                current_score = cosine_similarity(v, word_embedding)
                scores.append(np.max(current_score))
            
            if scores[0] > thresholds[0]:
                features.append(self.name_state[0])
            elif scores[1] > thresholds[1] or scores[2] > thresholds[2]:
                if scores[1] > thresholds[1]:
                        features.append('Region')
                if scores[2] > thresholds[2]:
                        features.append('Country')
            else:
                for idx in range(len(scores)):
                    if scores[idx] > thresholds[idx]:
                        features.append(self.name_state[idx])
                        
            for feature in features:
                score_category = cosine_similarity(self.feature_embedding[feature], word_embedding)
                score_category = score_category.loc[score_category > thresholds[self.name_state.index(feature)]]
                category_list = list(score_category.loc[score_category > relative_thresholds[self.name_state.index(feature)]*np.max(score_category)].index)
                self.responses[feature].append(w)
                self.inferred_responses[feature] += category_list

                if feature == 'Market Cap':
                    if category_list[0] == 'big':
                        self.relevant_companies['Relevance'] += np.where(self.relevant_companies['Market Cap'] >= self.market_cap_mean, 2, -1)
                    else:
                        self.relevant_companies['Relevance'] += np.where(self.relevant_companies['Market Cap'] < self.market_cap_mean, 2, -1)

                if feature == 'Region':

                    for region in category_list:
                        self.relevant_companies['Relevance'] += np.where(self.relevant_companies['Region'] == region, 7, -2)

                if feature == 'Country':

                    for country in category_list:
                        self.relevant_companies['Relevance'] += np.where(self.relevant_companies['Country'] == country, 7, -2)

                if feature == 'Cluster' or feature == 'Industry Group':

                    for industry in category_list:
                        self.relevant_companies['Relevance'] += np.where(self.relevant_companies['Industry Group'] == industry, 3, 0)

                    for cluster in category_list:
                        self.relevant_companies['Relevance'] += np.where(self.relevant_companies['Cluster'] == cluster, 3, 0)

            if 'Region' not in features and 'Country' not in features and 'Market Cap' not in features:
                self.responses['Description'].append(w)
                description_score = cosine_similarity(self.description_embedding, word_embedding)
                news_score = cosine_similarity(self.news_embedding, word_embedding)
                category_list = list(description_score.loc[description_score > 0.5].index) + list(news_score.loc[news_score > 0.5].index)
                self.inferred_responses['Description'] += category_list
                keyword_list += category_list + [w]
                
        self.relevant_companies['Relevance'] += self.relevant_companies['Description'].apply(lambda x: self.is_in_description(x, keyword_list))
        self.relevant_companies['Relevance'] += self.relevant_companies['News'].apply(lambda x: self.is_in_news(x, keyword_list))
        self.relevant_companies = self.relevant_companies.sort_values('Relevance', ascending=False)

    def is_in_description(self, description, list_of_keywords):
        common_words = np.intersect1d(description, list_of_keywords)
        return len(common_words)

    def is_in_news(self, news, list_of_keywords):
        common_words = np.intersect1d(news, list_of_keywords)
        try:
            result = (100/len(news))*len(common_words)
        except:
            result = 0
        return result


    def reset(self):

        self.responses = {'Market Cap': [], 'Region': [], 'Country': [], 'Industry Group':[], 'Cluster':[], 'Description':[]}
        self.inferred_responses = {'Market Cap': [], 'Region': [], 'Country': [], 'Industry Group':[], 'Cluster':[], 'Description':[]}
        self.relevant_companies = self.data.copy()
        self.relevant_companies['Relevance'] = 0
        self.best_keywords = []

        self.done = False
        