import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

# Load the data
file_path = 'your_file.csv'  # Update this with your CSV file path
df = pd.read_csv(file_path)

# Ensure necessary columns exist
if 'short_description' not in df.columns or 'assignment_group' not in df.columns:
    raise ValueError("CSV must contain 'short_description' and 'assignment_group' columns.")

# Preprocessing: Fill NaN values if needed
df['short_description'].fillna('', inplace=True)

# Convert text data to numerical data using TF-IDF
vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
X = vectorizer.fit_transform(df['short_description'])

# Apply KMeans clustering
num_clusters = 5  # You can tune this parameter based on your data
kmeans = KMeans(n_clusters=num_clusters, random_state=42)
df['cluster'] = kmeans.fit_predict(X)

# Optional: Reduce dimensions for visualization using PCA
pca = PCA(n_components=2)
reduced_data = pca.fit_transform(X.toarray())

# Plotting the clusters
plt.scatter(reduced_data[:, 0], reduced_data[:, 1], c=df['cluster'])
plt.title('KMeans Clustering of Short Descriptions')
plt.show()

# Save clustered results to CSV
output_file = 'clustered_data.csv'
df.to_csv(output_file, index=False)
print(f"Clustered data saved to {output_file}")