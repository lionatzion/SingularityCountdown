import { useQuery } from "@tanstack/react-query";
import { type NewsArticle } from "@shared/schema";

export default function NewsFeed() {
  const { data: news = [], isLoading, error } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (error) {
    return (
      <section className="glow-border rounded-xl p-6 gradient-bg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-inter font-semibold text-white">Live AI News Feed</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-jetbrains text-red-500">ERROR</span>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-light-grey/60">Failed to load news feed. Please check your connection.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="glow-border rounded-xl p-6 gradient-bg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-inter font-semibold text-white">Live AI News Feed</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full pulse-ring"></div>
          <span className="text-sm font-jetbrains text-neon-green">UPDATING</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-gray-700/50 pb-4 mb-4 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-light-grey/60">No news articles available. News will appear here once fetched.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
          {news.map((article) => (
            <article key={article.id} className="border-b border-gray-700/50 pb-4 mb-4 last:border-b-0">
              <div className="flex items-start space-x-4">
                {article.imageUrl && (
                  <img 
                    src={article.imageUrl} 
                    alt="News article" 
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-white font-inter font-medium mb-2 hover:text-tech-purple cursor-pointer">
                    {article.title}
                  </h4>
                  <p className="text-sm text-light-grey/70 mb-2 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center text-xs text-light-grey/50 space-x-4">
                    <span>{article.source}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <span className="text-neon-green">{article.category}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
