// Page styles carried over from the original EJS view
const css = String.raw`
.stats-card {
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            color: white;
            transition: transform 0.3s;
        }
        .stats-card:hover {
            transform: translateY(-5px);
        }
        .bg-total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .bg-pending { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .bg-confirmed { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .bg-paid { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        .bg-checkedin { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .bg-completed { background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }
        .bg-occupancy { background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%); }
        .badge-status { font-size: 0.8em; }
        .status-pending { background-color: #ffc107; }
        .status-confirmed { background-color: #28a745; }
        .status-checked-in { background-color: #17a2b8; }
        .status-completed { background-color: #6c757d; }
        .status-cancelled { background-color: #dc3545; }
        .payment-unpaid { background-color: #ffcccb; }
        .payment-paid { background-color: #d4edda; }
        .payment-partially-paid { background-color: #fff3cd; }
        .action-buttons { white-space: nowrap; }
        .quick-action-btn {
            margin: 2px;
            min-width: 80px;
        }
        .modal-lg-custom { max-width: 800px; }
        .table-hover tbody tr:hover {
            background-color: rgba(0, 123, 255, 0.05);
        }
        .capacity-info {
            font-size: 0.85rem;
            color: #666;
            margin-top: 5px;
        }
        .room-type-badge {
            font-size: 0.7rem;
            margin: 2px;
        }
`;
export default css;
