import {
  Search,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
  Book,
  Tag,
  FileText,
  Filter,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { dictionaryCommunityApi } from "../../api/system/dictionaryComunityApi";

export default function CommunityDictionary() {
  const [words, setWords] = useState([]);
  const [topWords, setTopWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(20);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all, top, search
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all words
  const fetchAllWords = async (page = 0) => {
    setLoading(true);
    try {
      const response = await dictionaryCommunityApi.getAllWords(page, pageSize);
      
      if (response.success) {
        setWords(response.data.words || []);
        setCurrentPage(response.data.currentPage || 0);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch top voted words
  const fetchTopWords = async () => {
    try {
      const response = await dictionaryCommunityApi.getTopVotedWords(10);
      
      if (response.success) {
        setTopWords(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching top words:", error);
    }
  };

  // Search words
  const handleSearch = async (keyword, page = 0) => {
    if (!keyword.trim()) {
      setActiveTab("all");
      fetchAllWords(0);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    try {
      const response = await dictionaryCommunityApi.searchWords(keyword, page, pageSize);
      
      if (response.success) {
        setWords(response.data.words || []);
        setCurrentPage(response.data.currentPage || 0);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalItems || 0);
        setActiveTab("search");
      }
    } catch (error) {
      console.error("Error searching words:", error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // View word detail
  const viewWordDetail = async (wordId) => {
    try {
      const response = await dictionaryCommunityApi.getWordDetail(wordId);
      
      if (response.success) {
        setSelectedWord(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error("Error fetching word detail:", error);
    }
  };

  // Vote for word
  const handleVote = async (wordId) => {
    try {
      const response = await dictionaryCommunityApi.voteWord(wordId);
      
      if (response.success) {
        // Update local state
        setWords(words.map(w => 
          w.rwId === wordId 
            ? { ...w, voteCount: (w.voteCount || 0) + 1 }
            : w
        ));

        // Update selected word if modal is open
        if (selectedWord && selectedWord.word.rwId === wordId) {
          setSelectedWord({
            ...selectedWord,
            word: {
              ...selectedWord.word,
              voteCount: response.data.voteCount
            },
            hasVoted: true
          });
        }

        // Refresh top words
        fetchTopWords();
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Unvote word
  const handleUnvote = async (wordId) => {
    try {
      const response = await dictionaryCommunityApi.unvoteWord(wordId);
      
      if (response.success) {
        // Update local state
        setWords(words.map(w => 
          w.rwId === wordId 
            ? { ...w, voteCount: Math.max(0, (w.voteCount || 0) - 1) }
            : w
        ));

        // Update selected word if modal is open
        if (selectedWord && selectedWord.word.rwId === wordId) {
          setSelectedWord({
            ...selectedWord,
            word: {
              ...selectedWord.word,
              voteCount: response.data.voteCount
            },
            hasVoted: false
          });
        }

        // Refresh top words
        fetchTopWords();
      }
    } catch (error) {
      console.error("Error unvoting:", error);
    }
  };

  // Pagination
  const goToPage = (page) => {
    if (activeTab === "search" && searchTerm) {
      handleSearch(searchTerm, page);
    } else {
      fetchAllWords(page);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setActiveTab("all");
    fetchAllWords(0);
  };

  useEffect(() => {
    fetchAllWords(0);
    fetchTopWords();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <Users size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3">
            Từ Điển Cộng Đồng
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Khám phá và học hỏi từ vựng tiếng Nhật từ cộng đồng
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft border border-border-light">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Book size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Tổng từ vựng</p>
                <p className="text-2xl font-bold text-text-primary">{totalItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-border-light">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Người đóng góp</p>
                <p className="text-2xl font-bold text-text-primary">
                  {new Set(words.map(w => w.customerEmail)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-border-light">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart size={24} className="text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Tổng votes</p>
                <p className="text-2xl font-bold text-text-primary">
                  {words.reduce((sum, w) => sum + (w.voteCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Words List */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-soft border border-border-light p-4 mb-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"
                    size={18}
                  />
                  <input
                    placeholder="Tìm kiếm từ vựng, nghĩa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch(searchTerm, 0)}
                    className="w-full pl-12 pr-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleSearch(searchTerm, 0)}
                  disabled={isSearching}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50"
                >
                  {isSearching ? "Đang tìm..." : "Tìm kiếm"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-soft border border-border-light mb-6 overflow-hidden">
              <div className="flex p-1 bg-background m-2 rounded-xl">
                <button
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    activeTab === "all"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "text-text-secondary hover:text-text-primary hover:bg-white"
                  }`}
                  onClick={() => {
                    setActiveTab("all");
                    clearSearch();
                  }}
                >
                  Tất cả từ
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    activeTab === "top"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "text-text-secondary hover:text-text-primary hover:bg-white"
                  }`}
                  onClick={() => {
                    setActiveTab("top");
                    setWords(topWords);
                  }}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <TrendingUp size={16} />
                    Top Vote
                  </div>
                </button>
              </div>
            </div>

            {/* Words Grid */}
            <div className="bg-white rounded-xl shadow-soft border border-border-light p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-text-secondary">Đang tải từ vựng...</p>
                </div>
              ) : words.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Book size={28} className="text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">
                    Không tìm thấy từ vựng
                  </h4>
                  <p className="text-text-secondary">
                    Thử thay đổi từ khóa tìm kiếm của bạn
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {words.map((word, index) => (
                    <div
                      key={word.rwId}
                      className="border border-border-light rounded-xl p-4 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 cursor-pointer group"
                      onClick={() => viewWordDetail(word.rwId)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className="text-xl font-bold text-text-primary group-hover:text-purple-600 transition-colors"
                              style={{
                                fontFamily:
                                  '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                              }}
                            >
                              {word.word}
                            </h3>
                            {activeTab === "top" && (
                              <Award
                                size={20}
                                className="text-yellow-500"
                              />
                            )}
                          </div>
                          <p className="text-text-secondary mb-3">{word.meaning}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-text-muted">
                              <MessageCircle size={14} />
                              {word.customerEmail?.split("@")[0]}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(word.rwId);
                              }}
                              className="flex items-center gap-1 text-pink-500 hover:text-pink-600 font-semibold transition-colors"
                            >
                              <Heart size={14} className="fill-current" />
                              {word.voteCount || 0}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && words.length > 0 && activeTab !== "top" && (
                <div className="mt-6 pt-6 border-t border-border-light">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-text-secondary">
                      Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalItems)} / {totalItems} từ
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-4 py-2 border border-border-light rounded-lg hover:bg-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <div className="flex items-center gap-2">
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                          const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                          if (pageNum >= totalPages) return null;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                                  : "border border-border-light hover:bg-background"
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="px-4 py-2 border border-border-light rounded-lg hover:bg-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Top Words */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft border border-border-light p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={20} className="text-purple-600" />
                <h2 className="text-xl font-bold text-text-primary">
                  Top Vote
                </h2>
              </div>

              <div className="space-y-3">
                {topWords.slice(0, 10).map((word, index) => (
                  <div
                    key={word.rwId}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all cursor-pointer group"
                    onClick={() => viewWordDetail(word.rwId)}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                          : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                          : index === 2
                          ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-bold text-sm text-text-primary group-hover:text-purple-600 transition-colors truncate"
                        style={{
                          fontFamily:
                            '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                        }}
                      >
                        {word.word}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">
                        {word.meaning}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs text-pink-500 font-semibold">
                          <Heart size={12} className="fill-current" />
                          {word.voteCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedWord && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2
                      className="text-3xl font-bold mb-2"
                      style={{
                        fontFamily:
                          '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                      }}
                    >
                      {selectedWord.word.word}
                    </h2>
                    <p className="text-lg opacity-90">{selectedWord.word.meaning}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                    <MessageCircle size={16} />
                    {selectedWord.word.customerEmail?.split("@")[0]}
                  </span>
                  <button
                    onClick={() => 
                      selectedWord.hasVoted 
                        ? handleUnvote(selectedWord.word.rwId)
                        : handleVote(selectedWord.word.rwId)
                    }
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedWord.hasVoted
                        ? "bg-white text-pink-500"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    <Heart 
                      size={16} 
                      className={selectedWord.hasVoted ? "fill-current" : ""} 
                    />
                    {selectedWord.word.voteCount || 0}
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Description */}
                {selectedWord.word.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-3">
                      <Sparkles size={14} />
                      Ghi chú
                    </h3>
                    <p className="text-text-primary leading-relaxed">
                      {selectedWord.word.description}
                    </p>
                  </div>
                )}

                {/* Synonyms */}
                {selectedWord.word.synonyms && selectedWord.word.synonyms.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-3">
                      <Tag size={14} />
                      Từ đồng nghĩa
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedWord.word.synonyms.map((syn, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-medium"
                          style={{
                            fontFamily:
                              '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                          }}
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                {selectedWord.word.example && selectedWord.word.example.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-3">
                      <FileText size={14} />
                      Ví dụ
                    </h3>
                    <div className="space-y-3">
                      {selectedWord.word.example.map((ex, idx) => (
                        <div
                          key={idx}
                          className="pl-4 border-l-4 border-purple-300 py-2"
                        >
                          <p
                            className="text-text-primary"
                            style={{
                              fontFamily:
                                '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                            }}
                          >
                            {idx + 1}. {ex}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}