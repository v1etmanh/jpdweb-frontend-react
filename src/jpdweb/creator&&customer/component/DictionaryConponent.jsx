import {
  Plus,
  Book,
  Search,
  RefreshCw,
  AlertTriangle,
  X,
  Sparkles,
  MoreVertical,
  Tag,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { rememberWordApi } from "../../api/system/rememberApi";

export default function DirectComponent() {
  const [display, setDisplay] = useState(false);
  const [meaning, setMeaning] = useState("");
  const [description, setDescription] = useState("");
  const [word, setWord] = useState("");
  const [synonyms, setSynonyms] = useState([]);
  const [synonymInput, setSynonymInput] = useState("");
  const [examples, setExamples] = useState([]);
  const [exampleInput, setExampleInput] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [myWords, setMyWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // API functions
  const addNewWord = async (payload) => {
    try {
      const response = await rememberWordApi.createNew(payload);

      if (response.success) {
        const newWord = {
          rwId: response.data?.rwId || Date.now(),
          ...payload,
        };
        setMyWords((prevWords) => [...prevWords, newWord]);

        showAlertMessage("Thêm từ thành công!", "success");

        // Reset form
        setWord("");
        setMeaning("");
        setDescription("");
        setSynonyms([]);
        setExamples([]);
        setSynonymInput("");
        setExampleInput("");
        setDisplay(false);

        return response;
      } else {
        showAlertMessage(response.message || "Thêm từ thất bại!", "error");
        return response;
      }
    } catch (error) {
      console.error("Error adding word:", error);
      showAlertMessage("Lỗi khi thêm từ!", "error");
      throw error;
    }
  };

  const deleteWords = async (id) => {
    try {
      const response = await rememberWordApi.deleteWord(id);
      return response;
    } catch (error) {
      console.error("Error deleting word:", error);
      return { success: false, status: 500 };
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteWords(id);

      if (response.success || response.status === 204) {
        setMyWords((prevWords) => prevWords.filter((word) => word.rwId !== id));
        showAlertMessage("Xóa từ thành công!", "success");
      } else if (response.status === 404) {
        showAlertMessage("Không tìm thấy từ để xóa!", "error");
      } else {
        showAlertMessage(response.message || "Xóa thất bại!", "error");
      }
    } catch (error) {
      showAlertMessage("Có lỗi xảy ra khi xóa từ!", "error");
    } finally {
      setOpenDropdownId(null);
    }
  };

  const fetchMyWords = async () => {
    setLoading(true);
    try {
      const response = await rememberWordApi.getAll();

      if (response.success) {
        setMyWords(response.data || []);
      } else {
        showAlertMessage("Không thể tải danh sách từ!", "error");
      }
    } catch (error) {
      console.error("Error fetching words:", error);
      showAlertMessage("Lỗi khi tải từ điển!", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  // Handle synonyms
  const addSynonym = () => {
    if (synonymInput.trim() && !synonyms.includes(synonymInput.trim())) {
      setSynonyms([...synonyms, synonymInput.trim()]);
      setSynonymInput("");
    }
  };

  const removeSynonym = (index) => {
    setSynonyms(synonyms.filter((_, i) => i !== index));
  };

  // Handle examples
  const addExample = () => {
    if (exampleInput.trim() && !examples.includes(exampleInput.trim())) {
      setExamples([...examples, exampleInput.trim()]);
      setExampleInput("");
    }
  };

  const removeExample = (index) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const filteredWords = myWords.filter(
    (wordItem) =>
      wordItem.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wordItem.meaning?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (activeTab === "dictionary") {
      fetchMyWords();
    }
  }, [activeTab]);

  const handleAddWord = async () => {
    if (!word.trim() || !meaning.trim()) {
      showAlertMessage("Vui lòng nhập đầy đủ từ và nghĩa!", "warning");
      return;
    }

    const payload = {
      word: word.trim(),
      meaning: meaning.trim(),
      description: description.trim(),
      synonyms: synonyms,
      example: examples,
    };

    await addNewWord(payload);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background py-1 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-30 rounded-2xl shadow-soft mb-4">
            <Book size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3">
            Từ Điển Cá Nhân
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Xây dựng và quản lý từ vựng tiếng Nhật của bạn
          </p>
        </div>

        {/* Alert */}
        {showAlert && (
          <div
            className={`mb-6 p-4 rounded-xl border-l-4 animate-scale-in ${
              alertType === "success"
                ? "bg-green-50 text-green-800 border-green-400"
                : alertType === "warning"
                ? "bg-yellow-50 text-yellow-800 border-yellow-400"
                : "bg-red-50 text-red-800 border-red-400"
            } shadow-soft`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {alertType === "success" && <Sparkles size={18} className="text-accent-10" />}
                {alertType === "warning" && <AlertTriangle size={18} className="text-accent-10" />}
                {alertType === "error" && <AlertTriangle size={18} className="text-accent-10" />}
                <span className="font-medium">{alertMessage}</span>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="text-lg font-bold opacity-50 hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-soft mb-6 overflow-hidden border border-border-light">
          <div className="flex p-1 bg-background m-2 rounded-xl">
            <button
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 ${
                activeTab === "add"
                  ? "bg-primary-30 text-white shadow-md"
                  : "text-text-secondary hover:text-text-primary hover:bg-white"
              }`}
              onClick={() => setActiveTab("add")}
            >
              <Plus size={18} className={activeTab === "add" ? "text-white" : "text-accent-10"} />
              Thêm từ mới
            </button>
            <button
              className={`flex-1 px-6 py-4 text-sm font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 ${
                activeTab === "dictionary"
                  ? "bg-primary-30 text-white shadow-md"
                  : "text-text-secondary hover:text-text-primary hover:bg-white"
              }`}
              onClick={() => setActiveTab("dictionary")}
            >
              <Book size={18} className={activeTab === "dictionary" ? "text-white" : "text-accent-10"} />
              Từ điển của tôi
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === "dictionary"
                    ? "bg-white text-primary-30"
                    : "bg-primary-30 text-white"
                }`}
              >
                {myWords.length}
              </span>
            </button>
          </div>
        </div>

        {/* Add Word Tab */}
        {activeTab === "add" && (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-border-light animate-fade-in">
            <div className="bg-primary-30 p-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <Plus size={20} />
                Thêm từ vựng mới
              </h2>
            </div>
            <div className="p-6">
              {!display ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-primary-30/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                    <Plus size={32} className="text-accent-10" />
                  </div>
                  <h4 className="text-xl font-semibold text-text-primary mb-3">
                    Bắt đầu xây dựng từ điển
                  </h4>
                  <p className="text-text-secondary mb-6 max-w-md mx-auto">
                    Thêm từ vựng tiếng Nhật đầu tiên để bắt đầu học tập
                  </p>
                  <button
                    onClick={() => setDisplay(true)}
                    className="bg-accent-10 text-white px-6 py-3 rounded-xl hover:shadow-medium transition-all duration-300 flex items-center gap-3 mx-auto font-semibold hover:bg-accent-10/90"
                  >
                    <Plus size={18} />
                    Thêm từ mới
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-scale-in">
                  {/* Word and Meaning */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text-primary">
                        Từ Vựng <span className="text-accent-10">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập từ vựng ..."
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-30 focus:border-transparent transition-all duration-300 bg-white"
                        style={{
                          fontFamily:
                            '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-text-primary">
                        Nghĩa <span className="text-accent-10">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập nghĩa..."
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-30 focus:border-transparent transition-all duration-300 bg-white"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-primary">
                      Ghi chú & Mô tả
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Nhập mô tả, ghi chú về từ vựng..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-30 focus:border-transparent transition-all duration-300 bg-white resize-none"
                    />
                  </div>

                  {/* Synonyms */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-primary flex items-center gap-2">
                      <Tag size={16} className="text-accent-10" />
                      Từ đồng nghĩa
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập từ đồng nghĩa..."
                        value={synonymInput}
                        onChange={(e) => setSynonymInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSynonym()}
                        className="flex-1 px-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-30 focus:border-transparent transition-all duration-300 bg-white"
                        style={{
                          fontFamily:
                            '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                        }}
                      />
                      <button
                        type="button"
                        onClick={addSynonym}
                        className="px-4 py-3 bg-primary-30 text-white rounded-xl hover:bg-primary-30/90 transition-all duration-300 font-semibold"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    {synonyms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {synonyms.map((syn, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-30/10 text-primary-30 rounded-lg text-sm font-medium"
                            style={{
                              fontFamily:
                                '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                            }}
                          >
                            {syn}
                            <button
                              onClick={() => removeSynonym(index)}
                              className="hover:text-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Examples */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-primary flex items-center gap-2">
                      <FileText size={16} className="text-accent-10" />
                      Ví dụ
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập câu ví dụ..."
                        value={exampleInput}
                        onChange={(e) => setExampleInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addExample()}
                        className="flex-1 px-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-30 focus:border-transparent transition-all duration-300 bg-white"
                        style={{
                          fontFamily:
                            '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                        }}
                      />
                      <button
                        type="button"
                        onClick={addExample}
                        className="px-4 py-3 bg-primary-30 text-white rounded-xl hover:bg-primary-30/90 transition-all duration-300 font-semibold"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    {examples.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {examples.map((ex, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 px-3 py-2 bg-accent-10/10 text-text-primary rounded-lg text-sm"
                          >
                            <span
                              className="flex-1"
                              style={{
                                fontFamily:
                                  '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                              }}
                            >
                              {index + 1}. {ex}
                            </span>
                            <button
                              onClick={() => removeExample(index)}
                              className="text-text-muted hover:text-red-600 transition-colors flex-shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-border-light">
                    <button
                      type="button"
                      onClick={() => {
                        setDisplay(false);
                        setWord("");
                        setMeaning("");
                        setDescription("");
                        setSynonyms([]);
                        setExamples([]);
                        setSynonymInput("");
                        setExampleInput("");
                      }}
                      className="px-6 py-3 border border-border-light text-text-secondary rounded-xl hover:bg-background transition-all duration-300 font-semibold"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleAddWord}
                      className="px-6 py-3 bg-accent-10 text-white rounded-xl hover:shadow-medium transition-all duration-300 flex items-center gap-2 font-semibold hover:bg-accent-10/90"
                    >
                      <Plus size={18} />
                      Lưu từ vựng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dictionary Tab */}
        {activeTab === "dictionary" && (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-border-light animate-fade-in">
            <div className="bg-primary-30 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <Book size={20} />
                  Kho từ vựng của tôi
                  <span className="bg-white/20 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    {myWords.length} từ
                  </span>
                </h2>
                <button
                  onClick={fetchMyWords}
                  disabled={loading}
                  className="bg-white text-primary-30 px-4 py-2 rounded-xl hover:shadow-medium transition-all duration-300 flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-30 border-t-transparent"></div>
                  ) : (
                    <RefreshCw size={16} className="text-primary-30" />
                  )}
                  Làm mới
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Search Bar */}
              {myWords.length > 0 && (
                <div className="mb-6">
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"
                      size={18}
                    />
                    <input
                      placeholder="Tìm kiếm từ vựng hoặc nghĩa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-border-light rounded-xl focus:ring-2 focus:ring-primary-30 focus:border-transparent bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-30 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-text-secondary">Đang tải từ điển...</p>
                </div>
              ) : (
                <>
                  {filteredWords.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-primary-30/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                        <Book size={28} className="text-accent-10" />
                      </div>
                      <h4 className="text-lg font-semibold text-text-primary mb-2">
                        {myWords.length === 0
                          ? "Từ điển của bạn đang trống"
                          : "Không tìm thấy từ phù hợp"}
                      </h4>
                      <p className="text-text-secondary mb-6">
                        {myWords.length === 0
                          ? "Hãy thêm từ vựng đầu tiên để bắt đầu học tập!"
                          : "Thử điều chỉnh từ khóa tìm kiếm của bạn"}
                      </p>
                      {myWords.length === 0 && (
                        <button
                          onClick={() => setActiveTab("add")}
                          className="bg-accent-10 text-white px-6 py-3 rounded-xl hover:shadow-medium transition-all duration-300 flex items-center gap-2 mx-auto font-semibold hover:bg-accent-10/90"
                        >
                          <Plus size={18} />
                          Thêm từ đầu tiên
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {filteredWords.map((wordItem, index) => (
                        <div
                          key={wordItem.rwId}
                          className={`border rounded-lg p-4 transition-all duration-300 group relative dropdown-container ${
                            hoveredCard === wordItem.rwId
                              ? "bg-primary-30/10 border-2 border-primary-30 shadow-medium"
                              : "bg-white border-border-light shadow-soft"
                          }`}
                          style={{ animationDelay: `${index * 0.05}s` }}
                          onMouseEnter={() => setHoveredCard(wordItem.rwId)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h5
                                className="text-lg font-bold truncate"
                                style={{
                                  fontFamily:
                                    '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                                }}
                                title={wordItem.word}
                              >
                                {wordItem.word}
                              </h5>
                              <p className="text-sm text-text-secondary mt-1">{wordItem.meaning}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-xs px-2 py-1 rounded font-semibold flex-shrink-0 ${
                                  hoveredCard === wordItem.rwId
                                    ? "bg-primary-30 text-white"
                                    : "bg-primary-30/10 text-primary-30"
                                }`}
                              >
                                #{index + 1}
                              </span>
                              <div className="relative dropdown-container">
                                <button
                                  className="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
                                  onClick={() =>
                                    setOpenDropdownId(
                                      openDropdownId === wordItem.rwId
                                        ? null
                                        : wordItem.rwId
                                    )
                                  }
                                >
                                  <MoreVertical
                                    size={14}
                                    className={
                                      hoveredCard === wordItem.rwId
                                        ? "text-primary-30"
                                        : "text-text-secondary"
                                    }
                                  />
                                </button>

                                {openDropdownId === wordItem.rwId && (
                                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-24 dropdown-container">
                                    <button
                                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-all duration-200"
                                      onClick={() =>
                                        handleDelete(wordItem.rwId)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Extended info appears on hover */}
                          {hoveredCard === wordItem.rwId && (
                            <div className="mt-3 pt-3 border-t border-primary-30/30 animate-scale-in space-y-2">
                              {/* Description */}
                              {wordItem.description && (
                                <div>
                                  <span className="text-xs font-semibold text-primary-30 bg-primary-30/10 px-2 py-1 rounded">
                                    Ghi chú
                                  </span>
                                  <p className="text-text-primary text-sm mt-1">
                                    {wordItem.description}
                                  </p>
                                </div>
                              )}
                              
                              {/* Synonyms */}
                              {wordItem.synonyms && wordItem.synonyms.length > 0 && (
                                <div>
                                  <span className="text-xs font-semibold text-primary-30 bg-primary-30/10 px-2 py-1 rounded inline-flex items-center gap-1">
                                    <Tag size={12} />
                                    Từ đồng nghĩa
                                  </span>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {wordItem.synonyms.map((syn, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs px-2 py-1 bg-accent-10/10 text-accent-10 rounded font-medium"
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
                              {wordItem.example && wordItem.example.length > 0 && (
                                <div>
                                  <span className="text-xs font-semibold text-primary-30 bg-primary-30/10 px-2 py-1 rounded inline-flex items-center gap-1">
                                    <FileText size={12} />
                                    Ví dụ
                                  </span>
                                  <div className="space-y-1 mt-1">
                                    {wordItem.example.map((ex, idx) => (
                                      <p
                                        key={idx}
                                        className="text-xs text-text-primary pl-3 border-l-2 border-accent-10/30"
                                        style={{
                                          fontFamily:
                                            '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
                                        }}
                                      >
                                        {idx + 1}. {ex}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}