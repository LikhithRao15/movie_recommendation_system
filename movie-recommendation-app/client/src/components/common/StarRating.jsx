import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ value = 0, onRate, readonly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 14, md: 20, lg: 28 };
  const starSize = sizes[size] || 20;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = hovered ? star <= hovered : star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onRate?.(star)}
            className={`star-btn ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <FiStar
              size={starSize}
              className={`transition-all duration-100 ${
                filled
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600 hover:text-yellow-400'
              }`}
            />
          </button>
        );
      })}
      {value > 0 && !readonly && (
        <span className="text-yellow-400 text-sm ml-1 font-medium">{value}/5</span>
      )}
    </div>
  );
};

export default StarRating;
