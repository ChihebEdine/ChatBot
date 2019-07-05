import numpy as np


def get_word_embedding(word, matrix_embedding, stop_words):
    if word in stop_words:
        return np.array([np.nan for i in range(matrix_embedding.shape[1])])
    else:
        try:
            return matrix_embedding.loc[word].values
        except:
            return np.array([np.nan for i in range(matrix_embedding.shape[1])])

def get_sentence_embedding(sentence, matrix_embedding, stop_words):
    if type(sentence) is not float: #This may happen if sentence is nan
        s = sentence.split(' ')
        s = [np.nan_to_num(get_word_embedding(w, matrix_embedding, stop_words), 0) for w in s]

        return np.mean(s, 0)

    else:
        return np.nan

def cosine_similarity(df, vector):
    """
    Computes cosine similarity between a dataframe and a vector
    """
    if np.square(vector).sum() == 0:
        return df.apply(lambda x:0)
    else:
        return df.dot(vector) / (np.sqrt(np.square(df).sum(axis=1)) * np.sqrt(np.square(vector).sum()))
