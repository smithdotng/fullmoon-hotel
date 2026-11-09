// Page styles carried over from the original EJS view
const css = String.raw`
.facility-card {
            background: #fff;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            height: 100%;
        }
        .facility-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .facility-card h3 {
            color: #333;
            margin-top: 0;
            border-bottom: 2px solid #c19b76;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .facility-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 6px;
            margin-bottom: 15px;
        }
        .facility-meta {
            background: #f8f9fa;
            padding: 10px 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
        .facility-meta p {
            margin: 5px 0;
            font-size: 14px;
        }
        .booking-modal .modal-header {
            background: #c19b76;
            color: white;
        }
        .booking-modal .modal-title {
            font-weight: 600;
        }
        .book-facility-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .facility-badge {
            background: #c19b76;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .tab-content {
            padding: 30px 0;
        }
        .facility-features {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }
        .facility-features li {
            padding: 5px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .facility-features li:before {
            content: "✓";
            color: #c19b76;
            font-weight: bold;
            margin-right: 10px;
        }
`;
export default css;
