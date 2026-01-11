import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ExtensionBlocker() {
  const [fixedExtensions, setFixedExtensions] = useState([]);
  const [customExtensions, setCustomExtensions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFixedExtensions();
    loadCustomExtensions();
  }, []);

  const loadFixedExtensions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/fixed-extensions`);
      setFixedExtensions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCustomExtensions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/custom-extensions`);
      setCustomExtensions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFixedExtensionToggle = async (extension, currentBlocked) => {
    try {
      await axios.put(`${API_BASE_URL}/fixed-extensions/${extension}`, {
        blocked: !currentBlocked
      });
      loadFixedExtensions();
    } catch (err) {
      alert('변경 실패');
    }
  };

  const handleAddCustomExtension = async () => {
    if (!inputValue.trim()) {
      setError('확장자를 입력해주세요');
      return;
    }

    const normalized = inputValue.toLowerCase().trim().replace(/^\.+/, '');

    if (!normalized || normalized.length > 20) {
      setError('유효하지 않은 확장자입니다');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/custom-extensions`, { extension: normalized });
      setInputValue('');
      loadCustomExtensions();
    } catch (err) {
      setError(err.response?.data?.error || '추가 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomExtension = async (extension) => {
    if (!confirm(`"${extension}" 삭제하시겠습니까?`)) return;

    try {
      await axios.delete(`${API_BASE_URL}/custom-extensions/${extension}`);
      loadCustomExtensions();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCustomExtension();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          파일 확장자 차단 관리
        </h1>
        <p className="text-gray-600">
          파일 확장자에 따라 특정 형식의 파일을 첨부하거나 전송하지 못하도록 제한
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-blue-600">①</span>
          <h2 className="text-xl font-semibold text-gray-800">고정 확장자</h2>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {fixedExtensions.map((item) => (
              <label
                key={item.extension}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={item.blocked === 1}
                  onChange={() => handleFixedExtensionToggle(item.extension, item.blocked === 1)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  {item.extension}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-blue-600">②</span>
          <h2 className="text-xl font-semibold text-gray-800">커스텀 확장자 추가</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="확장자 입력 (예: sh, py, php)"
            maxLength={20}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddCustomExtension}
            disabled={loading || !inputValue.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            추가
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">③</span>
            <h2 className="text-xl font-semibold text-gray-800">
              커스텀 확장자 목록
            </h2>
          </div>
          <div className="text-sm text-gray-600">
            현재 <span className="font-bold text-blue-600">{customExtensions.length}개</span> / 최대 200개
          </div>
        </div>
        {customExtensions.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500 border border-gray-200">
            등록된 커스텀 확장자가 없습니다.
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex flex-wrap gap-2">
              {customExtensions.map((item) => (
                <div
                  key={item.extension}
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-medium"
                >
                  <span>{item.extension}</span>
                  <button
                    onClick={() => handleDeleteCustomExtension(item.extension)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-lg leading-none"
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtensionBlocker;

