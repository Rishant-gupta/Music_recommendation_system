# ML Backend: Development Journey & Final Models

**[➡️ View the Live Deployed App Here ⬅️](https://music-system-pgz2.vercel.app/)**

This `README` documents the complete development process for the machine learning backend, from initial data exploration and model experimentation to the final, scalable solutions.

My work focused on two main tasks:
1.  **A Song Popularity Predictor**
2.  **A Content-Based Song Recommender**

---

## 🗂️ Project Structure

To create a clean and professional project, the `ml_backend` folder has been reorganized:

* `/notebooks`: Contains all Jupyter Notebooks for exploration, experimentation, and final models.
* `/data`: Contains raw and processed data. (This is ignored by `.gitignore` and not pushed to the repository).
* `/models`: Contains the final, saved model file (`popularity_model.pkl`). (Also ignored by `.gitignore`).

---

## 1. 📈 The Popularity Predictor (Random Forest)

This was my primary learning and development task. The goal was to predict a song's popularity from its audio features. My journey here was about learning to identify "bad" data and unrealistic results.

### Step 1: Initial (Flawed) Experiments & Learning
* **File:** `notebooks/random_forest_updated.ipynb`
* **Context:** I began with the first dataset (114k rows, 114 genres). My goal was to learn and apply a Random Forest.
* **My process:**
    * I found that basic model training was very slow (10+ minutes) due to the huge dataset.
    * My first models gave me **suspiciously high accuracy (92-93%)**, while simpler models (like Logistic Regression) were much lower (85%).
    * I experimented with `GridSearchCV` (slow) and `RandomizedSearchCV` (faster, 20 mins) to tune the model.
* **The Problem:** The 93% accuracy was a "bug." It was *too* good. I analyzed this and realized it was due to uncleaned data, specifically the **114 un-mapped genres** which were likely causing data leakage or confusion.

### Step 2: The Final, Corrected Model
* **File:** `notebooks/populrty_pred_mod.ipynb`
* **Context:** This notebook uses the *final, cleaned* data: the 114 genres were mapped to 11, and the 5 PCA features were finalized.
* **My process:**
    1.  I re-applied my Random Forest model to this *correct* data.
    2.  I used `RandomizedSearchCV` to find the best parameters, which is the correct, efficient method for a large dataset.
    3.  This resulted in a much more **realistic and trustworthy accuracy of 61.88%**.
    4.  I also analyzed the **feature importances**  to see which audio features mattered most.
    5.  The final, trained model was saved to `models/popularity_model.pkl` so it can be loaded instantly.

---

## 2. 🎵 The Song Recommender (Cosine vs. KNN)

*(The link is now at the top of the README)*

My second task was to build a song recommender. This became a story of hitting a hard technical limit and engineering a more advanced solution.

### Step 1: The Initial Experiment (Cosine Similarity)
* **File:** `notebooks/recmdr_cosine.ipynb`
* **Goal:** My first approach was to use `cosine_similarity`. The plan was to build a complete similarity matrix comparing every song to every other song.
* **The Problem:** This experiment **failed with a memory error**. With over 81,000 songs, the matrix size would be $81,343 \times 81,343$, creating **over 6.6 billion values**. 
* **The Result:** This calculation required far too much memory (over 50GB) and consistently crashed the session.
* **Lesson Learned:** I proved that this $O(n^2)$ approach is not a scalable solution for real-world datasets of this size.

### Step 2: The Scalable Solution (K-Nearest Neighbors)
* **File:** `notebooks/recmdr_knn.ipynb`
* **Goal:** To solve the memory crash, I re-implemented the recommender using `NearestNeighbors` (KNN).
* **How it Works:** Instead of building the giant matrix, KNN builds an efficient index  of the song features. When we ask for recommendations, it just queries this index to find the "closest" points.
* **The Result:** This model is **fast, uses almost no RAM**, and successfully generates recommendations from the full dataset. This is the final, working solution.


Music_recommendation_system-task_begin_2/

├── .gitignore              

├── README.md               

|

│

├── notebooks/              

│   ├── music_EDA.ipynb

│   ├── mapping_genre.ipynb

│   ├── populrity_pred_mod.ipynb

│   ├── recmdr_cosine.ipynb

│   ├── recmdr_knn.ipynb

│   └── random_forest_updated.ipynb

│

├── data/                   

│   ├── dataset.csv

│   └── processed_data.txt

│

├── models/                

│   └── popularity_model.pkl

│

└── main.ipynb
