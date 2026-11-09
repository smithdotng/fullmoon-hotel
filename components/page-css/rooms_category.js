// Page styles carried over from the original EJS view
const css = String.raw`
.guests {
            position: relative;
        }
        .guests .guest-list {
            display: none !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fff;
            border: 1px solid #ddd;
            border-top: none;
            z-index: 9999 !important;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border-radius: 0 0 4px 4px;
            max-height: 300px;
            overflow-y: auto;
        }
        .guests .guest-list.open {
            display: block !important;
        }
        .guests .result {
            cursor: pointer;
        }
        .qty-apply, .qty-close {
            cursor: pointer;
            float: right;
            padding: 12px 15px;
            font-size: 18px;
            color: #666;
        }
        .qty-apply:hover, .qty-close:hover {
            color: #333;
        }
        .guest-list .header {
            background: #f8f8f8;
            padding: 15px;
            border-bottom: 1px solid #eee;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .date-value {
            opacity: 0.6;
            transition: opacity 0.3s;
        }
        .date-value.filled {
            opacity: 1;
            font-weight: 500;
        }
        .guest-list li.clearfix {
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .guest-list li.clearfix:last-child {
            border-bottom: none;
        }
        .guest-list li.clearfix > div:first-child {
            flex: 0 0 60px;
        }
        .guest-list li.clearfix > div:nth-child(2) {
            flex: 1;
            margin-left: 15px;
        }
        .guest-list li.clearfix > div:last-child {
            flex: 0 0 auto;
            display: flex;
            gap: 5px;
        }
        .guest-list .qty-amount {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            width: 60px;
            border: none;
            background: none;
        }
        .guest-list .qty-btn {
            background: #f8f8f8;
            border: 1px solid #ddd;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            width: 40px;
            height: 40px;
            border-radius: 4px;
        }
        .guest-list .qty-btn:hover {
            background: #e8e8e8;
        }
        .guest-list .qty-btn:active {
            background: #ddd;
        }
        .guest-list .qty-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .category-booking {
            background: #f8f8f8;
            padding: 30px 0;
            margin: 0;
        }
        .category-booking .booking-wrapper {
            background: #fff;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        /* Room Image Gallery Enhancements */
        .room-gallery .owl-slider-gallery {
            position: relative;
        }
        .room-gallery .owl-slider-gallery .item {
            height: 500px;
            background-size: cover;
            background-position: center;
        }
        .room-gallery .owl-slider-gallery img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        /* Image Counter */
        .image-counter {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10;
        }
        
        /* Room Header with Image Count */
        .room-header {
            position: relative;
        }
        .room-image-count {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
        }
        
        /* Thumbnail Navigation */
        .gallery-thumbnails {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
        }
        .gallery-thumbnails .thumb {
            width: 80px;
            height: 60px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s, transform 0.3s;
            border: 2px solid transparent;
        }
        .gallery-thumbnails .thumb:hover {
            opacity: 1;
            transform: scale(1.05);
        }
        .gallery-thumbnails .thumb.active {
            opacity: 1;
            border-color: #333;
        }
        .gallery-thumbnails img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        /* Availability badges */
        .availability-badge {
            position: absolute;
            top: 20px;
            left: 20px;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: bold;
            z-index: 10;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .availability-badge.available {
            background-color: #28a745;
            color: white;
        }
        
        .availability-badge.unavailable {
            background-color: #dc3545;
            color: white;
        }
        
        /* Room card styling for unavailable rooms */
        .room-unavailable {
            position: relative;
        }
        
        .room-unavailable-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.03);
            z-index: 1;
            pointer-events: none;
        }
        
        .room-unavailable .book .btn-main {
            background-color: #6c757d;
            border-color: #6c757d;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        .room-unavailable .book .btn-main:hover {
            background-color: #6c757d;
            border-color: #6c757d;
            transform: none;
        }
        
        /* Category stats header */
        .category-stats-header {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #007bff;
        }
        
        .category-stats-header .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .category-stats-header .stat-item {
            text-align: center;
            padding: 10px;
        }
        
        .category-stats-header .stat-item .number {
            font-size: 28px;
            font-weight: bold;
            display: block;
        }
        
        .category-stats-header .stat-item .label {
            font-size: 14px;
            color: #6c757d;
        }
        
        .category-stats-header .stat-item .available .number {
            color: #28a745;
        }
        
        .category-stats-header .stat-item .unavailable .number {
            color: #dc3545;
        }
        
        .category-stats-header .stat-item .total .number {
            color: #007bff;
        }
        
        /* Room image overlay for unavailable rooms */
        .room-gallery .image-overlay {
            position: relative;
        }
        
        .room-gallery .image-overlay.unavailable::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            pointer-events: none;
        }
        
        /* Category Summary */
        .category-image-stats {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        /* Action buttons for unavailable rooms */
        .unavailable-actions {
            padding: 10px 0;
        }
        
        .ml-2 {
            margin-left: 10px;
        }
        
        .mb-4 {
            margin-bottom: 20px;
        }
        
        .mt-1 {
            margin-top: 5px;
        }
        
        .mt-3 {
            margin-top: 15px;
        }
`;
export default css;
