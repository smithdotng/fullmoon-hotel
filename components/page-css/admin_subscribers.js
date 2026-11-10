// Page styles carried over from the original EJS view
const css = String.raw`
.subscriber-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }
        .stat-card {
            background: linear-gradient(135deg, #8B7355 0%, #9a7f5f 100%);
            color: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .stat-card h3 {
            font-size: 2.5rem;
            margin: 0;
        }
        .email-list {
            max-height: 500px;
            overflow-y: auto;
        }
        .email-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s;
        }
        .email-item:hover {
            background-color: #f8f9fa;
        }
        .email-item:last-child {
            border-bottom: none;
        }
        .copy-btn {
            cursor: pointer;
            color: #6c757d;
            transition: color 0.2s;
        }
        .copy-btn:hover {
            color: #00486c;
        }
        .email-info {
            display: flex;
            flex-direction: column;
            gap: 5px;
            flex: 1;
        }
        .email-address {
            font-weight: 600;
            color: #333;
            font-size: 16px;
        }
        .subscription-date {
            color: #6c757d;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .subscription-date i {
            font-size: 12px;
        }
        .email-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .status-badge {
            font-size: 12px;
            padding: 3px 10px;
            border-radius: 12px;
        }
        .badge-active {
            background-color: #d1e7dd;
            color: #0f5132;
        }
        .badge-inactive {
            background-color: #f8d7da;
            color: #842029;
        }
        .source-badge {
            background-color: #e7f1ff;
            color: #0a58ca;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
        }
        .table-header {
            display: grid;
            grid-template-columns: 50px 2fr 1fr 100px 100px 80px;
            padding: 12px 15px;
            background-color: #f8f9fa;
            border-bottom: 2px solid #dee2e6;
            font-weight: 600;
            color: #495057;
        }
        .table-row {
            display: grid;
            grid-template-columns: 50px 2fr 1fr 100px 100px 80px;
            padding: 12px 15px;
            align-items: center;
        }
        .table-row:nth-child(even) {
            background-color: #fcfcfc;
        }
        .table-container {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
        }
        .no-data {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
        }
        .pagination-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: #f8f9fa;
            border-top: 1px solid #dee2e6;
        }
        .time-ago {
            font-size: 11px;
            color: #999;
            margin-left: 5px;
        }
        .email-cell {
            word-break: break-all;
        }
`;
export default css;
